import Link from "next/link";
import { getSessionUserId } from "@/lib/auth";
import CartLink from "@/components/CartLink";

export default async function NavBar() {
  const userId = await getSessionUserId();

  return (
    <nav className="px-4 sm:px-6 md:px-12 py-4 flex items-center justify-between gap-3 border-b border-line bg-white">
      <Link href="/" className="font-semibold text-base sm:text-lg whitespace-nowrap" style={{ color: "#18181B" }}>
        ☕ Annuaire Café CI
      </Link>
      <div className="flex items-center gap-2 sm:gap-3 text-sm font-medium">
        <CartLink />
        {userId ? (
          <Link href="/dashboard" className="btn-primary px-4 py-2 rounded-full whitespace-nowrap">
            Mon espace
          </Link>
        ) : (
          <>
            <Link href="/login" className="hover:opacity-70 whitespace-nowrap" style={{ color: "#18181B" }}>
              Connexion
            </Link>
            <Link href="/register" className="btn-primary px-4 py-2 rounded-full whitespace-nowrap">
              <span className="hidden sm:inline">Inscrire mon commerce</span>
              <span className="sm:hidden">S’inscrire</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
