import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { isAdminUser } from "@/lib/is-admin";
import { toPublicVendor } from "@/lib/public-vendor";
import { CONTACT_BLOCKED_MESSAGE, containsContactInfo } from "@/lib/contact-filter";
import { CATEGORIES } from "@/lib/constants";

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

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const vendor = await db.vendor.findUnique({
    where: { id: params.id },
    include: {
      photos: { orderBy: { createdAt: "asc" } },
      reviews: { orderBy: { createdAt: "desc" } },
      products: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!vendor) return bad("Introuvable.", 404);

  // Le propriétaire et l'administrateur voient tout (y compris les fiches en attente).
  const userId = await getSessionUserId();
  const privileged = !!userId && (vendor.ownerId === userId || (await isAdminUser(userId)));

  // Une fiche en attente ou refusée n'est visible que par eux.
  if (vendor.status !== "APPROVED" && !privileged) return bad("Introuvable.", 404);

  // Le propriétaire et l'administrateur voient tous les produits (avec leur statut).
  if (privileged) return NextResponse.json(vendor);

  // Le public ne reçoit ni téléphone, ni position, ni quartier, et seulement les produits approuvés.
  return NextResponse.json({
    ...toPublicVendor(vendor),
    products: vendor.products.filter((p) => p.status === "APPROVED"),
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getSessionUserId();
  if (!userId) return bad("Non authentifié.", 401);

  const vendor = await db.vendor.findUnique({
    where: { id: params.id },
    select: { id: true, ownerId: true },
  });
  if (!vendor || vendor.ownerId !== userId) return bad("Non autorisé.", 403);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("Requête invalide.");
  }

  // Seuls ces champs sont modifiables par le vendeur : jamais status, featured ni ownerId.
  const data: {
    name?: string;
    category?: string;
    city?: string;
    phone?: string;
    neighborhood?: string | null;
    description?: string | null;
    priceInfo?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  } = {};

  if ("name" in body) {
    const v = text(body.name, 120);
    if (!v) return bad("Le nom est requis.");
    data.name = v;
  }
  if ("category" in body) {
    const v = text(body.category, 40);
    if (!CATEGORIES.some((c: { id: string }) => c.id === v)) return bad("Catégorie invalide.");
    data.category = v;
  }
  if ("city" in body) {
    const v = text(body.city, 80);
    if (!v) return bad("La ville est requise.");
    data.city = v;
  }
  if ("phone" in body) {
    const v = text(body.phone, 30);
    const digits = v.replace(/\D/g, "").length;
    if (digits < 8 || digits > 15) return bad("Numéro de téléphone invalide.");
    data.phone = v;
  }
  if ("neighborhood" in body) data.neighborhood = text(body.neighborhood, 120) || null;
  if ("description" in body) data.description = text(body.description, 2000) || null;
  if ("priceInfo" in body) data.priceInfo = text(body.priceInfo, 300) || null;
  if ("latitude" in body) data.latitude = coord(body.latitude, -90, 90);
  if ("longitude" in body) data.longitude = coord(body.longitude, -180, 180);

  if (containsContactInfo(data.name, data.neighborhood, data.description, data.priceInfo)) {
    return bad(CONTACT_BLOCKED_MESSAGE);
  }

  const updated = await db.vendor.update({ where: { id: params.id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getSessionUserId();
  if (!userId) return bad("Non authentifié.", 401);

  const vendor = await db.vendor.findUnique({
    where: { id: params.id },
    select: { id: true, ownerId: true },
  });
  if (!vendor || vendor.ownerId !== userId) return bad("Non autorisé.", 403);

  await db.vendor.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
