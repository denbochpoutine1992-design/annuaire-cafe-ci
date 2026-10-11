"use client";

import Image from "next/image";
import Link from "next/link";

import StarRating from "./StarRating";
import { catLabel } from "@/lib/constants";
import type { Vendor } from "@/types/vendor";

/** Numéro ivoirien au format international, chiffres uniquement (ex. 2250749583050). */
function toIntlDigits(phone?: string | null) {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) return "";

  let local = digits.startsWith("225") ? digits.slice(3) : digits;

  // Numéro enregistré sans le 0 initial : 749583050 → 0749583050
  if (local.length === 9 && !local.startsWith("0")) local = `0${local}`;

  return `225${local}`;
}

const CATEGORY_COLORS: Record<string, string> = {
  torrefacteur: "#7C4A2D",
  detaillant: "#166534",
  communautaire: "#B45309",
  grossiste: "#9333EA",
  enligne: "#1D4ED8",
};

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B78B42]";

export default function VendorCard({ vendor }: { vendor: Vendor }) {
  const name = vendor.name ?? "Commerce";
  const accent = CATEGORY_COLORS[vendor.category ?? ""] ?? "#3F3F46";

  const reviews = vendor.reviews ?? [];
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const productCount = vendor.products?.length ?? 0;
  const cover = vendor.photos?.[0]?.url;

  const isFeatured = Boolean(
    vendor.featured &&
      vendor.featuredUntil &&
      new Date(vendor.featuredUntil) > new Date()
  );

  const intl = toIntlDigits(vendor.phone);
  const place = [vendor.neighborhood, vendor.city].filter(Boolean).join(", ");

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border bg-white transition duration-300 focus-within:ring-2 focus-within:ring-[#B78B42] motion-safe:hover:-translate-y-1 hover:shadow-xl"
      style={{ borderColor: isFeatured ? accent : "#E4E4E7" }}
    >
      <div className="h-1.5" style={{ background: accent }} aria-hidden="true" />

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-zinc-100">
        {cover ? (
          <Image
            src={cover}
            alt={`Photo de ${name}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            // Retire « unoptimized » une fois le domaine des photos déclaré dans next.config
            unoptimized
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center text-6xl font-bold text-white"
            style={{ background: accent }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
          aria-hidden="true"
        />

        {isFeatured && (
          <span
            className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg"
            style={{ background: accent }}
          >
            En vedette
          </span>
        )}

        {vendor.category && (
          <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-sm">
            {catLabel(vendor.category)}
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="truncate text-xl font-bold leading-tight text-zinc-900">
          {/* Lien étendu : toute la carte est cliquable, sans lien imbriqué */}
          <Link
            href={`/vendors/${vendor.id}`}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {name}
          </Link>
        </h3>

        {place && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-600">
            <span aria-hidden="true">📍</span>
            <span className="truncate">{place}</span>
          </p>
        )}

        {(reviews.length > 0 || productCount > 0) && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <StarRating value={avgRating} />
                <span className="text-sm font-semibold text-zinc-700">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-xs text-zinc-500">
                  ({reviews.length})
                </span>
              </div>
            )}

            {productCount > 0 && (
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                {productCount} article{productCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {vendor.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-zinc-600">
            {vendor.description}
          </p>
        )}

        {vendor.priceInfo && (
          <p className="mt-4 rounded-xl bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600">
            <span aria-hidden="true">💰 </span>
            {vendor.priceInfo}
          </p>
        )}

        {/* Actions : au-dessus du lien étendu (z-10) */}
        <div className="mt-auto pt-5">
          {intl && (
            <div className="relative z-10 flex items-center gap-2 border-t border-zinc-200 pt-4">
              <a
                href={`tel:+${intl}`}
                className={`flex-1 rounded-full border border-zinc-300 px-3 py-2.5 text-center text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 ${FOCUS}`}
              >
                Appeler
                <span className="sr-only"> {name}</span>
              </a>

              <a
                href={`https://wa.me/${intl}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 rounded-full bg-[#0F7A40] px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0B6333] ${FOCUS}`}
              >
                WhatsApp
                <span className="sr-only"> {name} (nouvel onglet)</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
