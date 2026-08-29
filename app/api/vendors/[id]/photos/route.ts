import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

async function assertOwner(vendorId: string, userId: string | null) {
  if (!userId) return false;
  const vendor = await db.vendor.findUnique({ where: { id: vendorId } });
  return !!vendor && vendor.ownerId === userId;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getSessionUserId();
  if (!(await assertOwner(params.id, userId))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "URL manquante." }, { status: 400 });

  const photo = await db.photo.create({ data: { vendorId: params.id, url } });
  return NextResponse.json(photo, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getSessionUserId();
  if (!(await assertOwner(params.id, userId))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { photoId } = await req.json();
  await db.photo.delete({ where: { id: photoId } });
  return NextResponse.json({ ok: true });
}
