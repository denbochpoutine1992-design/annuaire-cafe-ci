"use client";

import Link from "next/link";
import StarRating from "./StarRating";
import { catLabel } from "@/lib/constants";

function waLink(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  const withCountry = digits.startsWith("225")
    ? digits
    : `225${digits.replace(/^0+/, "")}`;

  return `https://wa.me/${withCountry}`;
}

const CATEGORY_COLORS: Record<string, string> = {
  torrefacteur: "#7C4A2D",
  detaillant: "#166534",
  communautaire: "#B45309",
  grossiste: "#9333EA",
  enligne: "#1D4ED8",
};

function catColor(category: string) {
  return CATEGORY_COLORS[category] || "#3F3F46";
}

export default function VendorCard({ vendor }: { vendor: any }) {
  const avgRating =
    vendor.reviews?.length > 0
      ? vendor.reviews.reduce(
          (s: number, r: any) => s + r.rating,
          0
        ) / vendor.reviews.length
      : 0;

  const cover = vendor.photos?.[0]?.url;

  const isFeatured =
    vendor.featured &&
    vendor.featuredUntil &&
    new Date(vendor.featuredUntil) > new Date();

  const accent = catColor(vendor.category);

  return (
    <Link
      href={`/vendors/${vendor.id}`}
      className="group relative block overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        borderRadius: 20,
        border: isFeatured
          ? `1.5px solid ${accent}`
          : "1px solid #E4E4E7",
      }}
    >
      {/* Barre supérieure */}
      <div
        className="h-1.5"
        style={{ background: accent }}
      />

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-zinc-100">
        {cover ? (
          <img
            src={cover}
            alt={vendor.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-6xl font-bold text-white"
            style={{ background: accent }}
          >
            {vendor.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}

        {/* Dégradé */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {/* Badge vedette */}
        {isFeatured && (
          <div
            className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-sm"
            style={{ background: accent }}
          >
            ⭐ En vedette
          </div>
        )}

        {/* Catégorie */}
        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-zinc-800 shadow-sm">
            {catLabel(vendor.category)}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5">
        {/* Nom + localisation */}
        <div>
          <h3 className="truncate text-xl font-bold leading-tight text-zinc-900">
            {vendor.name}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500">
            <span>📍</span>
            <span className="truncate">
              {vendor.neighborhood
                ? `${vendor.neighborhood}, `
                : ""}
              {vendor.city}
            </span>
          </div>
        </div>

        {/* Note + produits */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {vendor.reviews?.length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating value={avgRating} />

              <span className="text-sm font-semibold text-zinc-700">
                {avgRating.toFixed(1)}
              </span>

              <span className="text-xs text-zinc-400">
                ({vendor.reviews.length})
              </span>
            </div>
          )}

          {vendor.products?.length > 0 && (
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
              🛍️ {vendor.products.length} article
              {vendor.products.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Description */}
        {vendor.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-zinc-600">
            {vendor.description}
          </p>
        )}

        {/* Prix */}
        {vendor.priceInfo && (
          <div className="mt-4 rounded-xl bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600">
            💰 {vendor.priceInfo}
          </div>
        )}

        {/* Voir le commerce */}
        <div className="mt-5">
          <div
            className="flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 group-hover:opacity-90"
            style={{ background: accent }}
          >
            Voir le commerce
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>

        {/* Actions */}
        <div
          className="mt-4 flex items-center gap-2 border-t pt-4"
          style={{ borderColor: "#E4E4E7" }}
        >
          <a
            href={`tel:${vendor.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 rounded-full border border-zinc-200 px-3 py-2.5 text-center text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            📞 Appeler
          </a>

          <a
            href={waLink(vendor.phone)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 rounded-full px-3 py-2.5 text-center text-xs font-semibold text-white transition hover:opacity-90"
            style={{ background: "#25D366" }}
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </Link>
  );
}
