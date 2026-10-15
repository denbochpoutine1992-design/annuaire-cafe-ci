import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "crypto";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { parseFcfa } from "@/lib/format";
import { isValidPhone } from "@/lib/phone";

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

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return bad("Requête invalide.");
    }

    const vendorId = text(body.vendorId, 80);
    const buyerName = text(body.buyerName, 80);
    const buyerPhone = text(body.buyerPhone, 30);
    const deliveryCity = text(body.deliveryCity, 80);
    const deliveryAddress = text(body.deliveryAddress, 300);
    const note = text(body.note, 300);

    if (!vendorId) return bad("Vendeur manquant.");
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

    // Le vendeur doit exister et être approuvé
    const vendor = await db.vendor.findUnique({
      where: { id: vendorId },
      select: { id: true, name: true, status: true },
    });
    if (!vendor || vendor.status !== "APPROVED") {
      return bad("Ce vendeur n'est plus disponible.", 404);
    }

    // Les produits doivent appartenir à CE vendeur ; les prix viennent de la base
    const products = await db.product.findMany({
      where: { id: { in: Array.from(quantities.keys()) }, vendorId: vendor.id },
      select: { id: true, name: true, price: true },
    });
    if (products.length !== quantities.size) {
      return bad("Un produit de votre panier n'est plus disponible. Actualisez votre panier.");
    }

    const lines = products.map((p) => ({
      productId: p.id,
      nameSnapshot: p.name,
      unitPriceFcfa: parseFcfa(p.price),
      quantity: quantities.get(p.id) as number,
    }));

    if (lines.some((l) => l.unitPriceFcfa <= 0)) {
      return bad("Un produit n'a pas de prix : contactez directement le vendeur.");
    }

    const totalFcfa = lines.reduce((sum, l) => sum + l.unitPriceFcfa * l.quantity, 0);
    const buyerId = await getSessionUserId();

    // La référence est unique en base : on réessaie en cas de collision (très rare)
    let reference = "";
    let created = false;
    for (let attempt = 0; attempt < 5 && !created; attempt++) {
      reference = newReference();
      try {
        await db.order.create({
          data: {
            reference,
            vendorId: vendor.id,
            vendorName: vendor.name,
            buyerId,
            buyerName,
            buyerPhone,
            deliveryCity,
            deliveryAddress,
            note: note || null,
            totalFcfa,
            items: { create: lines },
          },
        });
        created = true;
      } catch (e) {
        if ((e as { code?: string }).code !== "P2002") throw e;
      }
    }
    if (!created) return bad("Impossible d'enregistrer la commande. Réessayez.", 500);

    // Le client n'est jamais mis en contact avec le vendeur : c'est la plateforme qui le recontacte.
    return NextResponse.json({ reference, totalFcfa }, { status: 201 });
  } catch (error) {
    console.error("Erreur commande :", error);
    return bad("Une erreur est survenue. Réessayez dans un instant.", 500);
  }
}
