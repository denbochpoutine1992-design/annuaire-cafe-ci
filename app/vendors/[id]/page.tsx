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
  const digits = phone.replace(/[^\d]/g, "");
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
    setLoading(true);

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
        style={{ background: "#FAFAFA" }}
      >
        <div className="text-center">
          <div className="text-4xl mb-3">☕</div>
          <p className="text-sm" style={{ color: "#71717A" }}>
            Chargement du commerce...
          </p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FAFAFA" }}
      >
        <div className="text-center px-6">
          <div className="text-5xl mb-4">☕</div>

          <h1
            className="text-xl font-bold mb-2"
            style={{ color: "#18181B" }}
          >
            Fiche introuvable
          </h1>

          <p className="text-sm mb-5" style={{ color: "#71717A" }}>
            Ce commerce n'existe plus ou n'est pas disponible.
          </p>

          <Link
            href="/"
            className="inline-flex px-5 py-3 rounded-full text-sm font-semibold text-white"
            style={{ background: "#18181B" }}
          >
            ← Retour à l'annuaire
          </Link>
        </div>
      </div>
    );
  }

  const reviews = vendor.reviews || [];
  const photos = vendor.photos || [];
  const products = vendor.products || [];

  const avgRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum: number, review: any) => sum + review.rating,
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
        background: "#F7F7F5",
        color: "#18181B",
      }}
    >
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

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-5 md:px-8 pb-16">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 -mt-8 relative z-10">
          {/* COLONNE PRINCIPALE */}
          <div className="space-y-6">
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
                    📍{" "}
                    {vendor.neighborhood
                      ? `${vendor.neighborhood}, `
                      : ""}
                    {vendor.city}
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

            {/* PRODUITS */}
            {products.length > 0 && (
              <section
                className="bg-white rounded-3xl p-6 md:p-8"
                style={{
                  border: "1px solid #E4E4E7",
                }}
              >
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: accent }}
                    >
                      Découvrez
                    </p>

                    <h2 className="text-2xl font-black mt-1">
                      Catalogue
                    </h2>
                  </div>

                  <span
                    className="text-sm font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      background: "#F4F4F5",
                      color: "#52525B",
                    }}
                  >
                    {products.length} produit
                    {products.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {products.map((p: any) => (
                    <div
                      key={p.id}
                      className="overflow-hidden rounded-2xl group"
                      style={{
                        border: "1px solid #E4E4E7",
                        background: "#fff",
                      }}
                    >
                      <div
                        className="h-44 overflow-hidden flex items-center justify-center"
                        style={{
                          background: "#F4F4F5",
                        }}
                      >
                        {p.photoUrl ? (
                          <img
                            src={p.photoUrl}
                            alt={p.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <span className="text-5xl">☕</span>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3
                            className="font-bold text-base"
                            style={{ color: "#18181B" }}
                          >
                            {p.name}
                          </h3>

                          {p.price && (
                            <span
                              className="text-sm font-black whitespace-nowrap"
                              style={{ color: accent }}
                            >
                              {p.price}
                            </span>
                          )}
                        </div>

                        {p.description && (
                          <p
                            className="text-sm mt-2 leading-5"
                            style={{ color: "#71717A" }}
                          >
                            {p.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

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
                      <img
                        src={p.url}
                        alt={`${vendor.name} - photo ${index + 2}`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* LOCALISATION */}
            {vendor.latitude != null &&
              vendor.longitude != null && (
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
                      Où nous trouver
                    </p>

                    <h2 className="text-2xl font-black mt-1">
                      Localisation
                    </h2>

                    <p
                      className="text-sm mt-2"
                      style={{ color: "#71717A" }}
                    >
                      📍{" "}
                      {vendor.neighborhood
                        ? `${vendor.neighborhood}, `
                        : ""}
                      {vendor.city}
                    </p>
                  </div>

                  <div
                    className="overflow-hidden rounded-2xl"
                    style={{
                      border: "1px solid #E4E4E7",
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

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${vendor.latitude},${vendor.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold"
                    style={{
                      background: "#F4F4F5",
                      color: "#18181B",
                    }}
                  >
                    🗺️ Ouvrir dans Google Maps
                  </a>
                </section>
              )}

            {/* AVIS */}
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
                  Expériences clients
                </p>

                <div className="flex flex-wrap items-end justify-between gap-4">
                  <h2 className="text-2xl font-black mt-1">
                    Avis clients
                  </h2>

                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                      <StarRating
                        value={avgRating}
                        size={18}
                      />

                      <span className="font-bold">
                        {avgRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* FORMULAIRE */}
              <form
                onSubmit={submitReview}
                className="rounded-2xl p-5 mb-6"
                style={{
                  background: "#FAFAFA",
                  border: "1px solid #E4E4E7",
                }}
              >
                <h3 className="font-bold mb-4">
                  Partagez votre expérience
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    value={reviewForm.authorName}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        authorName: e.target.value,
                      })
                    }
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      border: "1px solid #D4D4D8",
                      background: "#fff",
                    }}
                  />

                  <div
                    className="flex items-center justify-center rounded-xl px-4"
                    style={{
                      background: "#fff",
                      border: "1px solid #D4D4D8",
                    }}
                  >
                    <StarRating
                      value={reviewForm.rating}
                      interactive
                      size={22}
                      onChange={(value) =>
                        setReviewForm({
                          ...reviewForm,
                          rating: value,
                        })
                      }
                    />
                  </div>
                </div>

                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      comment: e.target.value,
                    })
                  }
                  placeholder="Votre avis (optionnel)"
                  rows={4}
                  className="w-full mt-4 px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{
                    border: "1px solid #D4D4D8",
                    background: "#fff",
                  }}
                />

                {reviewError && (
                  <p
                    className="text-sm mt-3"
                    style={{ color: "#DC2626" }}
                  >
                    {reviewError}
                  </p>
                )}

                <button
                  disabled={submitting}
                  className="mt-4 px-5 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                  style={{
                    background: accent,
                  }}
                >
                  {submitting
                    ? "Publication..."
                    : "⭐ Publier mon avis"}
                </button>
              </form>

              {/* LISTE DES AVIS */}
              <div className="space-y-4">
                {reviews.length === 0 && (
                  <div
                    className="text-center py-8 rounded-2xl"
                    style={{
                      background: "#FAFAFA",
                    }}
                  >
                    <div className="text-3xl mb-2">💬</div>

                    <p
                      className="text-sm"
                      style={{ color: "#71717A" }}
                    >
                      Aucun avis pour l'instant.
                    </p>

                    <p
                      className="text-sm mt-1"
                      style={{ color: "#A1A1AA" }}
                    >
                      Soyez le premier à partager votre
                      expérience.
                    </p>
                  </div>
                )}

                {reviews.map((r: any) => (
                  <div
                    key={r.id}
                    className="rounded-2xl p-5"
                    style={{
                      background: "#FAFAFA",
                      border: "1px solid #E4E4E7",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                          style={{
                            background: accent,
                          }}
                        >
                          {r.authorName
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </div>

                        <div>
                          <div
                            className="font-bold text-sm"
                            style={{ color: "#18181B" }}
                          >
                            {r.authorName}
                          </div>

                          <div
                            className="text-xs mt-1"
                            style={{ color: "#A1A1AA" }}
                          >
                            Avis client
                          </div>
                        </div>
                      </div>

                      <StarRating value={r.rating} />
                    </div>

                    {r.comment && (
                      <p
                        className="text-sm leading-6 mt-4"
                        style={{ color: "#52525B" }}
                      >
                        “{r.comment}”
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

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
                  Contacter
                </p>

                <h2 className="text-xl font-black mt-1">
                  {vendor.name}
                </h2>

                <p
                  className="text-sm mt-1"
                  style={{ color: "#71717A" }}
                >
                  📍 {vendor.city}
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${vendor.phone}`}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold"
                  style={{
                    background: "#18181B",
                    color: "#fff",
                  }}
                >
                  📞 Appeler le commerce
                </a>

                <a
                  href={waLink(vendor.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold"
                  style={{
                    background: "#DCFCE7",
                    color: "#166534",
                  }}
                >
                  💬 Contacter sur WhatsApp
                </a>
              </div>

              <div
                className="mt-5 pt-5 border-t space-y-4"
                style={{ borderColor: "#F4F4F5" }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Localisation
                    </div>

                    <div className="text-sm font-semibold mt-1">
                      {vendor.neighborhood
                        ? `${vendor.neighborhood}, `
                        : ""}
                      {vendor.city}
                    </div>
                  </div>
                </div>

                {vendor.phone && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📱</span>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                        Téléphone
                      </div>

                      <div className="text-sm font-semibold mt-1">
                        {vendor.phone}
                      </div>
                    </div>
                  </div>
                )}

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
        </div>
      </main>

      {/* CTA FINAL */}
      <section
        className="py-14 px-5"
        style={{
          background: "#18181B",
        }}
      >
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="text-4xl mb-4">☕</div>

          <h2 className="text-2xl md:text-3xl font-black">
            Découvrez d'autres commerces de café
          </h2>

          <p className="mt-3 text-sm md:text-base text-zinc-400">
            Explorez les cafés, torréfacteurs, détaillants,
            grossistes et commerces en ligne de Côte d'Ivoire.
          </p>

          <Link
            href="/"
            className="inline-flex mt-6 px-6 py-3.5 rounded-full text-sm font-bold"
            style={{
              background: "#fff",
              color: "#18181B",
            }}
          >
            Explorer l'annuaire →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-8 px-5 text-center"
        style={{
          background: "#111113",
          color: "#71717A",
        }}
      >
        <p className="text-sm">
          © {new Date().getFullYear()} Annuaire Café CI
        </p>

        <p className="text-xs mt-2">
          L'annuaire des professionnels du café en Côte
          d'Ivoire.
        </p>
      </footer>
    </div>
  );
}
