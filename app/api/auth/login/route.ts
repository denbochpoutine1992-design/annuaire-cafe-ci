import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await db.user.findUnique({ where: { email: (email || "").toLowerCase() } });
  if (!user || !(await verifyPassword(password || "", user.password))) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
  }

  await createSessionCookie(user.id);
  return NextResponse.json({ id: user.id, email: user.email });
}
