import Link from "next/link";
import { getSessionUserId } from "@/lib/auth";

export default async function NavBar() {
  const userId = await getSessionUserId();

  return (
    <nav className="px-6 md:px-12 py-4 flex items-center justify-between border-b border-line">
      <Link href="/" className="font-display font-semibold text-lg" style={{ color: "#2B1B14" }}>
        ☕ Annuaire Café CI
      </Link>
      <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-wide">
        {userId ? (
          <Link href="/dashboard" className="btn-primary px-4 py-2 rounded-full">
            Mon espace
          </Link>
        ) : (
          <>
            <Link href="/login" className="hover:opacity-70">
              Connexion
            </Link>
            <Link href="/register" className="btn-primary px-4 py-2 rounded-full">
              Inscrire mon commerce
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
