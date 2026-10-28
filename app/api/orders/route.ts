import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "crypto";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { parseFcfa } from "@/lib/format";
import { isValidPhone } from "@/lib/phone";
import { getAvailableMethods, getMobileInstructions } from "@/lib/payment";
import { computeShippingFee } from "@/lib/shipping";

const MAX_LINES = 30;
const MAX_QTY = 99;
const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans 0/O ni 1/I

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function newReference() {
  let s = "";
  for (let i = 0; i < 6; i++) s += REF_ALPHABET[randomInt(REF_ALPHABET.length)];
  return `ACI-${s}`;
}

/** Levée quand le stock d'un produit ne suffit plus au moment d'enregistrer la commande. */
class StockError extends Error {
  constructor(public productName: string) {
    super("Stock insuffisant");
  }
}

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

/**
 * Une commande = tout le panier, avec les produits de un ou plusieurs vendeurs
 * et UNE seule livraison. Les prix et les frais sont calculés ici, jamais par le navigateur.
 */
export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return bad("Requête invalide.");
    }

    const buyerName = text(body.buyerName, 80);
    const buyerPhone = text(body.buyerPhone, 30);
    const deliveryCity = text(body.deliveryCity, 80);
    const deliveryAddress = text(body.deliveryAddress, 300);
    const note = text(body.note, 300);

    // Moyen de paiement : seulement ceux que la plateforme propose (« Payer à la livraison » par défaut)
    const paymentMethod = text(body.paymentMethod, 20) || "CASH";
    if (!getAvailableMethods().some((m) => m.id === paymentMethod)) {
      return bad("Ce moyen de paiement n'est pas disponible.");
    }

    if (buyerName.length < 2) return bad("Indiquez votre nom.");
    if (!isValidPhone(buyerPhone)) return bad("Indiquez un numéro de téléphone valide.");
    if (!deliveryCity) return bad("Choisissez votre ville.");
    if (deliveryAddress.length < 5) return bad("Indiquez votre adresse de livraison.");

    // Quantités par produit (les doublons sont additionnés). Les prix reçus sont IGNORÉS.
    const rawItems = Array.isArray(body.items) ? body.items : [];
    if (rawItems.length === 0 || rawItems.length > MAX_LINES) return bad("Panier invalide.");

    const quantities = new Map<string, number>();
    for (const raw of rawItems) {
      const r = (raw ?? {}) as Record<string, unknown>;
      const productId = text(r.productId, 80);
      const qty = Math.floor(Number(r.quantity));
      if (!productId || !Number.isFinite(qty) || qty < 1) return bad("Panier invalide.");
      quantities.set(productId, Math.min((quantities.get(productId) ?? 0) + qty, MAX_QTY));
    }

    // Les produits viennent de la base : approuvés, et leur vendeur doit être approuvé aussi
    const products = await db.product.findMany({
      where: {
        id: { in: Array.from(quantities.keys()) },
        status: "APPROVED",
        vendor: { status: "APPROVED" },
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        vendorId: true,
        vendor: { select: { name: true } },
      },
    });
    if (products.length !== quantities.size) {
      return bad("Un produit de votre panier n'est plus disponible. Actualisez votre panier.");
    }

    // Stock : un produit « suivi » (stock renseigné) ne peut pas être commandé au-delà de ce qui reste
    for (const p of products) {
      const qty = quantities.get(p.id) as number;
      if (p.stock !== null && p.stock < qty) {
        return bad(
          p.stock <= 0
            ? `« ${p.name} » est épuisé. Retirez-le de votre panier.`
            : `Il ne reste que ${p.stock} « ${p.name} ». Réduisez la quantité dans votre panier.`
        );
      }
    }
    const tracked = new Set(products.filter((p) => p.stock !== null).map((p) => p.id));

    const lines = products.map((p) => ({
      productId: p.id,
      vendorId: p.vendorId,
      vendorName: p.vendor.name,
      nameSnapshot: p.name,
      unitPriceFcfa: parseFcfa(p.price),
      quantity: quantities.get(p.id) as number,
    }));

    if (lines.some((l) => l.unitPriceFcfa <= 0)) {
      return bad("Un produit n'a pas de prix : retirez-le de votre panier.");
    }

    // Une seule livraison, quel que soit le nombre de vendeurs
    const subtotalFcfa = lines.reduce((sum, l) => sum + l.unitPriceFcfa * l.quantity, 0);
    const shippingFeeFcfa = await computeShippingFee(deliveryCity, subtotalFcfa);
    const totalFcfa = subtotalFcfa + shippingFeeFcfa;

    // Un seul vendeur : on le mémorise (anciens écrans). Plusieurs vendeurs : champs vides.
    const vendorIds = new Set(lines.map((l) => l.vendorId));
    const single = vendorIds.size === 1 ? lines[0] : null;

    const buyerId = await getSessionUserId();

    // La référence est unique en base : on réessaie en cas de collision (très rare)
    let reference = "";
    let created = false;
    for (let attempt = 0; attempt < 5 && !created; attempt++) {
      reference = newReference();
      try {
        await db.$transaction(async (tx) => {
          // Décompte du stock : n'aboutit que s'il en reste assez (deux clients ne peuvent pas
          // acheter la même dernière unité), sinon toute la commande est annulée.
          for (const l of lines) {
            if (!tracked.has(l.productId)) continue;
            const res = await tx.product.updateMany({
              where: { id: l.productId, stock: { gte: l.quantity } },
              data: { stock: { decrement: l.quantity } },
            });
            if (res.count !== 1) throw new StockError(l.nameSnapshot);
          }

          await tx.order.create({
            data: {
              reference,
              vendorId: single ? single.vendorId : null,
              vendorName: single ? single.vendorName : null,
              buyerId,
              buyerName,
              buyerPhone,
              deliveryCity,
              deliveryAddress,
              note: note || null,
              subtotalFcfa,
              shippingFeeFcfa,
              totalFcfa,
              paymentMethod,
              items: { create: lines },
            },
          });
        });
        created = true;
      } catch (e) {
        if (e instanceof StockError) {
          return bad(`Il ne reste plus assez de « ${e.productName} ». Actualisez votre panier.`);
        }
        if ((e as { code?: string }).code !== "P2002") throw e;
      }
    }
    if (!created) return bad("Impossible d'enregistrer la commande. Réessayez.", 500);

    // Le client n'est jamais mis en contact avec un vendeur : c'est la plateforme qui le recontacte.
    // Pour Mobile Money, on renvoie le numéro et le titulaire auxquels il doit envoyer l'argent.
    const payment = paymentMethod === "CASH" ? null : getMobileInstructions(paymentMethod);

    return NextResponse.json(
      { reference, subtotalFcfa, shippingFeeFcfa, totalFcfa, payment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur commande :", error);
    return bad("Une erreur est survenue. Réessayez dans un instant.", 500);
  }
}
