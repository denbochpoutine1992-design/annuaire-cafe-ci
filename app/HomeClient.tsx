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
      <header className="px-6 md:px-12 pt-14 pb-12" style={{ background: "#F4F4F5" }}>
        <div className="max-w-5xl mx-auto">
          <div className="stamp" style={{ color: "#3F3F46" }}>
            ☕ Côte d'Ivoire · Robusta &amp; Arabica
          </div>
          <h1
            className="mt-5 leading-[1.05] font-bold"
            style={{ fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)", color: "#18181B" }}
          >
            L'annuaire du café ivoirien
          </h1>
          <p className="mt-4 max-w-xl text-base md:text-lg" style={{ color: "#3F3F46" }}>
            Torréfacteurs, boutiques, cafés de quartier et grossistes — trouvez ou
            faites connaître un vendeur de café en Côte d'Ivoire.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            <div className="stitch p-4 text-center">
              <div className="text-2xl font-bold">{vendors.length}</div>
              <div className="text-xs mt-1" style={{ color: "#71717A" }}>
                Vendeur{vendors.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="stitch p-4 text-center">
              <div className="text-2xl font-bold">{villesCouvertes}</div>
              <div className="text-xs mt-1" style={{ color: "#71717A" }}>
                Ville{villesCouvertes !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="stitch p-4 text-center">
              <div className="text-2xl font-bold">{products.length}</div>
              <div className="text-xs mt-1" style={{ color: "#71717A" }}>
                Article{products.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowMap((s) => !s)}
            className="mt-6 text-sm px-5 py-3 rounded-full font-medium"
            style={{ border: "1px solid #E4E4E7", background: "#fff" }}
          >
            {showMap ? "Voir la liste" : "🗺️ Voir la carte"}
          </button>
        </div>
      </header>

      <div className="px-6 md:px-12 -mt-6 relative z-10">
        <div
          className="max-w-5xl mx-auto flex flex-col md:flex-row gap-3 p-3 rounded-2xl"
          style={{ background: "#fff", border: "1px solid #E4E4E7", boxShadow: "0 12px 24px -16px rgba(24,24,27,0.18)" }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍  Rechercher un nom, un quartier..."
            className="flex-1 px-4 py-3 rounded-xl text-sm border border-line"
          />
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm border border-line"
          >
            <option value="">Toutes les villes</option>
            {VILLES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm border border-line"
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

      <footer className="mt-10" style={{ background: "#18181B" }}>
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 grid sm:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="font-semibold text-base text-white">☕ Annuaire Café CI</div>
            <p className="mt-2" style={{ color: "#A1A1AA" }}>
              L'annuaire de référence des professionnels du café en Côte d'Ivoire.
            </p>
          </div>
          <div>
            <div className="font-semibold text-white mb-2">Liens utiles</div>
            <div className="flex flex-col gap-1.5" style={{ color: "#A1A1AA" }}>
              <a href="/register" className="hover:text-white">Inscrire mon commerce</a>
              <a href="/devenir-premium" className="hover:text-white">Fiche vedette</a>
              <a href="/login" className="hover:text-white">Connexion</a>
            </div>
          </div>
          <div>
            <div className="font-semibold text-white mb-2">Contact</div>
            <a
              href="https://wa.me/2250749583050"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              style={{ color: "#A1A1AA" }}
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
        <div
          className="text-center text-xs py-5"
          style={{ color: "#71717A", borderTop: "1px solid #27272A" }}
        >
          Annuaire communautaire — chaque fiche est ajoutée par son propriétaire. Vérifiez les informations avant tout achat.
        </div>
      </footer>
    </div>
  );
}
