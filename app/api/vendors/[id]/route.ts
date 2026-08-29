import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const vendor = await db.vendor.findUnique({
    where: { id: params.id },
    include: {
      photos: { orderBy: { createdAt: "asc" } },
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!vendor) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json(vendor);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const vendor = await db.vendor.findUnique({ where: { id: params.id } });
  if (!vendor || vendor.ownerId !== userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const body = await req.json();
  const updated = await db.vendor.update({
    where: { id: params.id },
    data: {
      name: body.name ?? vendor.name,
      category: body.category ?? vendor.category,
      city: body.city ?? vendor.city,
      neighborhood: body.neighborhood ?? vendor.neighborhood,
      description: body.description ?? vendor.description,
      phone: body.phone ?? vendor.phone,
      priceInfo: body.priceInfo ?? vendor.priceInfo,
      latitude: body.latitude ?? vendor.latitude,
      longitude: body.longitude ?? vendor.longitude,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const vendor = await db.vendor.findUnique({ where: { id: params.id } });
  if (!vendor || vendor.ownerId !== userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  await db.vendor.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
