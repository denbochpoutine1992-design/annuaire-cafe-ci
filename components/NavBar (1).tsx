import Link from "next/link";
import { getSessionUserId } from "@/lib/auth";

export default async function NavBar() {
  const userId = await getSessionUserId();

  return (
    <nav
      className="px-6 md:px-12 py-4 flex items-center justify-between"
      style={{ background: "#18181B" }}
    >
      <Link href="/" className="font-display font-semibold text-2xl" style={{ color: "#FFFFFF" }}>
        ☕ Annuaire Café CI
      </Link>
      <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-wide">
        {userId ? (
          <Link href="/dashboard" className="btn-primary px-4 py-2 rounded-full">
            Mon espace
          </Link>
        ) : (
          <>
            <Link href="/login" className="hover:opacity-70" style={{ color: "#FFFFFF" }}>
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
