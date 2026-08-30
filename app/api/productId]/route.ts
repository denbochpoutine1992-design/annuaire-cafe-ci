import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

async function assertOwner(vendorId: string, userId: string | null) {
  if (!userId) return false;
  const vendor = await db.vendor.findUnique({ where: { id: vendorId } });
  return !!vendor && vendor.ownerId === userId;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; productId: string } }
) {
  const userId = await getSessionUserId();
  if (!(await assertOwner(params.id, userId))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const product = await db.product.findUnique({ where: { id: params.productId } });
  if (!product || product.vendorId !== params.id) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  const body = await req.json();
  const updated = await db.product.update({
    where: { id: params.productId },
    data: {
      name: body.name?.trim() || product.name,
      description: body.description ?? product.description,
      price: body.price ?? product.price,
      photoUrl: body.photoUrl ?? product.photoUrl,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; productId: string } }
) {
  const userId = await getSessionUserId();
  if (!(await assertOwner(params.id, userId))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const product = await db.product.findUnique({ where: { id: params.productId } });
  if (!product || product.vendorId !== params.id) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  await db.product.delete({ where: { id: params.productId } });
  return NextResponse.json({ ok: true });
}
