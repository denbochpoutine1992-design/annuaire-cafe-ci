"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import StarRating from "@/components/StarRating";
import { catLabel } from "@/lib/constants";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

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

function waLink(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  const withCountry = digits.startsWith("225") ? digits : `225${digits.replace(/^0+/, "")}`;
  return `https://wa.me/${withCountry}`;
}

export default function VendorDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ authorName: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  function load() {
    fetch(`/api/vendors/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setVendor)
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewForm.authorName.trim()) {
      setReviewError("Votre nom est requis.");
      return;
    }
    setSubmitting(true);
    setReviewError("");
    const res = await fetch(`/api/vendors/${id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewForm),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setReviewError(data.error || "Une erreur est survenue.");
      return;
    }
    setReviewForm({ authorName: "", rating: 5, comment: "" });
    load();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm" style={{ color: "#71717A" }}>Chargement...</p>
      </div>
    );
  }
  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm" style={{ color: "#71717A" }}>Fiche introuvable.</p>
      </div>
    );
  }

  const avgRating =
    vendor.reviews.length > 0
      ? vendor.reviews.reduce((s: number, r: any) => s + r.rating, 0) / vendor.reviews.length
      : 0;
  const accent = catColor(vendor.category);
  const cover = vendor.photos?.[0]?.url;
  const isFeatured =
    vendor.featured && vendor.featuredUntil && new Date(vendor.featuredUntil) > new Date();

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <nav className="px-6 md:px-12 py-4 border-b border-line bg-white">
        <Link href="/" className="text-sm font-medium" style={{ color: "#18181B" }}>
          ← Retour à l'annuaire
        </Link>
      </nav>

      <div
        className="w-full"
        style={{
          height: cover ? 220 : 140,
          background: cover ? undefined : accent,
        }}
      >
        {cover && (
          <img src={cover} alt={vendor.name} className="w-full h-full object-cover" />
        )}
      </div>

      <main className="px-6 md:px-12 max-w-2xl mx-auto">
        <div
          className="relative -mt-10 mb-6 rounded-2xl p-5"
          style={{ background: "#fff", border: "1px solid #E4E4E7", boxShadow: "0 16px 32px -20px rgba(24,24,27,0.25)" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl text-white shrink-0"
              style={{ background: accent, border: "3px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
            >
              {vendor.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full"
                  style={{ color: accent, background: "#F4F4F5" }}
                >
                  {catLabel(vendor.category)}
                </span>
                {isFeatured && (
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full"
                    style={{ color: "#B45309", background: "#FFF7ED" }}
                  >
                    ⭐ En vedette
                  </span>
                )}
              </div>
              <h1 className="font-bold text-2xl mt-2 leading-tight" style={{ color: "#18181B" }}>
                {vendor.name}
              </h1>
              <p className="text-sm mt-1" style={{ color: "#71717A" }}>
                📍 {vendor.neighborhood ? `${vendor.neighborhood}, ` : ""}{vendor.city}
              </p>
            </div>
          </div>

          {vendor.reviews.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <StarRating value={avgRating} size={18} />
              <span className="text-sm font-medium" style={{ color: "#18181B" }}>
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm" style={{ color: "#71717A" }}>
                ({vendor.reviews.length} avis)
              </span>
            </div>
          )}

          {vendor.description && (
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "#3F3F46" }}>
              {vendor.description}
            </p>
          )}

          <div className="mt-5 flex gap-3">
            <a
              href={`tel:${vendor.phone}`}
              className="flex-1 text-center text-sm font-medium px-4 py-3 rounded-full"
              style={{ border: "1px solid #E4E4E7", color: "#18181B" }}
            >
              📞 Appeler
            </a>
            <a
              href={waLink(vendor.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 text-center text-sm font-medium px-4 py-3 rounded-full"
            >
              💬 WhatsApp
            </a>
          </div>
          {vendor.priceInfo && (
            <div className="mt-3 text-center text-sm font-medium py-2 rounded-full" style={{ background: "#F4F4F5", color: "#18181B" }}>
              {vendor.priceInfo}
            </div>
          )}
        </div>

        {vendor.photos?.length > 1 && (
          <section className="mb-8">
            <h2 className="font-semibold text-lg mb-3" style={{ color: "#18181B" }}>Photos</h2>
            <div className="grid grid-cols-3 gap-2">
              {vendor.photos.slice(1).map((p: any) => (
                <img
                  key={p.id}
                  src={p.url}
                  alt={vendor.name}
                  className="w-full h-24 object-cover rounded-xl"
                  style={{ border: "1px solid #E4E4E7" }}
                />
              ))}
            </div>
          </section>
        )}

        {vendor.products?.length > 0 && (
          <section className="mb-8">
            <h2 className="font-semibold text-lg mb-3" style={{ color: "#18181B" }}>
              🛍️ Catalogue ({vendor.products.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {vendor.products.map((p: any) => (
                <div key={p.id} className="product-tile">
                  <div className="product-tile-image">
                    {p.photoUrl ? (
                      <img src={p.photoUrl} alt={p.name} />
                    ) : (
                      <span style={{ fontSize: 22 }}>☕</span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <div className="font-semibold text-[13px] leading-snug" style={{ color: "#18181B" }}>
                      {p.name}
                    </div>
                    {p.price && (
                      <div className="font-bold text-[13px] mt-1" style={{ color: "#18181B" }}>
                        {p.price}
                      </div>
                    )}
                    {p.description && (
                      <p className="text-[11px] mt-1 line-clamp-2" style={{ color: "#71717A" }}>
                        {p.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {vendor.latitude != null && vendor.longitude != null && (
          <section className="mb-8">
            <h2 className="font-semibold text-lg mb-3" style={{ color: "#18181B" }}>🗺️ Localisation</h2>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E4E4E7" }}>
              <MapView vendors={[vendor]} center={[vendor.latitude, vendor.longitude]} zoom={14} height={260} />
            </div>
          </section>
        )}

        <section className="mb-12">
          <h2 className="font-semibold text-lg mb-3" style={{ color: "#18181B" }}>✍️ Avis</h2>

          <form
            onSubmit={submitReview}
            className="p-4 mb-6 flex flex-col gap-3 rounded-2xl"
            style={{ background: "#fff", border: "1px solid #E4E4E7" }}
          >
            <div className="flex items-center gap-3">
              <input
                value={reviewForm.authorName}
                onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                placeholder="Votre nom"
                className="flex-1 px-3 py-2.5 rounded-xl text-sm border border-line"
              />
              <StarRating
                value={reviewForm.rating}
                interactive
                size={20}
                onChange={(v) => setReviewForm({ ...reviewForm, rating: v })}
              />
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Votre avis (optionnel)"
              rows={2}
              className="px-3 py-2.5 rounded-xl text-sm border border-line resize-none"
            />
            {reviewError && <p className="text-xs" style={{ color: "#DC2626" }}>{reviewError}</p>}
            <button
              disabled={submitting}
              className="btn-primary text-sm font-medium px-5 py-2.5 rounded-full self-start"
            >
              {submitting ? "Envoi..." : "Publier l'avis"}
            </button>
          </form>

          <div className="flex flex-col gap-4">
            {vendor.reviews.length === 0 && (
              <p className="text-sm" style={{ color: "#71717A" }}>
                Aucun avis pour l'instant. Soyez le premier à partager votre expérience.
              </p>
            )}
            {vendor.reviews.map((r: any) => (
              <div key={r.id} className="p-4 rounded-2xl" style={{ background: "#fff", border: "1px solid #E4E4E7" }}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm" style={{ color: "#18181B" }}>{r.authorName}</span>
                  <StarRating value={r.rating} />
                </div>
                {r.comment && (
                  <p className="text-sm mt-2" style={{ color: "#3F3F46" }}>{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
