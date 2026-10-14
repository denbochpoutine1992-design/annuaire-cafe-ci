import { db } from "@/lib/db";

/**
 * Vrai si l'utilisateur est administrateur (son e-mail figure dans ADMIN_EMAILS).
 * Version « silencieuse » : elle ne redirige pas, contrairement à requireAdmin().
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (admins.length === 0) return false;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  return !!user && admins.includes(user.email.toLowerCase());
}
