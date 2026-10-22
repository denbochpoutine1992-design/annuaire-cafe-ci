import { NextRequest, NextResponse } from "next/server";
import { computeShippingFee } from "@/lib/shipping";

export const dynamic = "force-dynamic";

/**
 * Estimation des frais de livraison affichée dans le panier.
 * Le montant réellement facturé est recalculé par le serveur au moment de la commande.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const city = (searchParams.get("city") ?? "").trim().slice(0, 80);
  const subtotal = Math.max(0, Math.floor(Number(searchParams.get("subtotal")) || 0));

  if (!city) return NextResponse.json({ fee: null });

  const fee = await computeShippingFee(city, subtotal);
  return NextResponse.json({ fee });
}
