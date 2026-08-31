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
      .catch(() => setVendor(null))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();

    if (!reviewForm.authorName.trim()) {
      setReviewError("Votre nom est requis.");
      return;
    }

    setSubmitting(true);
    setReviewError("");

    try {
      const res = await fetch(`/api/vendors/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewForm),
      });

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
    } catch {
      setReviewError("Impossible d'envoyer votre avis.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf7ef] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl">☕</div>
          <p className="mt-4 text-sm text-[#8a7355]">
            Chargement de la boutique...
          </p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#fbf7ef] flex items-center justify-center px-6">
        <div className="text-center bg-white rounded-3xl border border-[#eadbc5] p-10 max-w-md">
          <div className="text-5xl">☕</div>

          <h1 className="mt-4 font-serif text-3xl font-bold text-[#302016]">
            Fiche introuvable
          </h1>

          <p className="mt-3 text-[#756453]">
            Cette boutique n'est pas disponible ou n'existe plus.
          </p>

          <Link
            href="/"
            className="inline-block mt-6 rounded-full bg-[#b85c38] px-6 py-3 font-semibold text-white"
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

  const mainPhoto = photos[0]?.url;

  return (
    <div className="min-h-screen bg-[#fbf7ef] text-[#302016]">

      {/* TOP BAR */}
      <div className="hidden md:block bg-[#2b170d] text-[#f8efe0]">
        <div className="max-w-7xl mx-auto px-8 py-2 flex justify-between text-xs">
          <span>☕ Annuaire Café CI</span>
          <span>🇨🇮 Le café ivoirien, notre fierté</span>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[#eadbc5]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#f4e5ce] flex items-center justify-center text-2xl">
              ☕
            </div>

            <div className="leading-none">
              <div className="font-serif text-lg font-bold">
                Annuaire
              </div>

              <div className="font-serif text-lg font-bold text-[#b85c38]">
                Café CI
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-[#d9c5a7] px-5 py-2.5 text-sm font-semibold hover:bg-[#fbf7ef] transition"
          >
            ← Retour à l'annuaire
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-12">

        {/* BREADCRUMB */}
        <div className="mb-7 text-sm text-[#8a7355]">
          <Link href="/" className="hover:text-[#b85c38]">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <span>{vendor.name}</span>
        </div>

        {/* HERO */}
        <section className="grid lg:grid-cols-2 gap-8 items-stretch">

          {/* IMAGE */}
          <div className="relative min-h-[330px] md:min-h-[500px] overflow-hidden rounded-[32px] bg-[#f3eadc] shadow-lg">

            {mainPhoto ? (
              <img
                src={mainPhoto}
                alt={vendor.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl">☕</div>
                  <p className="mt-3 text-[#8a7355]">
                    Café ivoirien
                  </p>
                </div>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute left-5 bottom-5 right-5 flex justify-between items-end gap-4">

              <div className="rounded-full bg-[#315c45] text-white px-4 py-2 text-xs font-bold">
                ✓ Vendeur référencé
              </div>

              {vendor.priceInfo && (
                <div className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#9a4c2d]">
                  {vendor.priceInfo}
                </div>
              )}

            </div>
          </div>

          {/* INFORMATION */}
          <div className="bg-white rounded-[32px] border border-[#eadbc5] shadow-sm p-7 md:p-10 flex flex-col justify-center">

            <div className="inline-flex self-start rounded-full bg-[#edf1e8] px-4 py-2 text-xs font-bold text-[#315c45]">
              ☕ {catLabel(vendor.category)}
            </div>

            <h1 className="mt-5 font-serif text-4xl md:text-5xl font-bold leading-tight">
              {vendor.name}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-[#756453]">
              <span>📍</span>

              <span>
                {vendor.neighborhood
                  ? `${vendor.neighborhood}, `
                  : ""}
                {vendor.city}
              </span>
            </div>

            {reviews.length > 0 ? (
              <div className="mt-5 flex items-center gap-3">
                <StarRating value={avgRating} size={20} />

                <span className="font-semibold">
                  {avgRating.toFixed(1)}
                </span>

                <span className="text-sm text-[#8a7355]">
                  ({reviews.length} avis)
                </span>
              </div>
            ) : (
              <div className="mt-5 text-sm text-[#8a7355]">
                Pas encore d'avis
              </div>
            )}

            {vendor.description && (
              <p className="mt-6 text-base leading-7 text-[#6b5747]">
                {vendor.description}
              </p>
            )}

            {/* ACTIONS */}
            <div className="mt-8 grid sm:grid-cols-2 gap-3">

              <a
                href={`tel:${vendor.phone}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#d9c5a7] px-5 py-3.5 font-semibold hover:bg-[#fbf7ef] transition"
              >
                📞 Appeler
              </a>

              <a
                href={waLink(vendor.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#315c45] px-5 py-3.5 font-semibold text-white hover:bg-[#254b37] transition"
              >
                💬 WhatsApp
              </a>

            </div>

          </div>
        </section>

        {/* QUICK INFO */}
        <section className="mt-8 grid sm:grid-cols-3 gap-4">

          <div className="rounded-2xl bg-white border border-[#eadbc5] p-5">
            <div className="text-2xl">☕</div>
            <div className="mt-2 font-semibold">
              Catégorie
            </div>
            <div className="mt-1 text-sm text-[#8a7355]">
              {catLabel(vendor.category)}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[#eadbc5] p-5">
            <div className="text-2xl">📍</div>
            <div className="mt-2 font-semibold">
              Localisation
            </div>
            <div className="mt-1 text-sm text-[#8a7355]">
              {vendor.city}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[#eadbc5] p-5">
            <div className="text-2xl">🛍️</div>
            <div className="mt-2 font-semibold">
              Produits
            </div>
            <div className="mt-1 text-sm text-[#8a7355]">
              {products.length} produit
              {products.length !== 1 ? "s" : ""}
            </div>
          </div>

        </section>

        {/* PHOTOS */}
        {photos.length > 1 && (
          <section className="mt-14">

            <div className="mb-6">
              <div className="text-[#b85c38] text-sm font-bold uppercase tracking-wider">
                Galerie
              </div>

              <h2 className="mt-2 font-serif text-3xl md:text-4xl font-bold">
                Découvrez la boutique
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

              {photos.map((photo: any) => (
                <div
                  key={photo.id}
                  className="overflow-hidden rounded-2xl bg-white border border-[#eadbc5]"
                >
                  <img
                    src={photo.url}
                    alt={vendor.name}
                    className="w-full h-48 md:h-64 object-cover hover:scale-105 transition duration-500"
                  />
                </div>
              ))}

            </div>
          </section>
        )}

        {/* PRODUCTS */}
        {products.length > 0 && (
          <section className="mt-14">

            <div className="mb-6">
              <div className="text-[#b85c38] text-sm font-bold uppercase tracking-wider">
                Notre sélection
              </div>

              <h2 className="mt-2 font-serif text-3xl md:text-4xl font-bold">
                Produits disponibles
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl bg-white border border-[#eadbc5] shadow-sm hover:shadow-lg transition"
                >

                  {product.photoUrl ? (
                    <img
                      src={product.photoUrl}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-[#f4eadc] text-5xl">
                      ☕
                    </div>
                  )}

                  <div className="p-4">

                    <h3 className="font-semibold leading-tight">
                      {product.name}
                    </h3>

                    {product.price && (
                      <div className="mt-2 font-bold text-[#b85c38]">
                        {product.price}
                      </div>
                    )}

                    {product.description && (
                      <p className="mt-2 text-xs leading-5 text-[#756453] line-clamp-3">
                        {product.description}
                      </p>
                    )}

                  </div>
                </div>
              ))}

            </div>
          </section>
        )}

        {/* MAP */}
        {vendor.latitude != null && vendor.longitude != null && (
          <section className="mt-14">

            <div className="mb-6">
              <div className="text-[#b85c38] text-sm font-bold uppercase tracking-wider">
                Nous trouver
              </div>

              <h2 className="mt-2 font-serif text-3xl md:text-4xl font-bold">
                Localisation
              </h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-[#eadbc5] shadow-lg">
              <MapView
                vendors={[vendor]}
                center={[vendor.latitude, vendor.longitude]}
                zoom={14}
                height={360}
              />
            </div>

          </section>
        )}

        {/* REVIEWS */}
        <section className="mt-14">

          <div className="mb-6">
            <div className="text-[#b85c38] text-sm font-bold uppercase tracking-wider">
              Avis clients
            </div>

            <h2 className="mt-2 font-serif text-3xl md:text-4xl font-bold">
              Votre expérience compte
            </h2>
          </div>

          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-7">

            {/* FORM */}
            <div className="rounded-3xl bg-white border border-[#eadbc5] p-6 md:p-8">

              <h3 className="font-serif text-2xl font-bold">
                Laisser un avis
              </h3>

              <p className="mt-2 text-sm text-[#8a7355]">
                Partagez votre expérience avec les autres visiteurs.
              </p>

              <form
                onSubmit={submitReview}
                className="mt-6 flex flex-col gap-4"
              >

                <input
                  value={reviewForm.authorName}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      authorName: e.target.value,
                    })
                  }
                  placeholder="Votre nom"
                  className="w-full rounded-xl border border-[#dfcdb2] bg-[#fffdf9] px-4 py-3 outline-none focus:border-[#b85c38]"
                />

                <div className="rounded-xl bg-[#fbf7ef] p-4">
                  <div className="text-xs font-semibold text-[#8a7355] mb-2">
                    Votre note
                  </div>

                  <StarRating
                    value={reviewForm.rating}
                    interactive
                    size={24}
                    onChange={(value) =>
                      setReviewForm({
                        ...reviewForm,
                        rating: value,
                      })
                    }
                  />
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
                  rows={5}
                  className="w-full resize-none rounded-xl border border-[#dfcdb2] bg-[#fffdf9] px-4 py-3 outline-none focus:border-[#b85c38]"
                />

                {reviewError && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {reviewError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#b85c38] px-5 py-3.5 font-semibold text-white transition hover:bg-[#984725] disabled:opacity-50"
                >
                  {submitting ? "Envoi en cours..." : "Publier mon avis"}
                </button>

              </form>
            </div>

            {/* EXISTING REVIEWS */}
            <div className="rounded-3xl bg-white border border-[#eadbc5] p-6 md:p-8">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <h3 className="font-serif text-2xl font-bold">
                    Avis des clients
                  </h3>

                  <p className="mt-1 text-sm text-[#8a7355]">
                    {reviews.length} avis
                  </p>
                </div>

                {reviews.length > 0 && (
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {avgRating.toFixed(1)}
                    </div>

                    <StarRating value={avgRating} size={18} />
                  </div>
                )}

              </div>

              <div className="mt-6 space-y-5">

                {reviews.length === 0 ? (
                  <div className="rounded-2xl bg-[#fbf7ef] p-8 text-center">
                    <div className="text-4xl">☕</div>

                    <p className="mt-3 font-semibold">
                      Aucun avis pour le moment
                    </p>

                    <p className="mt-1 text-sm text-[#8a7355]">
                      Soyez le premier à partager votre expérience.
                    </p>
                  </div>
                ) : (
                  reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="border-b border-[#eee3d2] pb-5 last:border-0"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <div className="font-semibold">
                            {review.authorName}
                          </div>

                          <div className="mt-1">
                            <StarRating value={review.rating} />
                          </div>
                        </div>

                      </div>

                      {review.comment && (
                        <p className="mt-3 text-sm leading-6 text-[#6b5747]">
                          {review.comment}
                        </p>
                      )}

                    </div>
                  ))
                )}

              </div>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 rounded-3xl bg-[#2b170d] p-8 md:p-12 text-white">

          <div className="flex flex-col md:flex-row items-center justify-between gap-7">

            <div>
              <div className="text-[#e6a27f] text-sm font-bold">
                ANNuaire CAFÉ CI
              </div>

              <h2 className="mt-2 font-serif text-3xl font-bold">
                Découvrez d'autres professionnels du café
              </h2>

              <p className="mt-3 text-[#d8c6b5]">
                Trouvez d'autres vendeurs et commerces près de chez vous.
              </p>
            </div>

            <Link
              href="/"
              className="shrink-0 rounded-full bg-[#b85c38] px-7 py-3.5 font-semibold hover:bg-[#d06d45] transition"
            >
              Retour à l'annuaire →
            </Link>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-16 bg-[#211109] px-5 md:px-8 py-10 text-[#d8c6b5]">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">

          <div>
            <div className="font-serif text-2xl font-bold text-white">
              ☕ Annuaire Café CI
            </div>

            <p className="mt-2 text-sm">
              La plateforme des professionnels du café en Côte d'Ivoire.
            </p>
          </div>

          <Link
            href="/"
            className="text-sm hover:text-white"
          >
            ← Retour à l'accueil
          </Link>

        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 mt-8 pt-6 text-center text-xs">
          Le café ivoirien, notre fierté. 🇨🇮☕
        </div>

      </footer>

    </div>
  );
}
