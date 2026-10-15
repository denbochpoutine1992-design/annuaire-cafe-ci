
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import ReviewsSection from "@/components/vendor/ReviewsSection";
import {
  VendorGallery,
  VendorHero,
  VendorIdentity,
  VendorSidebar,
} from "@/components/vendor/VendorParts";
import ProductCarousel from "@/components/ProductCarousel";

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

export default function VendorDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <VendorHero vendor={vendor} accent={accent} cover={cover} isFeatured={isFeatured} />

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-5 md:px-8 pb-16">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 -mt-8 relative z-10">
          {/* COLONNE PRINCIPALE */}
          <div className="space-y-6">
            <VendorIdentity vendor={vendor} reviews={reviews} avgRating={avgRating} accent={accent} />

            {/* PRODUITS */}
            {products.length > 0 && (
              <section
                className="bg-white rounded-3xl p-6 md:p-8"
                style={{ border: "1px solid #E4E4E7" }}
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

                <ProductCarousel
                  products={products}
                  vendor={{ id: vendor.id, name: vendor.name }}
                  accent={accent}
                />
              </section>
            )}
            <VendorGallery vendor={vendor} photos={photos} accent={accent} cover={cover} />

            <ReviewsSection
              vendorId={id}
              reviews={reviews}
              avgRating={avgRating}
              accent={accent}
              onSubmitted={load}
            />
          </div>

          <VendorSidebar vendor={vendor} reviews={reviews} avgRating={avgRating} accent={accent} />
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
