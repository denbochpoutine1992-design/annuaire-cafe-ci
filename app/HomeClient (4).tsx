"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import VendorCard from "@/components/VendorCard";
import { CATEGORIES, VILLES } from "@/lib/constants";
import type { Vendor } from "@/types/vendor";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div
      className="h-[480px] animate-pulse bg-[#EFE8DC] motion-reduce:animate-none"
      aria-hidden="true"
    />
  ),
});

/* Palette (inchangée) : crème #F7F3EC · encre #18120E · espresso #21150F · or #B78B42 */

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B78B42]";

const BTN_GOLD = `inline-flex items-center justify-center rounded-full bg-[#B78B42] px-6 py-3 font-semibold text-[#18120E] transition hover:bg-[#C59A4D] ${FOCUS}`;

function plural(n: number, singular: string, pluralForm = `${singular}s`) {
  return n > 1 ? pluralForm : singular;
}

function SectionHeading({
  eyebrow,
  title,
  text,
  light = false,
}: {
  eyebrow: string;
  title: string;
  text: string;
  light?: boolean;
}) {
  return (
    <div>
      <p
        className={`mb-3 text-sm font-semibold ${
          light ? "text-[#CDA85D]" : "text-[#8A5C20]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-display text-3xl font-semibold tracking-tight md:text-5xl ${
          light ? "text-[#FFFDF9]" : "text-[#18120E]"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-3 max-w-xl leading-relaxed ${
          light ? "text-[#D5C7BA]" : "text-[#6B5F55]"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

export default function HomeClient() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Champ de saisie (brouillon) et recherche appliquée (déclenche le chargement)
  const [draftQ, setDraftQ] = useState("");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  // Totaux globaux, mémorisés lors du chargement sans filtre
  const [stats, setStats] = useState({ count: 0, cities: 0 });

  const scrollPending = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(false);

      try {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (city) params.set("city", city);
        if (category) params.set("category", category);

        const qs = params.toString();
        const res = await fetch(`/api/vendors${qs ? `?${qs}` : ""}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

        const data: unknown = await res.json();
        const list = Array.isArray(data) ? (data as Vendor[]) : [];

        setVendors(list);

        if (!query && !city && !category) {
          setStats({
            count: list.length,
            cities: new Set(list.map((v) => v.city).filter(Boolean)).size,
          });
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error(err);
        setVendors([]);
        setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [query, city, category, reloadKey]);

  // Défile vers les résultats une fois le chargement terminé
  useEffect(() => {
    if (!loading && scrollPending.current) {
      scrollPending.current = false;
      document
        .getElementById("resultats")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    scrollPending.current = true;
    setQuery(draftQ.trim());
  }

  function selectCategory(id: string) {
    scrollPending.current = true;
    setCategory((current) => (current === id ? "" : id));
  }

  function resetFilters() {
    setDraftQ("");
    setQuery("");
    setCity("");
    setCategory("");
  }

  const featuredVendors = useMemo(() => {
    const now = new Date();
    return vendors.filter(
      (v) => v.featured && v.featuredUntil && new Date(v.featuredUntil) > now
    );
  }, [vendors]);

  const hasFilters = Boolean(query || city || category);

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#18120E]">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[600px] overflow-hidden bg-[#21150F] md:min-h-[720px]">
        <Image
          src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=2000&q=85"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0E0A07]/95 via-[#0E0A07]/80 to-[#0E0A07]/30"
          aria-hidden="true"
        />

        {/* Navigation */}
        <nav
          aria-label="Navigation principale"
          className="absolute inset-x-0 top-0 z-50"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
            <Link
              href="/"
              className={`flex items-center gap-3 rounded-full text-white ${FOCUS}`}
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl backdrop-blur"
              >
                ☕
              </span>
              <span className="hidden sm:block">
                <span className="block font-semibold tracking-tight">
                  Annuaire Café CI
                </span>
                <span className="block text-[11px] text-white/60">
                  Côte d’Ivoire
                </span>
              </span>
            </Link>

            <div className="hidden items-center gap-8 text-sm text-white/80 md:flex">
              <a href="#explorer" className={`transition hover:text-white ${FOCUS}`}>
                Explorer
              </a>
              <a href="#resultats" className={`transition hover:text-white ${FOCUS}`}>
                Commerces
              </a>
              <a href="#localisation" className={`transition hover:text-white ${FOCUS}`}>
                Localisation
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={`hidden rounded-full px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 sm:inline-flex ${FOCUS}`}
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className={`rounded-full bg-[#B78B42] px-4 py-2.5 text-sm font-semibold text-[#18120E] shadow-lg transition hover:bg-[#C59A4D] ${FOCUS}`}
              >
                <span className="hidden sm:inline">Inscrire mon commerce</span>
                <span className="sm:hidden">S’inscrire</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Contenu */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-10 md:pt-40">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-[#E7C780]/45 bg-black/25 px-4 py-2 text-sm font-medium text-[#E7C780] backdrop-blur">
              L’univers du café ivoirien
            </p>

            <h1 className="mt-7 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-[#FFFDF9] sm:text-6xl md:text-7xl lg:text-8xl">
              Découvrez le
              <br />
              café autrement.
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-relaxed text-[#E9E0D4] md:text-xl">
              Trouvez les torréfacteurs, boutiques, grossistes, vendeurs en
              ligne et professionnels du café près de chez vous.
            </p>

            <form
              onSubmit={submitSearch}
              role="search"
              className="mt-10 max-w-4xl rounded-[22px] bg-white/95 p-2.5 shadow-[0_25px_80px_rgba(0,0,0,0.32)] md:p-3"
            >
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-[1fr_200px_auto]">
                <div className="flex items-center rounded-2xl bg-white px-4 focus-within:ring-2 focus-within:ring-[#B78B42]">
                  <span aria-hidden="true" className="mr-3 text-xl text-zinc-400">
                    ⌕
                  </span>
                  <label htmlFor="search-q" className="sr-only">
                    Rechercher un café, une marque ou un produit
                  </label>
                  <input
                    id="search-q"
                    type="search"
                    value={draftQ}
                    onChange={(e) => setDraftQ(e.target.value)}
                    placeholder="Rechercher un café, une marque ou un produit…"
                    className="w-full bg-transparent py-4 text-sm text-[#18120E] outline-none md:text-base"
                  />
                </div>

                <div>
                  <label htmlFor="search-city" className="sr-only">
                    Ville
                  </label>
                  <select
                    id="search-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`h-full w-full rounded-2xl bg-[#F4EFE7] px-4 py-4 text-sm text-[#18120E] ${FOCUS}`}
                  >
                    <option value="">Toute la Côte d’Ivoire</option>
                    {VILLES.map((ville) => (
                      <option key={ville} value={ville}>
                        {ville}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className={`${BTN_GOLD} rounded-2xl px-7 py-4`}>
                  Rechercher
                </button>
              </div>
            </form>

            {/* Chiffres : masqués tant qu’ils ne sont pas réels */}
            {stats.count > 0 && (
              <p className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm text-[#D9CCBD]">
                <span>
                  <strong className="mr-2 text-2xl text-[#FFFDF9]">
                    {stats.count}
                  </strong>
                  {plural(stats.count, "commerce")}
                </span>
                {stats.cities > 0 && (
                  <span>
                    <strong className="mr-2 text-2xl text-[#FFFDF9]">
                      {stats.cities}
                    </strong>
                    {plural(stats.cities, "ville")}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F7F3EC] to-transparent"
          aria-hidden="true"
        />
      </section>

      {/* ===== EXPLORER ===== */}
      <section
        id="explorer"
        className="mx-auto max-w-7xl scroll-mt-6 px-5 py-20 md:px-10 md:py-24"
      >
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Explorer"
            title="Trouvez votre café"
            text="Découvrez les professionnels du café en Côte d’Ivoire selon leur activité."
          />

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className={`self-start rounded-full bg-[#EFE4D2] px-4 py-2 text-sm font-semibold text-[#6B4516] md:self-auto ${FOCUS}`}
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => selectCategory(c.id)}
                className={`group min-h-[150px] rounded-[22px] border p-5 text-left transition duration-300 motion-safe:hover:-translate-y-1 ${FOCUS} ${
                  active
                    ? "border-[#21150F] bg-[#21150F] text-white shadow-[0_18px_40px_rgba(34,22,15,0.18)]"
                    : "border-[#E5DDD2] bg-[#FFFDF9] text-[#18120E] shadow-[0_7px_25px_rgba(34,22,15,0.05)]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${
                    active ? "bg-[#B78B42]" : "bg-[#F2E8D8]"
                  }`}
                >
                  ☕
                </span>
                <span className="mt-6 block font-semibold leading-tight">
                  {c.label}
                </span>
                <span
                  className={`mt-2 block text-xs ${
                    active ? "text-[#DCCCB9]" : "text-[#6F6258]"
                  }`}
                >
                  {active ? "Filtre actif" : "Découvrir"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== EN VEDETTE ===== */}
      {featuredVendors.length > 0 && (
        <section className="px-5 pb-20 md:px-10">
          <div className="mx-auto max-w-7xl rounded-[30px] bg-[#21150F] p-6 md:p-10">
            <div className="mb-8">
              <SectionHeading
                light
                eyebrow="Sélection"
                title="Commerces en vedette"
                text="Découvrez les professionnels actuellement mis en avant sur Annuaire Café CI."
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featuredVendors.slice(0, 3).map((vendor) => (
                <VendorCard key={`featured-${vendor.id}`} vendor={vendor} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== POURQUOI ===== */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10">
        <div className="rounded-[30px] border border-[#E8DFD3] bg-white p-10 text-center md:p-14">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Pourquoi choisir Annuaire Café CI&nbsp;?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#6B5F55]">
            Annuaire Café CI rassemble les cafés, torréfacteurs, fournisseurs
            et professionnels du café de Côte d’Ivoire. Une plateforme moderne,
            conçue pour relier les amateurs de café aux bonnes adresses.
          </p>
        </div>
      </section>

      {/* ===== CTA PROFESSIONNELS ===== */}
      <section
        id="professionnels"
        className="mx-auto max-w-7xl px-5 pb-20 md:px-10"
      >
        <div className="grid overflow-hidden rounded-[30px] bg-[#21150F] md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-14">
            <p className="text-sm font-semibold text-[#CDA85D]">
              Professionnels
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[#FFFDF9] md:text-5xl">
              Faites connaître votre commerce.
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-[#D5C7BA]">
              Créez votre fiche professionnelle et présentez votre activité,
              vos produits, vos photos et vos coordonnées aux amateurs de café.
            </p>
            <div className="mt-8">
              <Link href="/register" className={BTN_GOLD}>
                Inscrire mon commerce
              </Link>
            </div>
          </div>

          <div className="relative min-h-[260px] md:min-h-[320px]">
            <Image
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== RÉSULTATS ===== */}
      <section
        id="resultats"
        className="scroll-mt-6 border-t border-[#E8E0D5] bg-[#FFFDF9] py-20 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Annuaire"
              title="Les professionnels"
              text="Retrouvez les commerces référencés sur Annuaire Café CI."
            />

            <p
              aria-live="polite"
              className="self-start rounded-full bg-[#F4EFE7] px-4 py-2 text-sm font-medium text-[#6F6258] md:self-auto"
            >
              {loading
                ? "Chargement…"
                : `${vendors.length} ${plural(vendors.length, "résultat")}`}
            </p>
          </div>

          {loading ? (
            <div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              aria-busy="true"
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-[24px] bg-[#F4EFE7] motion-reduce:animate-none"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[28px] border border-[#E8DFD3] bg-[#F7F3EC] p-10 text-center md:p-16">
              <h3 className="font-display text-2xl font-semibold">
                Impossible de charger les commerces
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-[#6B5F55]">
                Vérifiez votre connexion, puis réessayez.
              </p>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className={`mt-7 rounded-full bg-[#21150F] px-6 py-3 font-semibold text-white ${FOCUS}`}
              >
                Réessayer
              </button>
            </div>
          ) : vendors.length === 0 ? (
            <div className="rounded-[28px] border border-[#E8DFD3] bg-[#F7F3EC] p-10 text-center md:p-16">
              <h3 className="font-display text-2xl font-semibold">
                Aucun commerce trouvé
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-[#6B5F55]">
                Aucun professionnel ne correspond à votre recherche. Essayez une
                autre ville, une autre catégorie ou un autre terme.
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className={`mt-7 rounded-full bg-[#21150F] px-6 py-3 font-semibold text-white ${FOCUS}`}
                >
                  Voir tous les commerces
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CARTE ===== */}
      <section
        id="localisation"
        className="mx-auto max-w-7xl scroll-mt-6 px-5 py-20 md:px-10 md:py-24"
      >
        <div className="mb-8">
          <SectionHeading
            eyebrow="Localisation"
            title="Le café près de chez vous"
            text="Retrouvez sur la carte les commerces ayant renseigné leur localisation."
          />
        </div>

        <div className="overflow-hidden rounded-[28px] border border-[#DED5C8] shadow-[0_18px_60px_rgba(39,26,17,0.08)]">
          <MapView vendors={vendors} height={480} />
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="px-5 pb-20 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 rounded-[30px] bg-[#B78B42] px-7 py-12 text-[#18120E] md:px-14 md:py-16 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Votre commerce mérite d’être découvert.
            </h2>
            <p className="mt-4 text-lg">
              Rejoignez l’annuaire des professionnels du café en Côte d’Ivoire.
            </p>
          </div>

          <Link
            href="/register"
            className={`inline-flex justify-center whitespace-nowrap rounded-full bg-[#21150F] px-7 py-4 font-semibold text-white transition hover:bg-black ${FOCUS}`}
          >
            Créer ma fiche gratuitement
          </Link>
        </div>
      </section>

      {/* ===== PIED DE PAGE ===== */}
      <footer className="border-t border-[#E5DDD2] px-5 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 text-sm text-[#6B5F55] md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Annuaire Café CI. Tous droits réservés.</p>

          {/* Vérifie que ces chemins correspondent à tes pages existantes */}
          <nav aria-label="Informations légales" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/mentions-legales" className={`hover:text-[#18120E] ${FOCUS}`}>
              Mentions légales
            </Link>
            <Link href="/confidentialite" className={`hover:text-[#18120E] ${FOCUS}`}>
              Confidentialité
            </Link>
            <Link href="/cgu" className={`hover:text-[#18120E] ${FOCUS}`}>
              CGU
            </Link>
            <Link href="/contact" className={`hover:text-[#18120E] ${FOCUS}`}>
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
