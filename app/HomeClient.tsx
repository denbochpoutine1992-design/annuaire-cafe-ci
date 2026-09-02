"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import VendorCard from "@/components/VendorCard";
import { CATEGORIES, VILLES } from "@/lib/constants";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
});

export default function HomeClient() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();

    if (q.trim()) params.set("q", q.trim());
    if (city) params.set("city", city);
    if (category) params.set("category", category);

    setLoading(true);

    fetch(`/api/vendors?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setVendors(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setVendors([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [q, city, category]);

  const stats = useMemo(() => {
    const cities = new Set(
      vendors.map((v) => v.city).filter(Boolean)
    );

    return {
      vendors: vendors.length,
      cities: cities.size,
    };
  }, [vendors]);

  const categories = [
    {
      name: "Cafés & Coffee Shops",
      value: "cafe",
      image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=85",
    },
    {
      name: "Torréfacteurs",
      value: "torrefacteur",
      image:
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85",
    },
    {
      name: "Boutiques & Vendeurs",
      value: "boutique",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
    },
    {
      name: "Grossistes",
      value: "grossiste",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=85",
    },
  ];

  function chooseCategory(value: string) {
    setCategory(value);
    window.scrollTo({
      top: 700,
      behavior: "smooth",
    });
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* HERO */}
      <section className="relative min-h-[680px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1800&q=90"
          alt="Café"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/65" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/25 to-black/45" />

        <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl items-end px-6 pb-16 pt-32 md:px-12">
          <div className="max-w-3xl">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-[#d7b15a]">
              L'univers du café ivoirien
            </p>

            <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
              Découvrez
              <br />
              le café autrement.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
              Trouvez les meilleurs cafés, torréfacteurs, boutiques,
              vendeurs et professionnels du café en Côte d'Ivoire.
            </p>

            {/* SEARCH */}
            <div className="mt-8 flex max-w-3xl flex-col gap-3 md:flex-row">
              <div className="flex flex-1 items-center rounded-xl border border-white/20 bg-white/95 px-4 shadow-2xl">
                <span className="mr-3 text-xl text-black/50">⌕</span>

                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Rechercher un café, une boutique..."
                  className="w-full bg-transparent py-4 text-sm text-black outline-none placeholder:text-black/45"
                />
              </div>

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-xl border border-white/20 bg-[#171717] px-5 py-4 text-sm text-white outline-none"
              >
                <option value="">Toutes les villes</option>
                {VILLES.map((v: any) => (
                  <option key={String(v)} value={String(v)}>
                    {String(v)}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  window.scrollTo({
                    top: 760,
                    behavior: "smooth",
                  });
                }}
                className="rounded-xl bg-[#c9a24d] px-7 py-4 font-medium text-black transition hover:bg-[#dfbb69]"
              >
                Rechercher →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#c9a24d]">
            Annuaire Café CI
          </p>

          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
            Votre expérience café
            <br />
            commence ici.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
            Explorez l'univers du café en Côte d'Ivoire. Découvrez des
            adresses, des professionnels passionnés et de nouveaux produits
            près de chez vous.
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#c9a24d]">
              Explorer
            </p>

            <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
              Explorez l'univers du café
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((item) => (
            <button
              key={item.name}
              onClick={() => chooseCategory(item.value)}
              className="group text-left"
            >
              <div className="relative aspect-[0.85] overflow-hidden rounded-2xl bg-[#151515]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <h3 className="font-display text-xl font-medium md:text-2xl">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-sm text-white/60">
                    Découvrir →
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-3">
          <div className="border-r border-white/10 px-6 py-10 text-center">
            <div className="font-display text-4xl font-semibold text-[#c9a24d]">
              {stats.vendors}+
            </div>
            <p className="mt-2 text-sm text-white/50">
              Professionnels référencés
            </p>
          </div>

          <div className="px-6 py-10 text-center md:border-r md:border-white/10">
            <div className="font-display text-4xl font-semibold text-[#c9a24d]">
              {stats.cities}+
            </div>
            <p className="mt-2 text-sm text-white/50">
              Villes représentées
            </p>
          </div>

          <div className="col-span-2 hidden px-6 py-10 text-center md:col-span-1 md:block">
            <div className="font-display text-4xl font-semibold text-[#c9a24d]">
              100%
            </div>
            <p className="mt-2 text-sm text-white/50">
              Dédié au café ivoirien
            </p>
          </div>
        </div>
      </section>

      {/* VENDORS */}
      <section
        id="commerces"
        className="mx-auto max-w-7xl px-6 py-24 md:px-12"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#c9a24d]">
              Sélection
            </p>

            <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
              Les adresses à découvrir
            </h2>

            <p className="mt-3 text-sm text-white/50">
              Trouvez votre prochaine expérience café.
            </p>
          </div>

          <button
            onClick={() => setShowMap(!showMap)}
            className="self-start rounded-full border border-white/20 px-5 py-3 text-sm transition hover:border-[#c9a24d] hover:text-[#c9a24d]"
          >
            {showMap ? "Voir les commerces" : "Voir la carte"}
          </button>
        </div>

        {/* FILTERS */}
        <div className="mt-10 flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setCategory("")}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm transition ${
              !category
                ? "bg-[#c9a24d] text-black"
                : "border border-white/15 text-white/60 hover:border-white/40"
            }`}
          >
            Tous
          </button>

          {CATEGORIES.map((c: any) => {
  const value = c.id;

  return (
    <button
      key={value}
      onClick={() => setCategory(value)}
      className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm transition ${
        category === value
          ? "bg-[#c9a24d] text-black"
          : "border border-white/15 text-white/60 hover:border-white/40"
      }`}
    >
      {c.label}
    </button>
  );
})}
              >
                {value}
              </button>
            );
          })}
        </div>

        {showMap ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <MapView vendors={vendors} />
          </div>
        ) : loading ? (
          <div className="py-20 text-center text-sm text-white/40">
            Recherche des adresses...
          </div>
        ) : vendors.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-[#0c0c0c] px-6 py-20 text-center">
            <div className="text-4xl">☕</div>

            <h3 className="mt-4 font-display text-2xl">
              Aucun commerce trouvé
            </h3>

            <p className="mt-2 text-sm text-white/50">
              Essayez une autre recherche ou une autre ville.
            </p>

            <button
              onClick={() => {
                setQ("");
                setCity("");
                setCategory("");
              }}
              className="mt-6 rounded-full bg-[#c9a24d] px-6 py-3 text-sm font-medium text-black"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="overflow-hidden rounded-2xl bg-[#f4f0e8] text-black transition duration-300 hover:-translate-y-1"
              >
                <VendorCard vendor={vendor} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PROFESSIONAL CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-[#151515]">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=85"
              alt=""
              className="h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative px-7 py-16 md:px-16 md:py-20">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#c9a24d]">
              Professionnels
            </p>

            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight md:text-5xl">
              Faites découvrir votre univers café.
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-white/60">
              Vous êtes torréfacteur, vendeur, boutique, café ou grossiste ?
              Présentez votre activité sur Annuaire Café CI.
            </p>

            <a
              href="/register"
              className="mt-8 inline-flex rounded-full bg-[#c9a24d] px-7 py-4 font-medium text-black transition hover:bg-[#dfbb69]"
            >
              Ajouter mon commerce →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#030303]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <div className="font-display text-xl font-semibold">
              ☕ Annuaire Café CI
            </div>

            <p className="mt-2 text-sm text-white/40">
              L'annuaire du café ivoirien.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-white/50">
            <a href="/" className="transition hover:text-white">
              Accueil
            </a>

            <a
              href="#commerces"
              className="transition hover:text-white"
            >
              Commerces
            </a>

            <a
              href="/register"
              className="transition hover:text-white"
            >
              Professionnels
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 px-6 py-5 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Annuaire Café CI — Tous droits réservés.
        </div>
      </footer>
    </main>
  );
}
