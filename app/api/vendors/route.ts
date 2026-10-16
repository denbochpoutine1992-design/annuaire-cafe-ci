import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { CATEGORIES } from "@/lib/constants";
import { toPublicVendor } from "@/lib/public-vendor";

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function coord(value: unknown, min: number, max: number) {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
      ? Number(value)
      : NaN;
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || undefined;
  const category = searchParams.get("category") || undefined;
  const q = searchParams.get("q") || undefined;
  const mine = searchParams.get("mine");

  // Espace du commerçant : toutes ses fiches, quel que soit leur statut
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

  // Annuaire public : uniquement les fiches approuvées
  const vendors = await db.vendor.findMany({
    where: {
      status: "APPROVED",
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
      products: {
        where: { status: "APPROVED" },
        select: { id: true, name: true, price: true, photoUrl: true },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  const now = new Date();
  const isFeatured = (v: { featured: boolean; featuredUntil: Date | null }) =>
    v.featured && v.featuredUntil !== null && v.featuredUntil > now;

  const sorted = vendors.sort((a, b) => Number(isFeatured(b)) - Number(isFeatured(a)));

  return NextResponse.json(sorted.map(toPublicVendor));
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const name = text(body.name, 120);
  const category = text(body.category, 40);
  const city = text(body.city, 80);
  const neighborhood = text(body.neighborhood, 120);
  const description = text(body.description, 2000);
  const phone = text(body.phone, 30);
  const priceInfo = text(body.priceInfo, 300);

  if (!name || !category || !city || !phone) {
    return NextResponse.json(
      { error: "Nom, catégorie, ville et téléphone sont requis." },
      { status: 400 }
    );
  }

  if (!CATEGORIES.some((c: { id: string }) => c.id === category)) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
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
      latitude: coord(body.latitude, -90, 90),
      longitude: coord(body.longitude, -180, 180),
      status: "PENDING", // visible dans l'annuaire après validation par l'administrateur
    },
  });

  return NextResponse.json(vendor, { status: 201 });
}
