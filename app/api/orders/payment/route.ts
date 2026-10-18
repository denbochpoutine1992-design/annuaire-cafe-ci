import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toIntlDigits } from "@/lib/phone";

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

/**
 * Le client indique l'identifiant de sa transaction Mobile Money.
 * La commande passe « à vérifier » : c'est l'administrateur qui contrôle le paiement et le valide.
 */
export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return bad("Requête invalide.");
    }

    const reference = typeof body.reference === "string" ? body.reference.trim().toUpperCase() : "";
    const buyerPhone = typeof body.buyerPhone === "string" ? body.buyerPhone : "";
    const paymentRef = typeof body.paymentRef === "string" ? body.paymentRef.trim() : "";

    if (!reference) return bad("Référence de commande manquante.");
    if (!/^[A-Za-z0-9 ._-]{4,40}$/.test(paymentRef)) {
      return bad("Saisissez l'identifiant de la transaction reçu par SMS (4 à 40 caractères).");
    }

    const order = await db.order.findUnique({
      where: { reference },
      select: { id: true, buyerPhone: true, paymentMethod: true, paymentStatus: true, status: true },
    });

    // Même réponse si la commande n'existe pas ou si le téléphone ne correspond pas
    const phoneMatches =
      !!order && toIntlDigits(order.buyerPhone) === toIntlDigits(buyerPhone) && !!toIntlDigits(buyerPhone);
    if (!order || !phoneMatches) return bad("Commande introuvable.", 404);

    if (!order.paymentMethod || order.paymentMethod === "CASH") {
      return bad("Cette commande se paie à la livraison.");
    }
    if (order.status === "CANCELLED") return bad("Cette commande est annulée.");
    if (order.paymentStatus === "PAID") return bad("Cette commande est déjà payée.");

    await db.order.update({
      where: { id: order.id },
      data: { paymentRef, paymentStatus: "TO_VERIFY" },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur paiement :", error);
    return bad("Une erreur est survenue. Réessayez dans un instant.", 500);
  }
}
