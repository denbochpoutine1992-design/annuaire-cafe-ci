"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { catLabel } from "@/lib/constants";

export default function DashboardPage() {
  const router = useRouter();

  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendors?mine=1")
      .then((r) => r.json())
      .then((data) => setVendors(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const totalPhotos = vendors.reduce(
    (total, vendor) => total + (vendor.photos?.length || 0),
    0
  );

  const totalProducts = vendors.reduce(
    (total, vendor) => total + (vendor.products?.length || 0),
    0
  );

  const totalReviews = vendors.reduce(
    (total, vendor) => total + (vendor.reviews?.length || 0),
    0
  );

  return (
    <div className="min-h-screen" style={{ background: "#F7F4EF" }}>
      {/* NAVIGATION */}
      <nav
        className="px-6 md:px-12 py-4 flex items-center justify-between"
        style={{
          background: "#18181B",
          color: "#FFFFFF",
        }}
      >
        <Link
          href="/"
          className="font-display font-semibold text-lg"
          style={{ color: "#FFFFFF" }}
        >
          ☕ Annuaire Café CI
        </Link>

        <button
          onClick={logout}
          className="font-mono text-xs uppercase tracking-wide"
          style={{ color: "#E7E5E4" }}
        >
          Déconnexion
        </button>
      </nav>

      <main className="px-6 md:px-12 py-8 md:py-12 max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p
              className="font-mono text-xs uppercase tracking-[0.18em]"
              style={{ color: "#C2410C" }}
            >
              Espace professionnel
            </p>

            <h1
              className="font-display font-semibold text-3xl md:text-4xl mt-2"
              style={{ color: "#18181B" }}
            >
              Mon tableau de bord
            </h1>

            <p
              className="text-sm mt-2"
              style={{ color: "#78716C" }}
            >
              Gérez vos commerces, vos produits et votre présence sur Annuaire Café CI.
            </p>
          </div>

          <Link
            href="/dashboard/new"
            className="btn-primary font-mono text-sm px-5 py-3 rounded-full text-center"
          >
            + Ajouter un commerce
          </Link>
        </div>

        {/* STATISTIQUES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8">

          <div
            className="p-5 rounded-2xl"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E7E5E4",
            }}
          >
            <div className="text-2xl">☕</div>
            <div
              className="font-display text-2xl font-semibold mt-3"
              style={{ color: "#18181B" }}
            >
              {vendors.length}
            </div>
            <div
              className="font-mono text-[10px] uppercase tracking-wide mt-1"
              style={{ color: "#78716C" }}
            >
              Commerce{vendors.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E7E5E4",
            }}
          >
            <div className="text-2xl">📸</div>
            <div
              className="font-display text-2xl font-semibold mt-3"
              style={{ color: "#18181B" }}
            >
              {totalPhotos}
            </div>
            <div
              className="font-mono text-[10px] uppercase tracking-wide mt-1"
              style={{ color: "#78716C" }}
            >
              Photos
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E7E5E4",
            }}
          >
            <div className="text-2xl">🛍️</div>
            <div
              className="font-display text-2xl font-semibold mt-3"
              style={{ color: "#18181B" }}
            >
              {totalProducts}
            </div>
            <div
              className="font-mono text-[10px] uppercase tracking-wide mt-1"
              style={{ color: "#78716C" }}
            >
              Produits
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E7E5E4",
            }}
          >
            <div className="text-2xl">⭐</div>
            <div
              className="font-display text-2xl font-semibold mt-3"
              style={{ color: "#18181B" }}
            >
              {totalReviews}
            </div>
            <div
              className="font-mono text-[10px] uppercase tracking-wide mt-1"
              style={{ color: "#78716C" }}
            >
              Avis
            </div>
          </div>

        </div>

        {/* MES COMMERCES */}
        <div className="mt-10">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="font-display font-semibold text-2xl"
                style={{ color: "#18181B" }}
              >
                Mes commerces
              </h2>

              <p
                className="text-sm mt-1"
                style={{ color: "#78716C" }}
              >
                Gérez vos fiches professionnelles.
              </p>
            </div>
          </div>

          {loading ? (

            <div
              className="p-10 rounded-2xl text-center"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E7E5E4",
              }}
            >
              <p
                className="font-mono text-sm"
                style={{ color: "#78716C" }}
              >
                Chargement...
              </p>
            </div>

          ) : vendors.length === 0 ? (

            <div
              className="p-10 md:p-16 text-center rounded-2xl"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E7E5E4",
              }}
            >
              <div className="text-5xl">☕</div>

              <h3
                className="font-display font-semibold text-xl mt-4"
                style={{ color: "#18181B" }}
              >
                Votre espace est prêt
              </h3>

              <p
                className="text-sm mt-2 max-w-md mx-auto"
                style={{ color: "#78716C" }}
              >
                Créez votre première fiche pour présenter votre commerce
                aux clients d'Annuaire Café CI.
              </p>

              <Link
                href="/dashboard/new"
                className="btn-primary inline-block font-mono text-sm px-5 py-3 rounded-full mt-5"
              >
                Créer ma première fiche
              </Link>
            </div>

          ) : (

            <div className="grid gap-4">

              {vendors.map((v) => {
                const cover = v.photos?.[0]?.url;

                return (
                  <Link
                    key={v.id}
                    href={`/dashboard/${v.id}`}
                    className="group rounded-2xl overflow-hidden transition-transform hover:-translate-y-0.5"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E7E5E4",
                    }}
                  >
                    <div className="flex flex-col sm:flex-row">

                      {/* PHOTO */}
                      <div
                        className="sm:w-44 h-36 sm:h-auto shrink-0"
                        style={{ background: "#E7E5E4" }}
                      >
                        {cover ? (
                          <img
                            src={cover}
                            alt={v.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            ☕
                          </div>
                        )}
                      </div>

                      {/* INFORMATIONS */}
                      <div className="p-5 flex-1">

                        <div className="flex items-start justify-between gap-4">

                          <div>
                            <div
                              className="font-display font-semibold text-xl"
                              style={{ color: "#18181B" }}
                            >
                              {v.name}
                            </div>

                            <div
                              className="font-mono text-xs mt-1"
                              style={{ color: "#C2410C" }}
                            >
                              {catLabel(v.category)}
                            </div>
                          </div>

                          <span
                            className="hidden sm:block font-mono text-xs"
                            style={{ color: "#C2410C" }}
                          >
                            Gérer →
                          </span>

                        </div>

                        <div
                          className="text-sm mt-3"
                          style={{ color: "#57534E" }}
                        >
                          📍 {v.neighborhood ? `${v.neighborhood}, ` : ""}
                          {v.city}
                        </div>

                        <div
                          className="flex flex-wrap gap-4 mt-4 pt-3"
                          style={{
                            borderTop: "1px solid #E7E5E4",
                          }}
                        >
                          <span
                            className="font-mono text-xs"
                            style={{ color: "#78716C" }}
                          >
                            📸 {v.photos?.length || 0} photo
                            {(v.photos?.length || 0) !== 1 ? "s" : ""}
                          </span>

                          <span
                            className="font-mono text-xs"
                            style={{ color: "#78716C" }}
                          >
                            🛍️ {v.products?.length || 0} produit
                            {(v.products?.length || 0) !== 1 ? "s" : ""}
                          </span>

                          <span
                            className="font-mono text-xs"
                            style={{ color: "#78716C" }}
                          >
                            ⭐ {v.reviews?.length || 0} avis
                          </span>
                        </div>

                        <div className="sm:hidden mt-4">
                          <span
                            className="font-mono text-xs"
                            style={{ color: "#C2410C" }}
                          >
                            Gérer cette fiche →
                          </span>
                        </div>

                      </div>

                    </div>
                  </Link>
                );
              })}

            </div>
          )}

        </div>

        {/* CONSEIL */}
        {vendors.length > 0 && (
          <div
            className="mt-8 p-6 rounded-2xl"
            style={{
              background: "#18181B",
              color: "#FFFFFF",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

              <div>
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: "#D6D3D1" }}
                >
                  Conseil
                </p>

                <h3 className="font-display font-semibold text-lg mt-1">
                  Une fiche complète attire davantage l’attention.
                </h3>

                <p
                  className="text-sm mt-1"
                  style={{ color: "#A8A29E" }}
                >
                  Ajoutez des photos et vos produits pour présenter votre
                  activité de manière professionnelle.
                </p>
              </div>

              <Link
                href={`/dashboard/${vendors[0].id}`}
                className="font-mono text-xs px-4 py-3 rounded-full text-center whitespace-nowrap"
                style={{
                  background: "#FFFFFF",
                  color: "#18181B",
                }}
              >
                Compléter ma fiche →
              </Link>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
