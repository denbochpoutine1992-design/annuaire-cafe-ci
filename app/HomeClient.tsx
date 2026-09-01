"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import VendorCard from "@/components/VendorCard";
import ProductGrid from "@/components/ProductGrid";
import { CATEGORIES, VILLES } from "@/lib/constants";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function HomeClient() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (cityFilter) params.set("city", cityFilter);
    if (catFilter) params.set("category", catFilter);

    const timeout = setTimeout(() => {
      setLoading(true);
      fetch(`/api/vendors?${params.toString()}`)
        .then((r) => r.json())
        .then((data) => setVendors(Array.isArray(data) ? data : []))
        .catch(() => setVendors([]))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, cityFilter, catFilter]);

  const villesCouvertes = useMemo(() => new Set(vendors.map((v) => v.city)).size, [vendors]);

  const products = useMemo(() => {
    const all = vendors.flatMap((v) =>
      (v.products || []).map((p: any) => ({ ...p, vendorId: v.id, vendorName: v.name }))
    );
    return all.slice(0, 12);
  }, [vendors]);

  return (
    <div>
      <header className="px-6 md:px-12 pt-14 pb-10 border-b border-line">
        <div className="max-w-5xl mx-auto">
          <div className="stamp" style={{ color: "#3F3F46" }}>
            ☕ Côte d'Ivoire · Robusta &amp; Arabica
          </div>
          <h1
            className="font-display mt-5 leading-[0.95] font-semibold"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            L'annuaire du café&nbsp;
            <span style={{ color: "#18181B" }}>ivoirien</span>
          </h1>
          <p className="mt-4 max-w-xl text-base md:text-lg" style={{ color: "#18181B" }}>
            Torréfacteurs, boutiques, cafés de quartier et grossistes — trouvez ou
            faites connaître un vendeur de café en Côte d'Ivoire.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex font-mono text-sm">
              <div className="pr-4">
                <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{vendors.length}</div>
                <div style={{ color: "#71717A" }}>vendeur{vendors.length !== 1 ? "s" : ""}</div>
              </div>
              <div className="px-4 border-l border-line">
                <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{villesCouvertes}</div>
                <div style={{ color: "#71717A" }}>ville{villesCouvertes !== 1 ? "s" : ""}</div>
              </div>
            </div>
            <button
              onClick={() => setShowMap((s) => !s)}
              className="font-mono text-sm px-5 py-3 rounded-full border border-line"
            >
              {showMap ? "Voir la liste" : "🗺️ Voir la carte"}
            </button>
          </div>
        </div>
      </header>

      <div className="px-6 md:px-12 py-4 sticky top-0 z-10 bg-paper border-b border-line">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un nom, un quartier..."
            className="flex-1 px-4 py-3 rounded-lg text-sm border border-line bg-paperRaised"
          />
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-4 py-3 rounded-lg text-sm border border-line bg-paperRaised"
          >
            <option value="">Toutes les villes</option>
            {VILLES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-4 py-3 rounded-lg text-sm border border-line bg-paperRaised"
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <main className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
        {loading ? (
          <div className="text-center py-20 font-mono text-sm" style={{ color: "#71717A" }}>
            Chargement...
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="font-display font-semibold text-2xl">
              Aucun vendeur pour l'instant
            </h3>
            <p className="mt-2 text-sm" style={{ color: "#71717A" }}>
              Essayez d'autres filtres, ou soyez le premier à inscrire un commerce.
            </p>
          </div>
        ) : showMap ? (
          <MapView vendors={vendors} />
        ) : (
          <>
            <ProductGrid products={products} />
            <h2 className="font-semibold text-xl mt-10" style={{ color: "#18181B" }}>
              Tous les vendeurs
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 mt-4">
              {vendors.map((v) => (
                <VendorCard key={v.id} vendor={v} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="px-6 md:px-12 py-8 text-center font-mono text-xs" style={{ color: "#A1A1AA" }}>
        Annuaire communautaire — chaque fiche est ajoutée par son propriétaire. Vérifiez les informations avant tout achat.
      </footer>
    </div>
  );
}
