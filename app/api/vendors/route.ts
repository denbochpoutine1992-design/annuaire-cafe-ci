import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || undefined;
  const category = searchParams.get("category") || undefined;
  const q = searchParams.get("q") || undefined;
  const mine = searchParams.get("mine");

  if (mine === "1") {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    const vendors = await db.vendor.findMany({
      where: { ownerId: userId },
      include: { photos: true, reviews: true, products: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(vendors);
  }

  const vendors = await db.vendor.findMany({
    where: {
      ...(city ? { city } : {}),
      ...(category ? { category } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { neighborhood: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      photos: { take: 1, orderBy: { createdAt: "asc" } },
      reviews: { select: { rating: true } },
      products: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(vendors);
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await req.json();
  const { name, category, city, neighborhood, description, phone, priceInfo, latitude, longitude } = body;

  if (!name || !category || !city || !phone) {
    return NextResponse.json({ error: "Nom, catégorie, ville et téléphone sont requis." }, { status: 400 });
  }

  const vendor = await db.vendor.create({
    data: {
      ownerId: userId,
      name,
      category,
      city,
      neighborhood: neighborhood || null,
      description: description || null,
      phone,
      priceInfo: priceInfo || null,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    },
  });

  return NextResponse.json(vendor, { status: 201 });
}
