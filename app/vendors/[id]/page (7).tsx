"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import StarRating from "@/components/StarRating";
import { catLabel } from "@/lib/constants";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

function waLink(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  // Assume Côte d'Ivoire numbers; prefix with country code 225 if not already international.
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

  if (loading) return <p className="p-10 font-mono text-sm" style={{ color: "#78716C" }}>Chargement...</p>;
  if (!vendor) return <p className="p-10 font-mono text-sm" style={{ color: "#78716C" }}>Fiche introuvable.</p>;

  const avgRating =
    vendor.reviews.length > 0
      ? vendor.reviews.reduce((s: number, r: any) => s + r.rating, 0) / vendor.reviews.length
      : 0;

  return (
    <div className="min-h-screen">
      <nav className="px-6 md:px-12 py-4 border-b border-line">
        <Link href="/" className="font-mono text-xs uppercase tracking-wide">← Retour à l'annuaire</Link>
      </nav>

      <main className="px-6 md:px-12 py-10 max-w-2xl mx-auto">
        <div className="stamp" style={{ color: "#15803D" }}>{catLabel(vendor.category)}</div>
        <h1 className="font-display font-semibold mt-4" style={{ fontSize: "2.5rem" }}>{vendor.name}</h1>
        <p className="mt-1 text-sm" style={{ color: "#57534E" }}>
          📍 {vendor.neighborhood ? `${vendor.neighborhood}, ` : ""}{vendor.city}
        </p>

        {vendor.reviews.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <StarRating value={avgRating} size={18} />
            <span className="font-mono text-sm" style={{ color: "#78716C" }}>
              {avgRating.toFixed(1)} ({vendor.reviews.length} avis)
            </span>
          </div>
        )}

        {vendor.description && (
          <p className="mt-5 leading-relaxed" style={{ color: "#292524" }}>{vendor.description}</p>
        )}

        <div className="mt-5 flex flex-wrap gap-3 font-mono text-sm">
          <a href={`tel:${vendor.phone}`} className="stitch px-4 py-2" style={{ color: "#18181B" }}>
            📞 Appeler
          </a>
          <a
            href={waLink(vendor.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-4 py-2 rounded-full"
            style={{ borderRadius: "10px" }}
          >
            💬 WhatsApp
          </a>
          {vendor.priceInfo && (
            <span className="stitch px-4 py-2" style={{ color: "#C2410C" }}>{vendor.priceInfo}</span>
          )}
        </div>

        {vendor.photos.length > 0 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {vendor.photos.map((p: any) => (
              <img key={p.id} src={p.url} alt={vendor.name} className="w-full h-32 object-cover rounded-md" style={{ border: "1px solid #E7E5E4" }} />
            ))}
          </div>
        )}

        {vendor.products?.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display font-semibold text-xl">Nos articles</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {vendor.products.map((p: any) => (
                <div key={p.id} className="vendor-card stitch p-3">
                  {p.photoUrl ? (
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="w-full h-24 object-cover rounded-md mb-2"
                      style={{ border: "1px solid #E7E5E4" }}
                    />
                  ) : (
                    <div
                      className="w-full h-24 rounded-md mb-2 flex items-center justify-center text-2xl"
                      style={{ background: "#F4F4F5" }}
                    >
                      ☕
                    </div>
                  )}
                  <div className="font-semibold text-sm leading-tight">{p.name}</div>
                  {p.price && (
                    <div className="font-mono text-xs mt-1" style={{ color: "#C2410C" }}>
                      {p.price}
                    </div>
                  )}
                  {p.description && (
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: "#57534E" }}>
                      {p.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {vendor.latitude != null && vendor.longitude != null && (
          <div className="mt-8">
            <MapView vendors={[vendor]} center={[vendor.latitude, vendor.longitude]} zoom={14} height={280} />
          </div>
        )}

        <section className="mt-12">
          <h2 className="font-display font-semibold text-xl">Avis</h2>

          <form onSubmit={submitReview} className="stitch bg-paperRaised p-4 mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <input
                value={reviewForm.authorName}
                onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                placeholder="Votre nom"
                className="flex-1 px-3 py-2 rounded-lg text-sm border border-line"
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
              className="px-3 py-2 rounded-lg text-sm border border-line resize-none"
            />
            {reviewError && <p className="text-xs" style={{ color: "#C2410C" }}>{reviewError}</p>}
            <button disabled={submitting} className="btn-primary font-mono text-xs px-4 py-2 rounded-full self-start">
              {submitting ? "Envoi..." : "Publier l'avis"}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-4">
            {vendor.reviews.map((r: any) => (
              <div key={r.id} className="pb-4" style={{ borderBottom: "1px solid #E7E5E4" }}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{r.authorName}</span>
                  <StarRating value={r.rating} />
                </div>
                {r.comment && <p className="text-sm mt-1" style={{ color: "#292524" }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
