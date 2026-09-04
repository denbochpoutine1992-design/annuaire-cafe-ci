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

    setTimeout(() => {
      document
        .getElementById("resultats")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function selectCategory(id: string) {
    setCategory((current) => (current === id ? "" : id));

    setTimeout(() => {
      document
        .getElementById("resultats")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
      vendors.map((vendor) => vendor.city).filter(Boolean)
    ).size;
  }, [vendors]);

  const featuredVendors = useMemo(() => {
    return vendors.filter(
      (vendor) =>
        vendor.featured &&
        vendor.featuredUntil &&
        new Date(vendor.featuredUntil) > new Date()
    );
  }, [vendors]);

  return (
    <main
      className="min-h-screen"
      style={{
        background: "#F7F3EC",
        color: "#18120E",
      }}
    >
      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section
        className="relative overflow-hidden"
        style={{
          minHeight: "720px",
          background:
            "linear-gradient(90deg, rgba(14,10,7,0.96) 0%, rgba(14,10,7,0.84) 42%, rgba(14,10,7,0.30) 100%), url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=2000&q=90') center/cover no-repeat",
        }}
      >
        {/* NAVIGATION */}

        <nav className="absolute top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-5 md:px-10 py-5">
            <div className="flex items-center justify-between">
              {/* LOGO */}

              <Link
                href="/"
                className="flex items-center gap-3 text-white"
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full text-xl"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  ☕
                </span>

                <div className="hidden sm:block">
                  <div className="font-semibold tracking-tight">
                    Annuaire Café CI
                  </div>

                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                    Côte d’Ivoire
                  </div>
                </div>
              </Link>

              {/* MENU */}

              <div className="hidden md:flex items-center gap-8 text-sm text-white/80">
                <a
                  href="#explorer"
                  className="transition hover:text-white"
                >
                  Explorer
                </a>

                <a
                  href="#resultats"
                  className="transition hover:text-white"
                >
                  Commerces
                </a>

                <a
                  href="#localisation"
                  className="transition hover:text-white"
                >
                  Localisation
                </a>
              </div>

              {/* ACTIONS */}

              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex rounded-full px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Connexion
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg transition hover:opacity-90"
                  style={{
                    background: "#B78B42",
                    color: "#FFFFFF",
                  }}
                >
                  <span className="hidden sm:inline">
                    Inscrire mon commerce
                  </span>

                  <span className="sm:hidden">
                    Inscrire
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* HERO CONTENT */}

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 pt-36 pb-24">
          <div className="max-w-4xl">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em] font-semibold"
              style={{
                color: "#E7C780",
                border: "1px solid rgba(231,199,128,0.45)",
                background: "rgba(0,0,0,0.25)",
                backdropFilter: "blur(8px)",
              }}
            >
              ☕ L’univers du café ivoirien
            </div>

            <h1
              className="font-display font-semibold mt-7"
              style={{
                color: "#FFFDF9",
                fontSize: "clamp(3.2rem, 7vw, 6.8rem)",
                lineHeight: "0.92",
                letterSpacing: "-0.06em",
              }}
            >
              Découvrez le
              <br />
              café autrement.
            </h1>

            <p
              className="mt-7 max-w-2xl text-base md:text-xl leading-relaxed"
              style={{
                color: "#E9E0D4",
              }}
            >
              Trouvez les torréfacteurs, boutiques, grossistes,
              vendeurs en ligne et professionnels du café près de
              chez vous.
            </p>

            {/* SEARCH */}

            <form
              onSubmit={submitSearch}
              className="mt-10 max-w-4xl rounded-[22px] p-2.5 md:p-3"
              style={{
                background: "rgba(255,255,255,0.97)",
                boxShadow: "0 25px 80px rgba(0,0,0,0.32)",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_190px_auto] gap-2.5">
                {/* SEARCH INPUT */}

                <div className="flex items-center rounded-2xl bg-white px-4">
                  <span className="mr-3 text-xl text-zinc-400">
                    ⌕
                  </span>

                  <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Rechercher un commerce, un café..."
                    className="w-full bg-transparent py-4 outline-none text-sm md:text-base"
                    style={{
                      color: "#18120E",
                    }}
                  />
                </div>

                {/* CITY */}

                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="rounded-2xl px-4 py-4 outline-none text-sm"
                  style={{
                    background: "#F4EFE7",
                    color: "#18120E",
                  }}
                >
                  <option value="">
                    Toute la Côte d’Ivoire
                  </option>

                  {VILLES.map((ville) => (
                    <option key={ville} value={ville}>
                      {ville}
                    </option>
                  ))}
                </select>

                {/* BUTTON */}

                <button
                  type="submit"
                  className="rounded-2xl px-7 py-4 font-semibold transition hover:opacity-90"
                  style={{
                    background: "#B78B42",
                    color: "#FFFFFF",
                  }}
                >
                  Rechercher
                </button>
              </div>
            </form>

            {/* STATS */}

            <div
              className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm"
              style={{
                color: "#D9CCBD",
              }}
            >
              <div>
                <strong
                  className="mr-2 text-2xl"
                  style={{
                    color: "#FFFDF9",
                  }}
                >
                  {vendors.length}
                </strong>
                commerces
              </div>

              <div>
                <strong
                  className="mr-2 text-2xl"
                  style={{
                    color: "#FFFDF9",
                  }}
                >
                  {cityCount}
                </strong>
                villes
              </div>

              <div>🇨🇮 100% Côte d’Ivoire</div>
            </div>
          </div>
        </div>

        {/* HERO BOTTOM */}

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F7F3EC] to-transparent" />
      </section>

      {/* ========================================================= */}
      {/* EXPLORER */}
      {/* ========================================================= */}

      <section
        id="explorer"
        className="max-w-7xl mx-auto px-5 md:px-10 py-20 md:py-24"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p
              className="uppercase tracking-[0.2em] text-xs font-semibold mb-3"
              style={{
                color: "#A47632",
              }}
            >
              Explorer
            </p>

            <h2
              className="font-display font-semibold"
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
                letterSpacing: "-0.04em",
              }}
            >
              Trouvez votre café
            </h2>

            <p
              className="mt-3 max-w-xl"
              style={{
                color: "#74685E",
              }}
            >
              Découvrez les professionnels du café en Côte
              d’Ivoire selon leur activité.
            </p>
          </div>

          {(category || city || q) && (
            <button
              type="button"
              onClick={resetFilters}
              className="self-start md:self-auto rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                color: "#8A5C20",
                background: "#EFE4D2",
              }}
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* CATEGORIES */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((c) => {
            const active = category === c.id;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCategory(c.id)}
                className="group relative overflow-hidden text-left rounded-[22px] p-5 min-h-[165px] transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: active
                    ? "#20150F"
                    : "#FFFDF9",
                  color: active
                    ? "#FFFFFF"
                    : "#18120E",
                  border: active
                    ? "1px solid #20150F"
                    : "1px solid #E5DDD2",
                  boxShadow: active
                    ? "0 18px 40px rgba(34,22,15,0.18)"
                    : "0 7px 25px rgba(34,22,15,0.05)",
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: active
                      ? "#B78B42"
                      : "#F2E8D8",
                  }}
                >
                  ☕
                </div>

                <div className="mt-7 font-semibold leading-tight">
                  {c.label}
                </div>

                <div
                  className="mt-2 text-xs"
                  style={{
                    color: active
                      ? "#DCCCB9"
                      : "#8A7C70",
                  }}
                >
                  Découvrir →
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* FEATURED */}
      {/* ========================================================= */}

      {featuredVendors.length > 0 && (
        <section className="px-5 md:px-10 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-[30px] p-6 md:p-10 bg-[#21150F]">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
                <div>
                  <p
                    className="uppercase tracking-[0.2em] text-xs font-semibold mb-3"
                    style={{
                      color: "#CDA85D",
                    }}
                  >
                    Sélection
                  </p>

                  <h2
                    className="font-display font-semibold text-3xl md:text-4xl"
                    style={{
                      color: "#FFFDF9",
                    }}
                  >
                    Commerces en vedette
                  </h2>

                  <p
                    className="mt-3"
                    style={{
                      color: "#D5C7BA",
                    }}
                  >
                    Découvrez les professionnels actuellement
                    mis en avant sur Annuaire Café CI.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredVendors.slice(0, 3).map((vendor) => (
                  <VendorCard
                    key={`featured-${vendor.id}`}
                    vendor={vendor}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* PROFESSIONAL CTA */}
      {/* ========================================================= */}

      <section
        id="professionnels"
        className="max-w-7xl mx-auto px-5 md:px-10 pb-20"
      >
        <div
          className="overflow-hidden rounded-[30px] grid md:grid-cols-2"
          style={{
            background: "#21150F",
          }}
        >
          <div className="p-8 md:p-14 flex flex-col justify-center">
            <p
              className="uppercase tracking-[0.2em] text-xs font-semibold"
              style={{
                color: "#CDA85D",
              }}
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
              style={{
                color: "#D5C7BA",
              }}
            >
              Créez votre fiche professionnelle et présentez
              votre activité, vos produits, vos photos et vos
              coordonnées aux amateurs de café.
            </p>

            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex rounded-full px-6 py-3.5 font-semibold transition hover:opacity-90"
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
            className="min-h-[320px]"
            style={{
              background:
                "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85') center/cover no-repeat",
            }}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* RESULTS */}
      {/* ========================================================= */}

      <section
        id="resultats"
        className="py-20 md:py-24"
        style={{
          background: "#FFFDF9",
          borderTop: "1px solid #E8E0D5",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
            <div>
              <p
                className="uppercase tracking-[0.2em] text-xs font-semibold mb-3"
                style={{
                  color: "#A47632",
                }}
              >
                Annuaire
              </p>

              <h2
                className="font-display font-semibold"
                style={{
                  fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                  letterSpacing: "-0.04em",
                }}
              >
                Les professionnels
              </h2>

              <p
                className="mt-3"
                style={{
                  color: "#74685E",
                }}
              >
                Retrouvez les commerces référencés sur
                Annuaire Café CI.
              </p>
            </div>

            {!loading && (
              <div
                className="rounded-full px-4 py-2 text-sm font-medium"
                style={{
                  background: "#F4EFE7",
                  color: "#6F6258",
                }}
              >
                {vendors.length} résultat
                {vendors.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {loading ? (
            <div
              className="rounded-[24px] p-12 text-center"
              style={{
                background: "#F7F3EC",
              }}
            >
              <div className="text-4xl mb-4">☕</div>

              <p
                className="font-semibold"
                style={{
                  color: "#3D3028",
                }}
              >
                Chargement des commerces...
              </p>

              <p
                className="mt-2 text-sm"
                style={{
                  color: "#85766B",
                }}
              >
                Nous recherchons les professionnels du café.
              </p>
            </div>
          ) : vendors.length === 0 ? (
            <div
              className="rounded-[28px] p-10 md:p-16 text-center"
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
                style={{
                  color: "#7A6D62",
                }}
              >
                Aucun professionnel ne correspond à votre
                recherche. Essayez une autre ville, une autre
                catégorie ou un autre terme.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-7 rounded-full px-6 py-3 font-semibold"
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
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* MAP */}
      {/* ========================================================= */}

      <section
        id="localisation"
        className="max-w-7xl mx-auto px-5 md:px-10 py-20 md:py-24"
      >
        <div className="mb-8">
          <p
            className="uppercase tracking-[0.2em] text-xs font-semibold mb-3"
            style={{
              color: "#A47632",
            }}
          >
            Localisation
          </p>

          <h2
            className="font-display font-semibold"
            style={{
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              letterSpacing: "-0.04em",
            }}
          >
            Le café près de chez vous
          </h2>

          <p
            className="mt-3 max-w-2xl"
            style={{
              color: "#74685E",
            }}
          >
            Retrouvez sur la carte les commerces ayant renseigné
            leur localisation.
          </p>
        </div>

        <div
          className="overflow-hidden rounded-[28px]"
          style={{
            border: "1px solid #DED5C8",
            boxShadow: "0 18px 60px rgba(39,26,17,0.08)",
          }}
        >
          <MapView
            vendors={vendors}
            height={480}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}

      <section className="px-5 md:px-10 pb-20">
        <div
          className="max-w-7xl mx-auto rounded-[30px] px-7 md:px-14 py-12 md:py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8"
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
              Rejoignez l’annuaire des professionnels du café en
              Côte d’Ivoire.
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex justify-center rounded-full px-7 py-4 font-semibold whitespace-nowrap transition hover:scale-[1.02]"
            style={{
              background: "#FFFFFF",
              color: "#2A1B12",
            }}
          >
            Créer ma fiche gratuitement
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <footer
        className="px-5 md:px-10 py-12"
        style={{
          background: "#17100C",
          color: "#D7CBC0",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg">
                  ☕
                </span>

                <div className="font-semibold text-white">
                  Annuaire Café CI
                </div>
              </div>

              <p className="text-sm mt-3 max-w-md">
                Le rendez-vous des professionnels et amateurs du
                café en Côte d’Ivoire.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
              <a
                href="#explorer"
                className="transition hover:text-white"
              >
                Explorer
              </a>

              <a
                href="#resultats"
                className="transition hover:text-white"
              >
                Commerces
              </a>

              <a
                href="#localisation"
                className="transition hover:text-white"
              >
                Localisation
              </a>

              <Link
                href="/login"
                className="transition hover:text-white"
              >
                Connexion
              </Link>

              <Link
                href="/register"
                className="transition hover:text-white"
              >
                Inscrire mon commerce
              </Link>
            </div>
          </div>

          <div
            className="mt-10 pt-6 text-xs"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.10)",
              color: "#8F8177",
            }}
          >
            © {new Date().getFullYear()} Annuaire Café CI — Tous
            droits réservés.
          </div>
        </div>
      </footer>
    </main>
  );
}
