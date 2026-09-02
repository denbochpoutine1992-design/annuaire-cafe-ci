import Link from "next/link";
import { getSessionUserId } from "@/lib/auth";

export default async function NavBar() {
  const userId = await getSessionUserId();

  return (
    <nav className="px-6 md:px-12 py-4 flex items-center justify-between border-b border-line bg-white">
      <Link href="/" className="font-semibold text-lg whitespace-nowrap" style={{ color: "#18181B" }}>
        ☕ Annuaire Café CI
      </Link>
      <div className="flex items-center gap-3 text-sm font-medium">
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
              Inscrire mon commerce
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
