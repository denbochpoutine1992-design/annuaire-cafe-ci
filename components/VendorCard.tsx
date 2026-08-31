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

export default function VendorCard({ vendor }: { vendor: any }) {
  const avgRating =
    vendor.reviews?.length > 0
      ? vendor.reviews.reduce(
          (s: number, r: any) => s + r.rating,
          0
        ) / vendor.reviews.length
      : 0;

  const cover = vendor.photos?.[0]?.url;

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#eadbc5] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* IMAGE */}
      <Link href={`/vendors/${vendor.id}`} className="block">
        <div className="relative h-52 overflow-hidden bg-[#f3eadc]">

          {cover ? (
            <img
              src={cover}
              alt={vendor.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="text-6xl">☕</div>
                <div className="mt-2 text-sm font-medium text-[#8a7355]">
                  Café ivoirien
                </div>
              </div>
            </div>
          )}

          {/* OVERLAY */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

          {/* CATEGORY */}
          <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#315c45] shadow-sm">
            ☕ {catLabel(vendor.category)}
          </div>

          {/* VERIFIED */}
          <div className="absolute bottom-4 left-4 rounded-full bg-[#315c45] px-3 py-1.5 text-xs font-semibold text-white">
            ✓ Vendeur référencé
          </div>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-5">

        {/* NAME */}
        <div className="flex items-start justify-between gap-3">
          <Link href={`/vendors/${vendor.id}`}>
            <h3 className="font-serif text-2xl font-bold leading-tight text-[#302016] transition-colors hover:text-[#b85c38]">
              {vendor.name}
            </h3>
          </Link>

          {vendor.reviews?.length > 0 && (
            <div className="shrink-0 rounded-lg bg-[#fff6e8] px-2 py-1 text-xs font-bold text-[#9a5a21]">
              ⭐ {avgRating.toFixed(1)}
            </div>
          )}
        </div>

        {/* LOCATION */}
        <div className="mt-2 flex items-center gap-1.5 text-sm text-[#756453]">
          <span>📍</span>
          <span>
            {vendor.neighborhood
              ? `${vendor.neighborhood}, `
              : ""}
            {vendor.city}
          </span>
        </div>

        {/* DESCRIPTION */}
        {vendor.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#6b5747]">
            {vendor.description}
          </p>
        )}

        {/* RATING */}
        {vendor.reviews?.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <StarRating value={avgRating} />

            <span className="text-xs text-[#8a7355]">
              {vendor.reviews.length} avis
            </span>
          </div>
        )}

        {/* PRODUCTS */}
        {vendor.products?.length > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#f8f3ea] px-3 py-2.5 text-sm font-medium text-[#9a4c2d]">
            <span>☕</span>
            <span>
              {vendor.products.length} produit
              {vendor.products.length !== 1 ? "s" : ""} disponible
              {vendor.products.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-5 flex gap-2 border-t border-[#eee3d2] pt-4">

          <Link
            href={`/vendors/${vendor.id}`}
            className="flex flex-1 items-center justify-center rounded-xl border border-[#d9c5a7] px-3 py-3 text-sm font-semibold text-[#302016] transition hover:bg-[#fbf7ef]"
          >
            Voir la boutique
          </Link>

          <a
            href={`tel:${vendor.phone}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d9c5a7] text-lg transition hover:bg-[#fbf7ef]"
            aria-label="Appeler"
          >
            📞
          </a>

          <a
            href={waLink(vendor.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#315c45] text-lg text-white transition hover:bg-[#254b37]"
            aria-label="WhatsApp"
          >
            💬
          </a>

        </div>
      </div>
    </article>
  );
}
