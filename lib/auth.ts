import { SignJWT, jwtVerify } from "jose";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "acdi_session";

// En production, AUTH_SECRET est obligatoire : sans lui, n'importe qui
// pourrait fabriquer une session valide avec la clé par défaut.
const secret = () => {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET manquant");
    }
    return new TextEncoder().encode("dev-secret-change-me");
  }
  return new TextEncoder().encode(value);
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionCookie(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function getSessionUserId(): Promise<string | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return (payload.userId as string) || null;
  } catch {
    return null;
  }
}

export async function verifyTokenEdge(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
