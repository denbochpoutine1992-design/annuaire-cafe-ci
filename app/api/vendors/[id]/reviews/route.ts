import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const reviews = await db.review.findMany({
    where: { vendorId: params.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { authorName, rating, comment } = await req.json();

  const r = Number(rating);
  if (!authorName?.trim() || !r || r < 1 || r > 5) {
    return NextResponse.json(
      { error: "Nom et note (1 à 5) requis." },
      { status: 400 }
    );
  }

  const vendor = await db.vendor.findUnique({ where: { id: params.id } });
  if (!vendor) return NextResponse.json({ error: "Vendeur introuvable." }, { status: 404 });

  const review = await db.review.create({
    data: {
      vendorId: params.id,
      authorName: authorName.trim().slice(0, 60),
      rating: r,
      comment: comment?.trim().slice(0, 500) || null,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
