"use client";

import Link from "next/link";
import StarRating from "./StarRating";
import { catLabel } from "@/lib/constants";

function waLink(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  const withCountry = digits.startsWith("225") ? digits : `225${digits.replace(/^0+/, "")}`;
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
      ? vendor.reviews.reduce((s: number, r: any) => s + r.rating, 0) / vendor.reviews.length
      : 0;
  const cover = vendor.photos?.[0]?.url;
  const isFeatured =
    vendor.featured && vendor.featuredUntil && new Date(vendor.featuredUntil) > new Date();
  const accent = catColor(vendor.category);

  return (
    <Link
      href={`/vendors/${vendor.id}`}
      className="vendor-card relative block overflow-hidden"
      style={{
        borderRadius: 16,
        border: isFeatured ? `1.5px solid ${accent}` : "1px solid #E4E4E7",
      }}
    >
      <div style={{ height: 4, background: accent }} />
      <div className="p-5">
        {isFeatured && (
          <div
            className="text-[11px] font-semibold uppercase tracking-wide mb-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{ color: accent, background: "#F4F4F5" }}
          >
            ⭐ En vedette
          </div>
        )}

        <div className="flex items-center gap-3">
          {cover ? (
            <img
              src={cover}
              alt={vendor.name}
              className="w-14 h-14 object-cover rounded-full shrink-0"
              style={{ border: "1px solid #E4E4E7" }}
            />
          ) : (
            <div
              className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center font-semibold text-lg text-white"
              style={{ background: accent }}
            >
              {vendor.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg leading-tight truncate">{vendor.name}</h3>
            <div className="text-xs mt-1" style={{ color: "#71717A" }}>
              📍 {vendor.neighborhood ? `${vendor.neighborhood}, ` : ""}
              {vendor.city}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span
            className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full"
            style={{ color: accent, background: "#F4F4F5" }}
          >
            {catLabel(vendor.category)}
          </span>
          {vendor.reviews?.length > 0 && (
            <div className="flex items-center gap-1">
              <StarRating value={avgRating} />
              <span className="text-xs" style={{ color: "#71717A" }}>
                ({vendor.reviews.length})
              </span>
            </div>
          )}
          {vendor.products?.length > 0 && (
            <span className="text-xs" style={{ color: "#71717A" }}>
              🛍️ {vendor.products.length} article{vendor.products.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {vendor.description && (
          <p className="mt-3 text-sm leading-relaxed line-clamp-2" style={{ color: "#3F3F46" }}>
            {vendor.description}
          </p>
        )}

        <div
          className="mt-4 pt-4 flex items-center gap-2 text-xs font-medium"
          style={{ borderTop: "1px solid #E4E4E7" }}
        >
          <a
            href={`tel:${vendor.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-center px-3 py-2 rounded-full"
            style={{ border: "1px solid #E4E4E7", color: "#18181B" }}
          >
            📞 Appeler
          </a>
          <a
            href={waLink(vendor.phone)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn-primary flex-1 text-center px-3 py-2 rounded-full"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </Link>
  );
}
