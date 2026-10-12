import Link from "next/link";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Accès refusé",
  robots: { index: false, follow: false },
};

export default async function AdminDenied() {
  const userId = await getSessionUserId();
  const user = userId
    ? await db.user.findUnique({ where: { id: userId }, select: { email: true } })
    : null;

  const configured = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean).length;

  return (
    <main className="mx-auto max-w-xl px-5 py-24">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Accès refusé</h1>

      {user ? (
        <div className="mt-5 space-y-3 text-[#4A3F36]">
          <p>
            Vous êtes connecté avec <strong>{user.email}</strong>, mais ce compte n’est pas
            autorisé à accéder à l’administration.
          </p>
          <p className="text-sm text-[#6B5F55]">
            {configured === 0
              ? "La variable ADMIN_EMAILS n’est pas définie sur ce déploiement."
              : `${configured} adresse(s) administrateur configurée(s) : vérifiez que l’adresse ci-dessus en fait partie, sans faute de frappe.`}
          </p>
        </div>
      ) : (
        <p className="mt-5 text-[#4A3F36]">
          Vous n’êtes pas connecté.{" "}
          <Link href="/login?next=/admin" className="underline">
            Se connecter
          </Link>
        </p>
      )}

      <p className="mt-8">
        <Link href="/" className="underline">
          Retour à l’accueil
        </Link>
      </p>
    </main>
  );
}
