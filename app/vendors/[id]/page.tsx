"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

import StarRating from "@/components/StarRating";
import { catLabel } from "@/lib/constants";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
});

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
  const digits = String(phone || "").replace(/[^\d]/g, "");
  const withCountry = digits.startsWith("225")
    ? digits
    : `225${digits.replace(/^0+/, "")}`;

  return `https://wa.me/${withCountry}`;
}

export default function VendorDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [reviewForm, setReviewForm] = useState({
    authorName: "",
    rating: 5,
    comment: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  function load() {
    fetch(`/api/vendors/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setVendor)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [id]);

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewForm),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setReviewError(data.error || "Une erreur est survenue.");
      return;
    }

    setReviewForm({
      authorName: "",
      rating: 5,
      comment: "",
    });

    load();
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#F7F4EF" }}
      >
        <div className="text-center">
          <div className="text-4xl mb-3">☕</div>
          <p
            className="text-sm font-mono"
            style={{ color: "#78716C" }}
          >
            Chargement de la fiche...
          </p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "#F7F4EF" }}
      >
        <div
          className="bg-white rounded-3xl p-8 text-center max-w-md w-full"
          style={{ border: "1px solid #E7E5E4" }}
        >
          <div className="text-5xl">☕</div>

          <h1
            className="font-display font-semibold text-2xl mt-4"
            style={{ color: "#18181B" }}
          >
            Fiche introuvable
          </h1>

          <p
            className="text-sm mt-2"
            style={{ color: "#78716C" }}
          >
            Cette fiche commerciale n'existe plus ou n'est pas disponible.
          </p>

          <Link
            href="/"
            className="btn-primary inline-block mt-6 px-5 py-3 rounded-full text-sm font-medium"
          >
            Retour à l'annuaire
          </Link>
        </div>
      </div>
    );
  }

  const reviews = Array.isArray(vendor.reviews)
    ? vendor.reviews
    : [];

  const photos = Array.isArray(vendor.photos)
    ? vendor.photos
    : [];

  const products = Array.isArray(vendor.products)
    ? vendor.products
    : [];

  const avgRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum: number, review: any) => sum + Number(review.rating || 0),
          0
        ) / reviews.length
      : 0;

  const accent = catColor(vendor.category);
  const cover = photos?.[0]?.url;

  const isFeatured =
    vendor.featured &&
    vendor.featuredUntil &&
    new Date(vendor.featuredUntil) > new Date();

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#F7F4EF",
        color: "#18181B",
      }}
    >
      {/* ================= NAVIGATION ================= */}

      <nav
        className="sticky top-0 z-40 px-5 md:px-10 py-4"
        style={{
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E7E5E4",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-display font-semibold text-base md:text-lg"
          >
            ☕ Annuaire Café CI
          </Link>

          <Link
            href="/"
            className="text-xs md:text-sm font-medium px-4 py-2 rounded-full"
            style={{
              background: "#F5F5F4",
              color: "#44403C",
            }}
          >
            ← Annuaire
          </Link>
        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section className="relative">
        <div
          className="w-full overflow-hidden"
          style={{
            height: cover
              ? "clamp(260px, 42vw, 480px)"
              : "260px",
            background: accent,
          }}
        >
          {cover ? (
            <>
              <img
                src={cover}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.35))",
                }}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="text-8xl opacity-80"
                aria-hidden="true"
              >
                ☕
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= CONTENU ================= */}

      <main className="px-4 md:px-8 pb-16">
        <div className="max-w-5xl mx-auto">

          {/* ================= IDENTITÉ ================= */}

          <section
            className="relative -mt-16 md:-mt-20 rounded-3xl p-5 md:p-8"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E7E5E4",
              boxShadow:
                "0 24px 60px -30px rgba(24,24,27,0.35)",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-5">

              {/* LOGO */}

              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-bold text-white shrink-0"
                style={{
                  background: accent,
                  boxShadow:
                    "0 12px 24px -12px rgba(0,0,0,0.35)",
                }}
              >
                {vendor.name?.charAt(0)?.toUpperCase() || "?"}
              </div>

              {/* INFORMATIONS */}

              <div className="flex-1 min-w-0">

                <div className="flex flex-wrap gap-2">

                  <span
                    className="text-[10px] md:text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"
                    style={{
                      color: accent,
                      background: `${accent}14`,
                    }}
                  >
                    {catLabel(vendor.category)}
                  </span>

                  {isFeatured && (
                    <span
                      className="text-[10px] md:text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"
                      style={{
                        color: "#92400E",
                        background: "#FEF3C7",
                      }}
                    >
                      ⭐ En vedette
                    </span>
                  )}

                </div>

                <h1
                  className="font-display font-bold text-3xl md:text-4xl mt-3 leading-tight"
                  style={{ color: "#18181B" }}
                >
                  {vendor.name}
                </h1>

                <p
                  className="text-sm md:text-base mt-2"
                  style={{ color: "#78716C" }}
                >
                  📍{" "}
                  {vendor.neighborhood
                    ? `${vendor.neighborhood}, `
                    : ""}
                  {vendor.city}
                </p>

                {/* NOTE */}

                <div className="mt-4 flex items-center gap-3 flex-wrap">

                  {reviews.length > 0 ? (
                    <>
                      <div className="flex items-center gap-2">
                        <StarRating
                          value={avgRating}
                          size={20}
                        />

                        <strong
                          className="text-base"
                          style={{ color: "#18181B" }}
                        >
                          {avgRating.toFixed(1)}
                        </strong>
                      </div>

                      <span
                        className="text-sm"
                        style={{ color: "#78716C" }}
                      >
                        {reviews.length}{" "}
                        {reviews.length > 1
                          ? "avis"
                          : "avis"}
                      </span>
                    </>
                  ) : (
                    <span
                      className="text-sm"
                      style={{ color: "#78716C" }}
                    >
                      Aucun avis pour le moment
                    </span>
                  )}

                </div>

              </div>
            </div>

            {/* DESCRIPTION */}

            {vendor.description && (
              <div
                className="mt-6 pt-6"
                style={{
                  borderTop: "1px solid #E7E5E4",
                }}
              >
                <p
                  className="text-sm md:text-base leading-7"
                  style={{ color: "#44403C" }}
                >
                  {vendor.description}
                </p>
              </div>
            )}

            {/* ACTIONS */}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">

              <a
                href={`tel:${vendor.phone}`}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{
                  border: "1px solid #D6D3D1",
                  color: "#18181B",
                  background: "#FFFFFF",
                }}
              >
                📞 Appeler
              </a>

              <a
                href={waLink(vendor.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{
                  background: "#18181B",
                  color: "#FFFFFF",
                }}
              >
                💬 WhatsApp
              </a>

              {vendor.latitude != null &&
                vendor.longitude != null && (
                  <a
                    href={`https://www.google.com/maps?q=${vendor.latitude},${vendor.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-transform hover:-translate-y-0.5"
                    style={{
                      background: accent,
                      color: "#FFFFFF",
                    }}
                  >
                    🗺️ Itinéraire
                  </a>
                )}

            </div>

            {vendor.priceInfo && (
              <div
                className="mt-4 rounded-2xl px-4 py-3 text-center text-sm font-medium"
                style={{
                  background: "#FAFAF9",
                  color: "#57534E",
                  border: "1px solid #E7E5E4",
                }}
              >
                💰 {vendor.priceInfo}
              </div>
            )}

          </section>

          {/* ================= PRODUITS ================= */}

          {products.length > 0 && (
            <section className="mt-10">

              <div className="flex items-end justify-between mb-5">

                <div>
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: accent }}
                  >
                    Catalogue
                  </p>

                  <h2
                    className="font-display font-bold text-2xl md:text-3xl mt-1"
                    style={{ color: "#18181B" }}
                  >
                    Nos produits
                  </h2>
                </div>

                <span
                  className="text-xs font-mono"
                  style={{ color: "#78716C" }}
                >
                  {products.length} produit
                  {products.length !== 1 ? "s" : ""}
                </span>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                {products.map((p: any) => (
                  <article
                    key={p.id}
                    className="overflow-hidden rounded-2xl transition-transform hover:-translate-y-1"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E7E5E4",
                      boxShadow:
                        "0 10px 30px -24px rgba(24,24,27,0.45)",
                    }}
                  >

                    <div
                      className="relative w-full"
                      style={{
                        aspectRatio: "1 / 1",
                        background: "#F5F5F4",
                      }}
                    >
                      {p.photoUrl ? (
                        <img
                          src={p.photoUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          ☕
                        </div>
                      )}
                    </div>

                    <div className="p-4">

                      <h3
                        className="font-semibold text-sm md:text-base leading-snug"
                        style={{ color: "#18181B" }}
                      >
                        {p.name}
                      </h3>

                      {p.price && (
                        <p
                          className="font-bold text-sm mt-2"
                          style={{ color: accent }}
                        >
                          {p.price}
                        </p>
                      )}

                      {p.description && (
                        <p
                          className="text-xs md:text-sm mt-2 leading-relaxed line-clamp-3"
                          style={{ color: "#78716C" }}
                        >
                          {p.description}
                        </p>
                      )}

                    </div>
                  </article>
                ))}

              </div>
            </section>
          )}

          {/* ================= GALERIE ================= */}

          {photos.length > 1 && (
            <section className="mt-12">

              <div className="mb-5">
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: accent }}
                >
                  Galerie
                </p>

                <h2
                  className="font-display font-bold text-2xl md:text-3xl mt-1"
                  style={{ color: "#18181B" }}
                >
                  Découvrez le commerce
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                {photos.slice(1).map((p: any, index: number) => (
                  <div
                    key={p.id || index}
                    className="overflow-hidden rounded-2xl"
                    style={{
                      background: "#E7E5E4",
                      aspectRatio:
                        index === 0
                          ? "16 / 10"
                          : "1 / 1",
                    }}
                  >
                    <img
                      src={p.url}
                      alt={`${vendor.name} - photo ${index + 2}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}

              </div>
            </section>
          )}

          {/* ================= LOCALISATION ================= */}

          {vendor.latitude != null &&
            vendor.longitude != null && (
              <section className="mt-12">

                <div className="mb-5">
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: accent }}
                  >
                    Localisation
                  </p>

                  <h2
                    className="font-display font-bold text-2xl md:text-3xl mt-1"
                    style={{ color: "#18181B" }}
                  >
                    Où nous trouver
                  </h2>

                  <p
                    className="text-sm mt-2"
                    style={{ color: "#78716C" }}
                  >
                    📍{" "}
                    {vendor.neighborhood
                      ? `${vendor.neighborhood}, `
                      : ""}
                    {vendor.city}
                  </p>
                </div>

                <div
                  className="overflow-hidden rounded-3xl"
                  style={{
                    border: "1px solid #E7E5E4",
                    boxShadow:
                      "0 20px 40px -30px rgba(24,24,27,0.4)",
                  }}
                >
                  <MapView
                    vendors={[vendor]}
                    center={[
                      vendor.latitude,
                      vendor.longitude,
                    ]}
                    zoom={14}
                    height={320}
                  />
                </div>

              </section>
            )}

          {/* ================= AVIS ================= */}

          <section className="mt-12">

            <div className="mb-5">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: accent }}
              >
                Avis clients
              </p>

              <h2
                className="font-display font-bold text-2xl md:text-3xl mt-1"
                style={{ color: "#18181B" }}
              >
                Votre expérience compte
              </h2>
            </div>

            {/* FORMULAIRE */}

            <form
              onSubmit={submitReview}
              className="rounded-3xl p-5 md:p-6"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E7E5E4",
                boxShadow:
                  "0 16px 40px -30px rgba(24,24,27,0.35)",
              }}
            >

              <h3
                className="font-semibold text-base"
                style={{ color: "#18181B" }}
              >
                ⭐ Laisser un avis
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mt-4">

                <div>
                  <label
                    className="block text-xs font-medium mb-2"
                    style={{ color: "#57534E" }}
                  >
                    Votre nom
                  </label>

                  <input
                    value={reviewForm.authorName}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        authorName: e.target.value,
                      })
                    }
                    placeholder="Ex. Mamadou"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      border: "1px solid #D6D3D1",
                      background: "#FAFAF9",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-medium mb-2"
                    style={{ color: "#57534E" }}
                  >
                    Votre note
                  </label>

                  <div
                    className="h-[46px] px-4 rounded-xl flex items-center"
                    style={{
                      border: "1px solid #D6D3D1",
                      background: "#FAFAF9",
                    }}
                  >
                    <StarRating
                      value={reviewForm.rating}
                      interactive
                      size={22}
                      onChange={(v) =>
                        setReviewForm({
                          ...reviewForm,
                          rating: v,
                        })
                      }
                    />
                  </div>
                </div>

              </div>

              <div className="mt-4">

                <label
                  className="block text-xs font-medium mb-2"
                  style={{ color: "#57534E" }}
                >
                  Votre commentaire
                </label>

                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      comment: e.target.value,
                    })
                  }
                  placeholder="Partagez votre expérience..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none"
                  style={{
                    border: "1px solid #D6D3D1",
                    background: "#FAFAF9",
                  }}
                />

              </div>

              {reviewError && (
                <p
                  className="text-xs mt-3"
                  style={{ color: "#DC2626" }}
                >
                  {reviewError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 px-6 py-3 rounded-full text-sm font-semibold"
                style={{
                  background: submitting
                    ? "#A8A29E"
                    : "#18181B",
                  color: "#FFFFFF",
                  cursor: submitting
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {submitting
                  ? "Publication..."
                  : "Publier mon avis"}
              </button>

            </form>

            {/* LISTE DES AVIS */}

            <div className="mt-5 flex flex-col gap-3">

              {reviews.length === 0 ? (
                <div
                  className="rounded-3xl p-8 text-center"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E7E5E4",
                  }}
                >
                  <div className="text-4xl">⭐</div>

                  <p
                    className="font-semibold mt-3"
                    style={{ color: "#18181B" }}
                  >
                    Soyez le premier à laisser un avis
                  </p>

                  <p
                    className="text-sm mt-1"
                    style={{ color: "#78716C" }}
                  >
                    Votre expérience peut aider les prochains clients.
                  </p>
                </div>
              ) : (
                reviews.map((review: any) => (
                  <article
                    key={review.id}
                    className="rounded-2xl p-5"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E7E5E4",
                    }}
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <p
                          className="font-semibold text-sm"
                          style={{ color: "#18181B" }}
                        >
                          {review.authorName}
                        </p>

                        <div className="mt-1">
                          <StarRating
                            value={review.rating}
                            size={17}
                          />
                        </div>
                      </div>

                    </div>

                    {review.comment && (
                      <p
                        className="text-sm mt-4 leading-relaxed"
                        style={{ color: "#44403C" }}
                      >
                        “{review.comment}”
                      </p>
                    )}

                  </article>
                ))
              )}

            </div>

          </section>

        </div>
      </main>

      {/* ================= FOOTER ================= */}

      <footer
        className="px-6 py-8 text-center"
        style={{
          background: "#18181B",
          color: "#FFFFFF",
        }}
      >
        <div className="font-display font-semibold">
          ☕ Annuaire Café CI
        </div>

        <p
          className="text-xs mt-2"
          style={{ color: "#A8A29E" }}
        >
          Découvrez les acteurs du café en Côte d'Ivoire.
        </p>
      </footer>
    </div>
  );
}
