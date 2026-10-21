import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Nombre de ventes confirmées (à préparer) pour les commerces du vendeur connecté. */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ count: 0 }, { status: 401 });

  const count = await db.order.count({
    where: { status: "CONFIRMED", vendor: { ownerId: userId } },
  });

  return NextResponse.json({ count });
}
