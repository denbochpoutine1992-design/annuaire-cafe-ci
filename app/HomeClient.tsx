"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import VendorCard from "@/components/VendorCard";
import { CATEGORIES, VILLES } from "@/lib/constants";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
});

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
        .then((data) => {
          setVendors(Array.isArray(data) ? data : []);
        })
        .catch(() => setVendors([]))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, cityFilter, catFilter]);

  const villesCouvertes = useMemo(
    () => new Set(vendors.map((v) => v.city)).size,
    [vendors]
  );

  return (
    <div className="min-h-screen bg-[#fbf7ef] text-[#302016]">

      {/* BARRE SUPÉRIEURE */}
      <div className="hidden md:flex bg-[#25140c] text-[#f8efe0] px-6 py-2.5 justify-between items-center text-xs">
        <div className="font-medium">
          ☕ Annuaire Café CI
        </div>

        <div className="flex items-center gap-5 opacity-90">
          <span>🇨🇮 Côte d'Ivoire</span>
          <span>Professionnels du café</span>
          <span>Annuaire local</span>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#fffdf8]/95 backdrop-blur border-b border-[#eadbc5]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-[74px] flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#315c45] text-white flex items-center justify-center text-2xl shadow-sm">
              ☕
            </div>

            <div className="leading-none">
              <div className="font-serif text-xl font-bold">
                Annuaire
              </div>
              <div className="font-serif text-xl font-bold text-[#b85c38]">
                Café CI
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <Link href="/" className="text-[#b85c38]">
              Accueil
            </Link>

            <a href="#vendeurs" className="hover:text-[#b85c38] transition">
              Vendeurs
            </a>

            <a href="#recherche" className="hover:text-[#b85c38] transition">
              Rechercher
            </a>

            <a href="#apropos" className="hover:text-[#b85c38] transition">
              À propos
            </a>
          </nav>

          <Link
            href="/register"
            className="rounded-full bg-[#b85c38] text-white px-4 md:px-6 py-2.5 text-xs md:text-sm font-bold shadow-sm hover:bg-[#984725] transition"
          >
            🏪 Inscrire mon commerce
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#eadbc5]">

        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-[#ead9bd] opacity-50" />
        <div className="absolute -left-32 bottom-0 w-80 h-80 rounded-full bg-[#e7d7bc] opacity-40" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20">

          <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-12 items-center">

            {/* TEXTE */}
            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#49715c] bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-[#315c45]">
                ☕ CÔTE D'IVOIRE · ROBUSTA & ARABICA
              </div>

              <h1 className="mt-6 font-serif font-bold leading-[0.95] text-5xl md:text-6xl lg:text-7xl">
                L'annuaire
                <br />
                du café{" "}
                <span className="text-[#b85c38]">
                  ivoirien
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base md:text-lg leading-8 text-[#6b5747]">
                Trouvez facilement les torréfacteurs, boutiques,
                cafés, distributeurs et grossistes de café en
                Côte d'Ivoire.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <a
                  href="#recherche"
                  className="rounded-full bg-[#315c45] text-white px-6 py-3.5 font-bold shadow-md hover:bg-[#244b37] transition"
                >
                  🔎 Trouver un vendeur
                </a>

                <button
                  onClick={() => setShowMap((s) => !s)}
                  className="rounded-full border border-[#d8c4a6] bg-white px-6 py-3.5 font-bold hover:bg-[#fffaf1] transition"
                >
                  🗺️ {showMap ? "Voir la liste" : "Voir la carte"}
                </button>

              </div>

              {/* STATISTIQUES */}
              <div className="mt-10 flex flex-wrap gap-8">

                <div>
                  <div className="text-3xl font-bold">
                    {vendors.length}
                  </div>
                  <div className="text-sm text-[#8a7355]">
                    Vendeurs
                  </div>
                </div>

                <div className="h-12 w-px bg-[#dfceb2]" />

                <div>
                  <div className="text-3xl font-bold">
                    {villesCouvertes}
                  </div>
                  <div className="text-sm text-[#8a7355]">
                    Villes
                  </div>
                </div>

                <div className="h-12 w-px bg-[#dfceb2]" />

                <div>
                  <div className="text-3xl font-bold">
                    🇨🇮
                  </div>
                  <div className="text-sm text-[#8a7355]">
                    100% ivoirien
                  </div>
                </div>

              </div>
            </div>

            {/* VISUEL */}
            <div className="hidden md:block">

              <div className="relative rounded-[32px] bg-[#315c45] p-3 shadow-xl rotate-1">

                <div className="rounded-[25px] bg-[#f4e5ce] min-h-[360px] flex items-center justify-center overflow-hidden">

                  <div className="text-center px-8">

                    <div className="text-8xl mb-6">
                      ☕
                    </div>

                    <div className="font-serif text-4xl font-bold text-[#2b170d]">
                      Le café
                    </div>

                    <div className="font-serif text-4xl font-bold text-[#b85c38]">
                      ivoirien
                    </div>

                    <p className="mt-5 text-sm text-[#6b5747] max-w-xs mx-auto">
                      Découvrez les professionnels du café
                      près de chez vous.
                    </p>

                  </div>

                </div>

                <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white px-5 py-4 shadow-lg border border-[#eadbc5]">
                  <div className="text-xs text-[#8a7355]">
                    Annuaire local
                  </div>
                  <div className="font-bold text-[#315c45]">
                    🇨🇮 Côte d'Ivoire
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* RECHERCHE */}
      <section
        id="recherche"
        className="px-5 md:px-8 py-8 bg-white border-b border-[#eadbc5]"
      >

        <div className="max-w-7xl mx-auto">

          <div className="mb-5">
            <div className="text-xs font-bold uppercase tracking-widest text-[#b85c38]">
              Trouver facilement
            </div>

            <h2 className="mt-1 font-serif text-2xl md:text-3xl font-bold">
              Rechercher un professionnel
            </h2>
          </div>

          <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-3">

            {/* RECHERCHE */}
            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔎
              </span>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nom, quartier, café..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#decdb1] bg-[#fbf7ef] text-sm outline-none focus:border-[#315c45] focus:ring-2 focus:ring-[#315c45]/10"
              />

            </div>

            {/* VILLE */}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-4 py-4 rounded-2xl border border-[#decdb1] bg-[#fbf7ef] text-sm outline-none focus:border-[#315c45]"
            >
              <option value="">
                📍 Toutes les villes
              </option>

              {VILLES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>

            {/* CATÉGORIE */}
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="px-4 py-4 rounded-2xl border border-[#decdb1] bg-[#fbf7ef] text-sm outline-none focus:border-[#315c45]"
            >
              <option value="">
                ☕ Toutes les catégories
              </option>

              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

          </div>

          {/* RÉSULTATS */}
          <div className="mt-5 flex items-center justify-between">

            <div className="text-sm text-[#806b55]">
              {loading
                ? "Recherche en cours..."
                : `${vendors.length} résultat${vendors.length !== 1 ? "s" : ""}`}
            </div>

            {(query || cityFilter || catFilter) && (
              <button
                onClick={() => {
                  setQuery("");
                  setCityFilter("");
                  setCatFilter("");
                }}
                className="text-xs font-semibold text-[#b85c38] hover:underline"
              >
                Effacer les filtres
              </button>
            )}

          </div>

        </div>
      </section>

      {/* VENDEURS */}
      <main
        id="vendeurs"
        className="px-5 md:px-8 py-12 max-w-7xl mx-auto"
      >

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#315c45]">
              Notre annuaire
            </div>

            <h2 className="mt-1 font-serif text-3xl md:text-4xl font-bold">
              Les professionnels du café
            </h2>

            <p className="mt-2 text-sm text-[#806b55]">
              Découvrez les commerces référencés près de chez vous.
            </p>
          </div>

          <button
            onClick={() => setShowMap((s) => !s)}
            className="self-start md:self-auto rounded-full border border-[#d8c4a6] bg-white px-5 py-3 text-sm font-semibold hover:bg-[#fffaf1] transition"
          >
            🗺️ {showMap ? "Afficher la liste" : "Afficher la carte"}
          </button>

        </div>

        {loading ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 rounded-3xl bg-[#f0e8db] animate-pulse"
              />
            ))}

          </div>

        ) : vendors.length === 0 ? (

          <div className="rounded-3xl border border-[#eadbc5] bg-white p-12 text-center">

            <div className="text-5xl">
              ☕
            </div>

            <h3 className="mt-4 font-serif text-2xl font-bold">
              Aucun vendeur trouvé
            </h3>

            <p className="mt-2 text-sm text-[#806b55]">
              Essayez une autre recherche ou inscrivez votre commerce.
            </p>

            <Link
              href="/register"
              className="inline-block mt-6 rounded-full bg-[#315c45] text-white px-6 py-3 font-semibold"
            >
              Inscrire mon commerce
            </Link>

          </div>

        ) : showMap ? (

          <div className="rounded-3xl overflow-hidden border border-[#eadbc5] bg-white p-2 shadow-sm">
            <MapView vendors={vendors} />
          </div>

        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {vendors.map((v) => (
              <VendorCard
                key={v.id}
                vendor={v}
              />
            ))}

          </div>

        )}

      </main>

      {/* À PROPOS */}
      <section
        id="apropos"
        className="px-5 md:px-8 py-16 bg-[#f0e5d4]"
      >

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

          <div className="md:col-span-2">

            <div className="text-xs font-bold uppercase tracking-widest text-[#b85c38]">
              À propos
            </div>

            <h2 className="mt-2 font-serif text-3xl md:text-4xl font-bold">
              La vitrine du café ivoirien.
            </h2>

            <p className="mt-5 max-w-2xl text-[#6b5747] leading-7">
              Annuaire Café CI met en relation les amateurs de café
              avec les professionnels du secteur partout en Côte d'Ivoire.
              Trouvez un vendeur, découvrez ses produits et contactez-le
              directement.
            </p>

          </div>

          <div className="rounded-3xl bg-white p-7 border border-[#eadbc5]">

            <div className="text-4xl">
              🇨🇮
            </div>

            <h3 className="mt-4 font-serif text-xl font-bold">
              Une plateforme locale
            </h3>

            <p className="mt-2 text-sm text-[#806b55] leading-6">
              Chaque commerce peut présenter ses produits,
              sa localisation et ses moyens de contact.
            </p>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 py-12">

        <div className="max-w-7xl mx-auto rounded-[30px] bg-[#25140c] text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-7">

          <div>

            <div className="text-xs font-bold tracking-widest text-[#e6a27f]">
              VOUS ÊTES PROFESSIONNEL DU CAFÉ ?
            </div>

            <h2 className="mt-2 font-serif text-3xl md:text-4xl font-bold">
              Faites connaître votre commerce.
            </h2>

            <p className="mt-3 text-sm md:text-base text-[#d8c6b5]">
              Ajoutez votre établissement à l'annuaire Café CI.
            </p>

          </div>

          <Link
            href="/register"
            className="shrink-0 rounded-full bg-[#b85c38] px-7 py-4 font-bold hover:bg-[#d06d45] transition"
          >
            Inscrire mon commerce →
          </Link>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-[#211109] text-[#d8c6b5] px-5 md:px-8 py-12">

        <div className="max-w-7xl mx-auto">

          <div className="grid md:grid-cols-3 gap-10">

            <div>

              <div className="font-serif text-2xl font-bold text-white">
                ☕ Annuaire Café CI
              </div>

              <p className="mt-3 text-sm leading-6 max-w-sm">
                L'annuaire de référence des professionnels
                du café en Côte d'Ivoire.
              </p>

            </div>

            <div>

              <div className="text-white font-semibold mb-4">
                Navigation
              </div>

              <div className="flex flex-col gap-3 text-sm">

                <a href="#vendeurs" className="hover:text-white">
                  Vendeurs
                </a>

                <a href="#recherche" className="hover:text-white">
                  Rechercher
                </a>

                <a href="#apropos" className="hover:text-white">
                  À propos
                </a>

                <Link href="/register" className="hover:text-white">
                  Inscrire mon commerce
                </Link>

              </div>

            </div>

            <div>

              <div className="text-white font-semibold mb-4">
                Côte d'Ivoire
              </div>

              <p className="text-sm leading-6">
                🇨🇮 Une plateforme dédiée aux acteurs
                et passionnés du café ivoirien.
              </p>

            </div>

          </div>

          <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs">
            © {new Date().getFullYear()} Annuaire Café CI — Le café ivoirien, notre fierté. ☕🇨🇮
          </div>

        </div>

      </footer>

    </div>
  );
}
