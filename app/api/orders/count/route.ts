import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Nombre de ventes confirmées (à préparer) qui contiennent des produits du vendeur connecté. */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ count: 0 }, { status: 401 });

  const vendors = await db.vendor.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });
  const ids = vendors.map((v) => v.id);
  if (ids.length === 0) return NextResponse.json({ count: 0 });

  const count = await db.order.count({
    where: {
      status: "CONFIRMED",
      OR: [{ vendorId: { in: ids } }, { items: { some: { vendorId: { in: ids } } } }],
    },
  });

  return NextResponse.json({ count });
}
