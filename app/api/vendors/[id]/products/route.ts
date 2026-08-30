import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const products = await db.product.findMany({
    where: { vendorId: params.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const vendor = await db.vendor.findUnique({ where: { id: params.id } });
  if (!vendor || vendor.ownerId !== userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const body = await req.json();
  const { name, description, price, photoUrl } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Le nom de l'article est requis." }, { status: 400 });
  }

  const product = await db.product.create({
    data: {
      vendorId: params.id,
      name: name.trim(),
      description: description || null,
      price: price || null,
      photoUrl: photoUrl || null,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
