import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { isAdminUser } from "@/lib/is-admin";
import { parseFcfa } from "@/lib/format";

const MAX_PRODUCTS = 200;

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

/** Une photo doit être une adresse https. */
function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const vendor = await db.vendor.findUnique({
    where: { id: params.id },
    select: { status: true, ownerId: true },
  });
  if (!vendor) return bad("Introuvable.", 404);

  const userId = await getSessionUserId();
  const privileged = !!userId && (vendor.ownerId === userId || (await isAdminUser(userId)));

  // Une fiche non approuvée n'est visible que par son propriétaire et l'administrateur
  if (vendor.status !== "APPROVED" && !privileged) return bad("Introuvable.", 404);

  const products = await db.product.findMany({
    // Le public ne voit que les produits validés par l'administrateur
    where: { vendorId: params.id, ...(privileged ? {} : { status: "APPROVED" as const }) },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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

  const name = text(body.name, 120);
  const description = text(body.description, 1000);
  const price = text(body.price, 40);
  const photoUrl = text(body.photoUrl, 500);

  if (!name) return bad("Le nom de l'article est requis.");

  // Le panier calcule avec ce prix : il doit contenir des chiffres (ex : « 2000 FCFA »)
  if (price && parseFcfa(price) <= 0) {
    return bad("Indiquez le prix en chiffres (ex : 2000 FCFA).");
  }

  if (photoUrl && !isHttpsUrl(photoUrl)) return bad("Adresse de photo invalide.");

  const count = await db.product.count({ where: { vendorId: params.id } });
  if (count >= MAX_PRODUCTS) return bad(`Maximum ${MAX_PRODUCTS} articles par commerce.`);

  const product = await db.product.create({
    data: {
      vendorId: params.id,
      name,
      description: description || null,
      price: price || null,
      photoUrl: photoUrl || null,
      status: "PENDING", // visible par les clients après validation par l'administrateur
    },
  });

  return NextResponse.json(product, { status: 201 });
}
