import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

const MAX_PHOTOS = 20;

/** Le commerce doit exister et appartenir à l'utilisateur connecté. */
async function isOwner(vendorId: string, userId: string | null) {
  if (!userId) return false;
  const vendor = await db.vendor.findUnique({
    where: { id: vendorId },
    select: { ownerId: true },
  });
  return vendor?.ownerId === userId;
}

/** Une photo doit être une adresse https (pas de javascript:, data:, http:…). */
function isValidImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 500) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getSessionUserId();
  if (!(await isOwner(params.id, userId))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  let body: { url?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!isValidImageUrl(body.url)) {
    return NextResponse.json({ error: "Adresse de photo invalide." }, { status: 400 });
  }

  const count = await db.photo.count({ where: { vendorId: params.id } });
  if (count >= MAX_PHOTOS) {
    return NextResponse.json(
      { error: `Maximum ${MAX_PHOTOS} photos par commerce.` },
      { status: 400 }
    );
  }

  const photo = await db.photo.create({ data: { vendorId: params.id, url: body.url } });
  return NextResponse.json(photo, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getSessionUserId();
  if (!(await isOwner(params.id, userId))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  let body: { photoId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const photoId = typeof body.photoId === "string" ? body.photoId : "";
  if (!photoId) {
    return NextResponse.json({ error: "Photo manquante." }, { status: 400 });
  }

  // On ne supprime que si la photo appartient bien à CE commerce :
  // sans cette condition, un vendeur pourrait effacer les photos d'un autre.
  const { count } = await db.photo.deleteMany({
    where: { id: photoId, vendorId: params.id },
  });
  if (count === 0) {
    return NextResponse.json({ error: "Photo introuvable." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
