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
        .then((data) => setVendors(Array.isArray(data) ? data : []))
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

      {/* TOP BAR */}
      <div className="hidden md:flex bg-[#2b170d] text-[#f8efe0] px-6 py-2.5 justify-between items-center text-sm">
        <div>☕ Annuaire du café en Côte d'Ivoire</div>

        <div className="flex items-center gap-5">
          <span>🇨🇮 Côte d'Ivoire</span>
          <span>│</span>
          <span>Facebook</span>
          <span>Instagram</span>
          <span>WhatsApp</span>
        </div>
      </div>

      {/* HEADER */}
      <header className="bg-white border-b border-[#eadbc5] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#f4e5ce] flex items-center justify-center text-3xl">
              ☕
            </div>

            <div className="leading-none">
              <div className="font-serif text-xl md:text-2xl font-bold">
                Annuaire
              </div>
              <div className="font-serif text-xl md:text-2xl font-bold text-[#b85c38]">
                Café CI
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm">
            <Link href="/" className="font-semibold text-[#a94f2d]">
              Accueil
            </Link>
            <a href="#vendeurs" className="hover:text-[#a94f2d]">
              Vendeurs
            </a>
            <a href="#recherche" className="hover:text-[#a94f2d]">
              Catégories
            </a>
            <a href="#apropos" className="hover:text-[#a94f2d]">
              À propos
            </a>
            <a href="#contact" className="hover:text-[#a94f2d]">
              Contact
            </a>
          </nav>

          <Link
            href="/register"
            className="rounded-full bg-[#b85c38] text-white px-5 md:px-7 py-3 font-semibold text-sm shadow-md hover:bg-[#984725] transition"
          >
            🏪 Inscrire mon commerce
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <div className="inline-flex items-center rounded-full border border-[#49715c] px-4 py-2 text-xs md:text-sm font-medium text-[#315c45] bg-white/70">
                ☕ CÔTE D'IVOIRE · ROBUSTA & ARABICA
              </div>

              <h1 className="mt-7 font-serif text-5xl md:text-7xl font-bold leading-[0.98]">
                L'annuaire
                <br />
                de référence du
                <br />
                café en{" "}
                <span className="text-[#b85c38]">
                  Côte d'Ivoire
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg md:text-xl leading-8 text-[#6b5747]">
                Torréfacteurs, boutiques, distributeurs, grossistes et
                professionnels du café réunis au même endroit.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#recherche"
                  className="rounded-full bg-[#315c45] text-white px-7 py-3.5 font-semibold shadow-md"
                >
                  🔎 Trouver un vendeur
                </a>

                <button
                  onClick={() => setShowMap((s) => !s)}
                  className="rounded-full border border-[#d8c4a6] bg-white px-7 py-3.5 font-semibold"
                >
                  🗺️ {showMap ? "Voir la liste" : "Voir la carte"}
                </button>
              </div>

              {/* STATS */}
              <div className="mt-10 bg-white rounded-2xl border border-[#eadbc5] shadow-sm p-5 flex flex-wrap gap-7">

                <div>
                  <div className="text-3xl font-bold">{vendors.length}</div>
                  <div className="text-sm text-[#8a7355]">
                    Vendeurs
                  </div>
                </div>

                <div className="border-l border-[#eadbc5] pl-7">
                  <div className="text-3xl font-bold">
                    {villesCouvertes}
                  </div>
                  <div className="text-sm text-[#8a7355]">
                    Villes
                  </div>
                </div>

                <div className="border-l border-[#eadbc5] pl-7">
                  <div className="text-3xl font-bold">+</div>
                  <div className="text-sm text-[#8a7355]">
                    Commerces à venir
                  </div>
                </div>

              </div>
            </div>

            {/* COFFEE VISUAL */}
            <div className="relative">
              <div
                className="h-[430px] md:h-[520px] rounded-[40px] overflow-hidden shadow-2xl bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85')",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#2b170d]/70 via-transparent to-transparent" />

                <div className="absolute bottom-7 left-7 right-7">
                  <div className="bg-white/95 backdrop-blur rounded-2xl p-5">
                    <div className="text-sm text-[#315c45] font-semibold">
                      🇨🇮 LE CAFÉ IVOIRIEN
                    </div>

                    <div className="mt-1 font-serif text-2xl font-bold">
                      Découvrez les professionnels près de chez vous
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section id="recherche" className="px-5 md:px-8 -mt-4 relative z-10">
        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-3xl shadow-xl border border-[#eadbc5] p-5 md:p-7">

            <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-4">

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                  🔎
                </span>

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un nom, un quartier..."
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#dfcdb2] bg-[#fffdf9] outline-none focus:border-[#b85c38] focus:ring-2 focus:ring-[#b85c38]/10"
                />
              </div>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="h-14 px-4 rounded-xl border border-[#dfcdb2] bg-[#fffdf9] outline-none"
              >
                <option value="">📍 Toutes les villes</option>

                {VILLES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                className="h-14 px-4 rounded-xl border border-[#dfcdb2] bg-[#fffdf9] outline-none"
              >
                <option value="">☕ Toutes les catégories</option>

                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

            </div>
          </div>

        </div>
      </section>

      {/* VENDEURS */}
      <main id="vendeurs" className="max-w-7xl mx-auto px-5 md:px-8 py-16">

        <div className="flex flex-wrap items-end justify-between gap-5 mb-8">

          <div>
            <div className="text-[#b85c38] font-semibold text-sm uppercase tracking-wider">
              ☕ Notre sélection
            </div>

            <h2 className="mt-2 font-serif text-4xl md:text-5xl font-bold">
              Nos vendeurs
            </h2>

            <p className="mt-3 text-[#6b5747]">
              Découvrez les professionnels du café en Côte d'Ivoire.
            </p>
          </div>

          <button
            onClick={() => setShowMap((s) => !s)}
            className="rounded-full border border-[#b85c38] px-6 py-3 text-sm font-semibold"
          >
            {showMap ? "Voir les vendeurs" : "Voir la carte"} →
          </button>

        </div>

        {loading ? (

          <div className="bg-white rounded-3xl border border-[#eadbc5] py-24 text-center shadow-sm">
            <div className="text-4xl">☕</div>
            <p className="mt-4 text-[#8a7355]">
              Chargement des vendeurs...
            </p>
          </div>

        ) : vendors.length === 0 ? (

          <div className="bg-white rounded-3xl border border-[#eadbc5] py-24 px-6 text-center shadow-sm">

            <div className="text-5xl">☕</div>

            <h3 className="mt-5 font-serif text-3xl font-bold">
              Aucun vendeur trouvé
            </h3>

            <p className="mt-3 text-[#8a7355]">
              Essayez une autre recherche ou soyez le premier à inscrire
              votre commerce.
            </p>

            <Link
              href="/register"
              className="inline-block mt-7 rounded-full bg-[#b85c38] text-white px-7 py-3 font-semibold"
            >
              Inscrire mon commerce
            </Link>

          </div>

        ) : showMap ? (

          <div className="bg-white rounded-3xl overflow-hidden border border-[#eadbc5] shadow-lg">
            <MapView vendors={vendors} />
          </div>

        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

            {vendors.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-3xl border border-[#eadbc5] overflow-hidden shadow-sm hover:shadow-xl transition"
              >
                <VendorCard vendor={v} />
              </div>
            ))}

          </div>

        )}

      </main>

      {/* TRUST */}
      <section id="apropos" className="px-5 md:px-8 pb-16">

        <div className="max-w-7xl mx-auto bg-[#edf1e8] border border-[#cbd7c7] rounded-3xl p-7 md:p-10">

          <div className="grid md:grid-cols-4 gap-8">

            <div>
              <div className="text-3xl">🏆</div>
              <h3 className="mt-3 font-serif text-xl font-bold">
                Vendeurs vérifiés
              </h3>
              <p className="mt-2 text-sm text-[#60705f]">
                Des professionnels référencés pour plus de confiance.
              </p>
            </div>

            <div>
              <div className="text-3xl">🚚</div>
              <h3 className="mt-3 font-serif text-xl font-bold">
                Livraison
              </h3>
              <p className="mt-2 text-sm text-[#60705f]">
                Trouvez des vendeurs proposant la livraison.
              </p>
            </div>

            <div>
              <div className="text-3xl">☕</div>
              <h3 className="mt-3 font-serif text-xl font-bold">
                Qualité café
              </h3>
              <p className="mt-2 text-sm text-[#60705f]">
                Découvrez les cafés disponibles près de vous.
              </p>
            </div>

            <div>
              <div className="text-3xl">🤝</div>
              <h3 className="mt-3 font-serif text-xl font-bold">
                Annuaire local
              </h3>
              <p className="mt-2 text-sm text-[#60705f]">
                Une plateforme dédiée au café ivoirien.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="px-5 md:px-8 pb-16">

        <div className="max-w-7xl mx-auto rounded-3xl bg-[#2b170d] text-white p-8 md:p-14 flex flex-col md:flex-row justify-between items-center gap-8">

          <div>
            <div className="text-[#e6a27f] font-semibold">
              VOUS ÊTES VENDEUR DE CAFÉ ?
            </div>

            <h2 className="mt-2 font-serif text-3xl md:text-4xl font-bold">
              Faites connaître votre commerce.
            </h2>

            <p className="mt-3 text-[#d8c6b5]">
              Ajoutez gratuitement votre établissement à l'annuaire.
            </p>
          </div>

          <Link
            href="/register"
            className="shrink-0 rounded-full bg-[#b85c38] px-8 py-4 font-bold hover:bg-[#d06d45] transition"
          >
            Inscrire mon commerce →
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#211109] text-[#d8c6b5] px-5 md:px-8 py-12">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between gap-8">

            <div>
              <div className="font-serif text-2xl font-bold text-white">
                ☕ Annuaire Café CI
              </div>

              <p className="mt-3 max-w-md text-sm">
                L'annuaire de référence des professionnels du café
                en Côte d'Ivoire.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#vendeurs">Vendeurs</a>
              <a href="#recherche">Catégories</a>
              <a href="#apropos">À propos</a>
              <a href="#contact">Contact</a>
            </div>

          </div>

          <div className="border-t border-white/10 mt-10 pt-7 text-center text-sm">
            Le café ivoirien, notre fierté. 🇨🇮☕
          </div>

        </div>
      </footer>

    </div>
  );
}
