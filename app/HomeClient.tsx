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

  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  async function loadVendors() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (q.trim()) params.set("q", q.trim());
      if (city) params.set("city", city);
      if (category) params.set("category", category);

      const url = params.toString()
        ? `/api/vendors?${params.toString()}`
        : "/api/vendors";

      const res = await fetch(url, {
        cache: "no-store",
      });

      if (!res.ok) {
        setVendors([]);
        return;
      }

      const data = await res.json();
      setVendors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, category]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    loadVendors();
  }

  function selectCategory(id: string) {
    setCategory((current) => (current === id ? "" : id));
  }

  function resetFilters() {
    setQ("");
    setCity("");
    setCategory("");

    setTimeout(() => {
      window.location.reload();
    }, 50);
  }

  const cityCount = useMemo(() => {
    return new Set(
      vendors
        .map((vendor) => vendor.city)
        .filter(Boolean)
    ).size;
  }, [vendors]);

  return (
    <main
      className="min-h-screen"
      style={{
        background: "#F7F3EC",
        color: "#18120E",
      }}
    >
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: "640px",
          background:
            "linear-gradient(90deg, rgba(14,10,7,0.94) 0%, rgba(14,10,7,0.78) 45%, rgba(14,10,7,0.25) 100%), url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1800&q=85') center/cover no-repeat",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] font-semibold mb-7"
              style={{
                color: "#E7C780",
                border: "1px solid rgba(231,199,128,0.45)",
                background: "rgba(0,0,0,0.25)",
              }}
            >
              ☕ L’univers du café ivoirien
            </div>

            <h1
              className="font-display font-semibold"
              style={{
                color: "#FFFDF9",
                fontSize: "clamp(3rem, 7vw, 6.4rem)",
                lineHeight: "0.94",
                letterSpacing: "-0.055em",
              }}
            >
              Découvrez le
              <br />
              café autrement.
            </h1>

            <p
              className="mt-7 max-w-2xl text-base md:text-xl leading-relaxed"
              style={{ color: "#E9E0D4" }}
            >
              Torréfacteurs, boutiques, grossistes, vendeurs en ligne et
              professionnels du café en Côte d’Ivoire réunis au même endroit.
            </p>

            {/* SEARCH */}
            <form
              onSubmit={submitSearch}
              className="mt-10 p-3 md:p-4 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.97)",
                boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_auto] gap-3">
                <div className="flex items-center px-4 rounded-xl bg-white">
                  <span className="mr-3">⌕</span>

                  <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Nom, quartier, café..."
                    className="w-full py-4 outline-none bg-transparent text-sm md:text-base"
                    style={{ color: "#18120E" }}
                  />
                </div>

                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="px-4 py-4 rounded-xl outline-none text-sm"
                  style={{
                    background: "#F4EFE7",
                    color: "#18120E",
                  }}
                >
                  <option value="">Toute la Côte d’Ivoire</option>

                  {VILLES.map((ville) => (
                    <option key={ville} value={ville}>
                      {ville}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="px-7 py-4 rounded-xl font-semibold transition hover:opacity-90"
                  style={{
                    background: "#B78B42",
                    color: "#FFFFFF",
                  }}
                >
                  Rechercher
                </button>
              </div>
            </form>

            <div
              className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm"
              style={{ color: "#D9CCBD" }}
            >
              <span>
                <strong
                  className="text-xl mr-2"
                  style={{ color: "#FFFDF9" }}
                >
                  {vendors.length}
                </strong>
                commerces
              </span>

              <span>
                <strong
                  className="text-xl mr-2"
                  style={{ color: "#FFFDF9" }}
                >
                  {cityCount}
                </strong>
                villes
              </span>

              <span>🇨🇮 100% Côte d’Ivoire</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <p
              className="uppercase tracking-[0.2em] text-xs font-semibold mb-3"
              style={{ color: "#A47632" }}
            >
              Explorer
            </p>

            <h2
              className="font-display font-semibold"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                letterSpacing: "-0.035em",
              }}
            >
              Trouvez votre café
            </h2>

            <p
              className="mt-3 max-w-xl"
              style={{ color: "#74685E" }}
            >
              Sélectionnez une catégorie pour découvrir les professionnels qui
              correspondent à vos besoins.
            </p>
          </div>

          {(category || city || q) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold underline underline-offset-4"
              style={{ color: "#8A5C20" }}
            >
              Effacer les filtres
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((c) => {
            const active = category === c.id;

            return (
              <button
                type="button"
                key={c.id}
                onClick={() => selectCategory(c.id)}
                className="text-left rounded-2xl p-5 min-h-[150px] transition"
                style={{
                  background: active ? "#20150F" : "#FFFDF9",
                  color: active ? "#FFFFFF" : "#18120E",
                  border: active
                    ? "1px solid #20150F"
                    : "1px solid #E5DDD2",
                  boxShadow: active
                    ? "0 14px 34px rgba(34,22,15,0.18)"
                    : "0 5px 20px rgba(34,22,15,0.04)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-xl mb-7"
                  style={{
                    background: active ? "#B78B42" : "#F2E8D8",
                  }}
                >
                  ☕
                </div>

                <div className="font-semibold leading-tight">
                  {c.label}
                </div>

                <div
                  className="mt-2 text-xs"
                  style={{
                    color: active ? "#DCCCB9" : "#8A7C70",
                  }}
                >
                  Découvrir →
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* PROFESSIONAL CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div
          className="rounded-[28px] overflow-hidden grid md:grid-cols-2"
          style={{ background: "#21150F" }}
        >
          <div className="p-8 md:p-14 flex flex-col justify-center">
            <p
              className="uppercase tracking-[0.2em] text-xs font-semibold"
              style={{ color: "#CDA85D" }}
            >
              Professionnels
            </p>

            <h2
              className="font-display font-semibold text-3xl md:text-5xl mt-4"
              style={{
                color: "#FFFDF9",
                letterSpacing: "-0.04em",
              }}
            >
              Faites connaître votre commerce.
            </h2>

            <p
              className="mt-5 leading-relaxed max-w-lg"
              style={{ color: "#D5C7BA" }}
            >
              Créez votre fiche professionnelle et présentez votre activité,
              vos produits, vos photos et vos coordonnées aux amateurs de café.
            </p>

            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex px-6 py-3.5 rounded-full font-semibold"
                style={{
                  background: "#C59A4D",
                  color: "#FFFFFF",
                }}
              >
                Inscrire mon commerce →
              </Link>
            </div>
          </div>

          <div
            className="min-h-[330px]"
            style={{
              background:
                "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85') center/cover no-repeat",
            }}
          />
        </div>
      </section>

      {/* RESULTS */}
      <section
        className="py-20"
        style={{
          background: "#FFFDF9",
          borderTop: "1px solid #E8E0D5",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-9">
            <div>
              <p
                className="uppercase tracking-[0.2em] text-xs font-semibold mb-3"
                style={{ color: "#A47632" }}
              >
                Annuaire
              </p>

              <h2
                className="font-display font-semibold"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.3rem)",
                  letterSpacing: "-0.035em",
                }}
              >
                Les professionnels
              </h2>
            </div>

            {!loading && (
              <p className="text-sm" style={{ color: "#83766B" }}>
                {vendors.length} résultat
                {vendors.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {loading ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{ background: "#F7F3EC" }}
            >
              Chargement des commerces...
            </div>
          ) : vendors.length === 0 ? (
            <div
              className="rounded-[24px] p-10 md:p-14 text-center"
              style={{
                background: "#F7F3EC",
                border: "1px solid #E8DFD3",
              }}
            >
              <div className="text-5xl mb-5">☕</div>

              <h3 className="font-display font-semibold text-2xl">
                Aucun commerce trouvé
              </h3>

              <p
                className="mt-3 max-w-lg mx-auto"
                style={{ color: "#7A6D62" }}
              >
                Aucun professionnel ne correspond encore à cette recherche.
                Essayez une autre ville ou une autre catégorie.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 px-5 py-3 rounded-full font-semibold"
                style={{
                  background: "#21150F",
                  color: "#FFFFFF",
                }}
              >
                Voir tous les commerces
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MAP */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="mb-8">
          <p
            className="uppercase tracking-[0.2em] text-xs font-semibold mb-3"
            style={{ color: "#A47632" }}
          >
            Localisation
          </p>

          <h2
            className="font-display font-semibold"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.3rem)",
              letterSpacing: "-0.035em",
            }}
          >
            Le café près de chez vous
          </h2>

          <p className="mt-3" style={{ color: "#74685E" }}>
            Retrouvez sur la carte les commerces ayant renseigné leur
            localisation.
          </p>
        </div>

        <div
          className="rounded-[24px] overflow-hidden"
          style={{
            border: "1px solid #DED5C8",
            boxShadow: "0 14px 50px rgba(39,26,17,0.08)",
          }}
        >
          <MapView vendors={vendors} height={480} />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 md:px-12 pb-20">
        <div
          className="max-w-7xl mx-auto rounded-[28px] px-7 md:px-14 py-12 md:py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8"
          style={{
            background: "#B58A42",
            color: "#FFFFFF",
          }}
        >
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] font-semibold opacity-80">
              Annuaire Café CI
            </p>

            <h2 className="font-display font-semibold text-3xl md:text-5xl mt-3">
              Votre commerce mérite d’être découvert.
            </h2>

            <p className="mt-4 opacity-90">
              Rejoignez l’annuaire des professionnels du café en Côte
              d’Ivoire.
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex justify-center px-7 py-4 rounded-full font-semibold whitespace-nowrap"
            style={{
              background: "#FFFFFF",
              color: "#2A1B12",
            }}
          >
            Créer ma fiche gratuitement
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="px-6 md:px-12 py-10"
        style={{
          background: "#17100C",
          color: "#D7CBC0",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-5">
          <div>
            <div className="font-semibold text-white">
              ☕ Annuaire Café CI
            </div>

            <p className="text-sm mt-2">
              Le rendez-vous des professionnels du café en Côte d’Ivoire.
            </p>
          </div>

          <div className="flex gap-6 text-sm">
            <Link href="/login" className="hover:text-white">
              Connexion
            </Link>

            <Link href="/register" className="hover:text-white">
              Inscrire mon commerce
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
