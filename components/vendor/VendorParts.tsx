"use client";

// Morceaux de la page d'un commerce (en-tête, présentation, galerie, colonne de droite).
// Ils sont séparés de la page pour garder des fichiers courts et faciles à modifier.

import Link from "next/link";
import StarRating from "@/components/StarRating";
import { catLabel } from "@/lib/constants";

export function VendorHero({ vendor, accent, cover, isFeatured }: { vendor: any, accent: string, cover: string | undefined, isFeatured: boolean }) {
  return (
    <>
    {/* NAVIGATION */}
    <nav
      className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b"
      style={{ borderColor: "#E4E4E7" }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold"
          style={{ color: "#18181B" }}
        >
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{
              background: "#18181B",
            }}
          >
            ☕
          </span>

          <span className="hidden sm:block">
            Annuaire Café CI
          </span>
        </Link>

        <Link
          href="/"
          className="text-sm font-semibold px-4 py-2 rounded-full"
          style={{
            background: "#F4F4F5",
            color: "#18181B",
          }}
        >
          ← Retour
        </Link>
      </div>
    </nav>

    {/* HERO IMAGE */}
    <section className="relative">
      <div
        className="w-full h-[280px] md:h-[420px]"
        style={{
          background: accent,
        }}
      >
        {cover ? (
          <img
            src={cover}
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-7xl mb-3">☕</div>
              <div className="text-sm opacity-80">
                Annuaire Café CI
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.55))",
        }}
      />

      <div className="absolute bottom-5 left-0 right-0">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex flex-wrap gap-2">
            <span
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-white"
              style={{ color: accent }}
            >
              {catLabel(vendor.category)}
            </span>

            {isFeatured && (
              <span
                className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: "#F59E0B",
                  color: "#fff",
                }}
              >
                ⭐ Commerce en vedette
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

export function VendorIdentity({ vendor, reviews, avgRating, accent }: { vendor: any, reviews: any, avgRating: number, accent: string }) {
  return (
    <>
    {/* IDENTITÉ */}
    <section
      className="bg-white rounded-3xl p-6 md:p-8"
      style={{
        border: "1px solid #E4E4E7",
        boxShadow:
          "0 20px 45px -30px rgba(24,24,27,0.35)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold text-white shrink-0"
          style={{
            background: accent,
          }}
        >
          {vendor.name?.charAt(0)?.toUpperCase() || "?"}
        </div>

        <div className="min-w-0 flex-1">
          <h1
            className="text-2xl md:text-4xl font-black leading-tight"
            style={{ color: "#18181B" }}
          >
            {vendor.name}
          </h1>

          <p
            className="mt-2 text-sm md:text-base"
            style={{ color: "#71717A" }}
          >
            📍 {vendor.city}
          </p>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <StarRating value={avgRating} size={20} />

              <span
                className="font-bold"
                style={{ color: "#18181B" }}
              >
                {avgRating.toFixed(1)}
              </span>

              <span
                className="text-sm"
                style={{ color: "#71717A" }}
              >
                · {reviews.length} avis
              </span>
            </div>
          )}
        </div>
      </div>

      {vendor.description && (
        <div
          className="mt-7 pt-6 border-t"
          style={{ borderColor: "#F4F4F5" }}
        >
          <h2 className="font-bold text-lg mb-2">
            À propos
          </h2>

          <p
            className="text-sm md:text-base leading-7"
            style={{ color: "#52525B" }}
          >
            {vendor.description}
          </p>
        </div>
      )}
    {vendor.expirationDate && (
      <div
        className="mt-5 rounded-2xl px-4 py-4"
        style={{
          background: "#FFF8E7",
          border: "1px solid #EADFD5",
        }}
      >
        <div className="font-bold">
          📅 Date de péremption
        </div>

        <div className="mt-1">
          {vendor.expirationDate}
        </div>
      </div>
    )}
      {vendor.priceInfo && (
        <div
          className="mt-5 rounded-2xl px-4 py-4 flex items-center gap-3"
          style={{
            background: "#FAF7F3",
            border: "1px solid #EADFD5",
          }}
        >
          <span className="text-2xl">💰</span>

          <div>
            <div
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "#71717A" }}
            >
              Informations tarifaires
            </div>

            <div
              className="font-bold mt-1"
              style={{ color: "#18181B" }}
            >
              {vendor.priceInfo}
            </div>
          </div>
        </div>
      )}
    </section>
    </>
  );
}

export function VendorGallery({ vendor, photos, accent, cover }: { vendor: any, photos: any, accent: string, cover: string | undefined }) {
  return (
    <>
    {/* GALERIE */}
    {photos.length > 1 && (
      <section
        className="bg-white rounded-3xl p-6 md:p-8"
        style={{
          border: "1px solid #E4E4E7",
        }}
      >
        <div className="mb-6">
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: accent }}
          >
            En images
          </p>

          <h2 className="text-2xl font-black mt-1">
            Galerie
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.slice(1).map((p: any, index: number) => (
            <div
              key={p.id}
              className={`overflow-hidden rounded-2xl ${
                index === 0
                  ? "md:col-span-2 md:row-span-2"
                  : ""
              }`}
              style={{
                minHeight: index === 0 ? "250px" : "150px",
                background: "#F4F4F5",
              }}
            >
              <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={p.url}
        alt={`${vendor.name} - photo ${index + 2}`}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </a>
            </div>
          ))}
        </div>
      </section>
    )}
    </>
  );
}

export function VendorSidebar({ vendor, reviews, avgRating, accent }: { vendor: any, reviews: any, avgRating: number, accent: string }) {
  return (
    <>
    {/* COLONNE DROITE */}
    <aside className="lg:sticky lg:top-24 h-fit">
      <div
        className="bg-white rounded-3xl p-5 md:p-6"
        style={{
          border: "1px solid #E4E4E7",
          boxShadow:
            "0 20px 45px -30px rgba(24,24,27,0.3)",
        }}
      >
        <div className="mb-5">
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: accent }}
          >
            Acheter en toute sécurité
          </p>

          <h2 className="text-xl font-black mt-1">
            {vendor.name}
          </h2>

          <p
            className="text-sm mt-2 leading-6"
            style={{ color: "#71717A" }}
          >
            Ajoutez les produits à votre panier : Annuaire Café CI
            gère le paiement, la préparation et la livraison de
            votre commande.
          </p>
        </div>

        <div
          className="mt-5 pt-5 border-t space-y-4"
          style={{ borderColor: "#F4F4F5" }}
        >
          {reviews.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-xl">⭐</span>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Satisfaction
                </div>

                <div className="text-sm font-semibold mt-1">
                  {avgRating.toFixed(1)} / 5 ·{" "}
                  {reviews.length} avis
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
    </>
  );
}
