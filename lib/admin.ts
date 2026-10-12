import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

/** Adresses e-mail administrateur, définies dans la variable ADMIN_EMAILS (séparées par des virgules). */
function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * À appeler en tête de chaque page et de chaque action d'administration.
 * - Pas connecté : redirection vers la connexion.
 * - Connecté mais pas administrateur : page 404 (l'existence de /admin n'est pas révélée).
 */
export async function requireAdmin() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login?next=/admin");

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user || !adminEmails().includes(user.email.toLowerCase())) notFound();

  return user;
}
