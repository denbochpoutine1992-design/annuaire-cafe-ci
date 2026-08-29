import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Email requis et mot de passe d'au moins 6 caractères." },
      { status: 400 }
    );
  }

  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
  }

  const user = await db.user.create({
    data: { email: email.toLowerCase(), password: await hashPassword(password) },
  });

  await createSessionCookie(user.id);
  return NextResponse.json({ id: user.id, email: user.email });
}
