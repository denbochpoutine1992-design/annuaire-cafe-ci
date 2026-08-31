"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { catLabel } from "@/lib/constants";

export default function DashboardPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendors?mine=1")
      .then((r) => r.json())
      .then((data) => setVendors(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <nav className="px-6 md:px-12 py-4 flex items-center justify-between border-b border-line">
        <Link href="/" className="font-display font-semibold text-lg">☕ Annuaire Café CI</Link>
        <button onClick={logout} className="font-mono text-xs uppercase tracking-wide">
          Déconnexion
        </button>
      </nav>

      <main className="px-6 md:px-12 py-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-semibold text-3xl">Mes commerces</h1>
          <Link href="/dashboard/new" className="btn-primary font-mono text-sm px-5 py-3 rounded-full">
            + Ajouter un commerce
          </Link>
        </div>

        {loading ? (
          <p className="mt-8 font-mono text-sm" style={{ color: "#78716C" }}>Chargement...</p>
        ) : vendors.length === 0 ? (
          <div className="mt-10 text-center py-16 stitch bg-paperRaised">
            <p style={{ color: "#78716C" }}>Vous n'avez pas encore de fiche.</p>
            <Link href="/dashboard/new" className="btn-primary inline-block font-mono text-sm px-5 py-3 rounded-full mt-4">
              Créer ma première fiche
            </Link>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            {vendors.map((v) => (
              <Link
                key={v.id}
                href={`/dashboard/${v.id}`}
                className="stitch bg-paperRaised p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-display font-semibold">{v.name}</div>
                  <div className="text-xs font-mono mt-1" style={{ color: "#78716C" }}>
                    {catLabel(v.category)} · {v.city} · {v.photos?.length || 0} photo(s) · {v.products?.length || 0} article(s) · {v.reviews?.length || 0} avis
                  </div>
                </div>
                <span className="font-mono text-xs" style={{ color: "#C2410C" }}>Gérer →</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
