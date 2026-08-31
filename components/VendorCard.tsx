"use client";

import Link from "next/link";
import StarRating from "./StarRating";
import { catLabel } from "@/lib/constants";

function waLink(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  const withCountry = digits.startsWith("225") ? digits : `225${digits.replace(/^0+/, "")}`;
  return `https://wa.me/${withCountry}`;
}

export default function VendorCard({ vendor }: { vendor: any }) {
  const avgRating =
    vendor.reviews?.length > 0
      ? vendor.reviews.reduce((s: number, r: any) => s + r.rating, 0) / vendor.reviews.length
      : 0;
  const cover = vendor.photos?.[0]?.url;

  return (
    <Link
      href={`/vendors/${vendor.id}`}
      className="stitch vendor-card relative p-5 block"
    >
      {cover && (
        <img
          src={cover}
          alt={vendor.name}
          className="w-full h-32 object-cover rounded-md mb-3"
          style={{ border: "1px solid #E7E5E4" }}
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display font-semibold text-xl leading-tight">{vendor.name}</h3>
        <span className="stamp shrink-0" style={{ color: "#15803D" }}>
          {catLabel(vendor.category)}
        </span>
      </div>

      <div className="mt-2 text-sm" style={{ color: "#57534E" }}>
        📍 {vendor.neighborhood ? `${vendor.neighborhood}, ` : ""}
        {vendor.city}
      </div>

      {vendor.description && (
        <p className="mt-3 text-sm leading-relaxed line-clamp-2" style={{ color: "#292524" }}>
          {vendor.description}
        </p>
      )}

      {vendor.reviews?.length > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <StarRating value={avgRating} />
          <span className="font-mono text-xs" style={{ color: "#78716C" }}>
            ({vendor.reviews.length})
          </span>
        </div>
      )}

      {vendor.products?.length > 0 && (
        <div className="mt-3 font-mono text-xs" style={{ color: "#C2410C" }}>
          🛍️ {vendor.products.length} article{vendor.products.length !== 1 ? "s" : ""}
        </div>
      )}

      <div
        className="mt-4 pt-3 flex items-center gap-2 font-mono text-xs"
        style={{ borderTop: "1px solid #E7E5E4" }}
      >
        <a
          href={`tel:${vendor.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="stitch px-3 py-1.5"
          style={{ color: "#18181B" }}
        >
          📞 Appeler
        </a>
        <a
          href={waLink(vendor.phone)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="btn-primary px-3 py-1.5"
          style={{ borderRadius: "8px" }}
        >
          💬 WhatsApp
        </a>
      </div>
    </Link>
  );
}
