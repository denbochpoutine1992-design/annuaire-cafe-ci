import { NextRequest, NextResponse } from "next/server";
import type { Product } from "@prisma/client";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { parseFcfa } from "@/lib/format";
import { CONTACT_BLOCKED_MESSAGE, containsContactInfo } from "@/lib/contact-filter";

type Ctx = { params: { id: string; productId: string } };

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

type Loaded = { ok: false; error: NextResponse } | { ok: true; product: Product };

/** Le produit doit appartenir à CE commerce, et le commerce au vendeur connecté. */
async function loadOwnedProduct(ctx: Ctx): Promise<Loaded> {
  const userId = await getSessionUserId();
  if (!userId) return { ok: false, error: bad("Non authentifié.", 401) };

  const product = await db.product.findFirst({
    where: {
      id: ctx.params.productId,
      vendorId: ctx.params.id,
      vendor: { ownerId: userId },
    },
  });
  if (!product) return { ok: false, error: bad("Introuvable.", 404) };

  return { ok: true, product };
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const found = await loadOwnedProduct(ctx);
  if (!found.ok) return found.error;
  const { product } = found;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("Requête invalide.");
  }

  const name = "name" in body ? text(body.name, 120) : product.name;
  const description =
    "description" in body ? text(body.description, 1000) || null : product.description;
  const price = "price" in body ? text(body.price, 40) || null : product.price;
  const photoUrl = "photoUrl" in body ? text(body.photoUrl, 500) || null : product.photoUrl;

  if (!name) return bad("Le nom de l'article est requis.");
  if (containsContactInfo(name, description)) return bad(CONTACT_BLOCKED_MESSAGE);
  if (price && parseFcfa(price) <= 0) return bad("Indiquez le prix en chiffres (ex : 2000 FCFA).");
  if (photoUrl && !isHttpsUrl(photoUrl)) return bad("Adresse de photo invalide.");

  // Toute modification du produit (nom, prix, photo, description) repasse par la validation de l'administrateur.
  const changed =
    name !== product.name ||
    description !== product.description ||
    price !== product.price ||
    photoUrl !== product.photoUrl;

  const updated = await db.product.update({
    where: { id: product.id },
    data: { name, description, price, photoUrl, ...(changed ? { status: "PENDING" as const } : {}) },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const found = await loadOwnedProduct(ctx);
  if (!found.ok) return found.error;

  await db.product.delete({ where: { id: found.product.id } });
  return NextResponse.json({ ok: true });
}
