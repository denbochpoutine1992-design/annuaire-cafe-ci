import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; productId: string } }
) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const vendor = await db.vendor.findUnique({ where: { id: params.id } });
  if (!vendor || vendor.ownerId !== userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const body = await req.json();
  const { name, description, price, photoUrl } = body;

  const updated = await db.product.update({
    where: { id: params.productId },
    data: {
      name: name?.trim() || undefined,
      description: description || null,
      price: price || null,
      photoUrl: photoUrl || null,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; productId: string } }
) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const vendor = await db.vendor.findUnique({ where: { id: params.id } });
  if (!vendor || vendor.ownerId !== userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  await db.product.delete({ where: { id: params.productId } });

  return NextResponse.json({ ok: true });
}
