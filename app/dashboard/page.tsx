"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { catLabel } from "@/lib/constants";
import type { Vendor } from "@/types/vendor";

type Row = Vendor & { status?: "PENDING" | "APPROVED" | "REJECTED" };

const STATUS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "En attente de validation", className: "bg-amber-100 text-amber-900" },
  APPROVED: { label: "En ligne", className: "bg-green-100 text-green-900" },
  REJECTED: { label: "Refusée", className: "bg-red-100 text-red-900" },
};

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B78B42]";

function plural(n: number, word: string) {
  return `${n} ${word}${n > 1 ? "s" : ""}`;
}

export default function DashboardPage() {
  const router = useRouter();

  const [vendors, setVendors] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    fetch("/api/vendors?mine=1")
      .then((r) => r.json())
      .then((data) => setVendors(Array.isArray(data) ? data : []))
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));

    fetch("/api/orders/count")
      .then((r) => r.json())
      .then((data) => setNewOrders(Number(data?.count) || 0))
      .catch(() => setNewOrders(0));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const totalPhotos = vendors.reduce((t, v) => t + (v.photos?.length ?? 0), 0);
  const totalProducts = vendors.reduce((t, v) => t + (v.products?.length ?? 0), 0);
  const totalReviews = vendors.reduce((t, v) => t + (v.reviews?.length ?? 0), 0);
  const pending = vendors.filter((v) => v.status === "PENDING").length;

  const stats = [
    { icon: "☕", value: vendors.length, label: vendors.length > 1 ? "Commerces" : "Commerce" },
    { icon: "📸", value: totalPhotos, label: "Photos" },
    { icon: "🛍️", value: totalProducts, label: "Produits" },
    { icon: "⭐", value: totalReviews, label: "Avis" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* NAVIGATION */}
      <nav className="flex items-center justify-between bg-[#18181B] px-6 py-4 text-white md:px-12">
        <Link href="/" className={`font-display text-lg font-semibold text-white ${FOCUS}`}>
          ☕ Annuaire Café CI
        </Link>

        <button
          onClick={logout}
          className={`font-mono text-xs uppercase tracking-wide text-[#E7E5E4] ${FOCUS}`}
        >
          Déconnexion
        </button>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-8 md:px-12 md:py-12">
        {/* EN-TÊTE */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#C2410C]">
              Espace professionnel
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-[#18181B] md:text-4xl">
              Mon tableau de bord
            </h1>
            <p className="mt-2 text-sm text-[#78716C]">
              Gérez vos commerces, vos produits et vos commandes sur Annuaire Café CI.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/orders"
              className={`relative rounded-full bg-[#21150F] px-5 py-3 text-center font-mono text-sm text-white ${FOCUS}`}
            >
              Mes commandes
              {newOrders > 0 && (
                <span className="ml-2 rounded-full bg-[#D8B46A] px-2 py-0.5 text-xs font-bold text-black">
                  {newOrders}
                </span>
              )}
            </Link>
            <Link
              href="/dashboard/new"
              className="btn-primary rounded-full px-5 py-3 text-center font-mono text-sm"
            >
              + Ajouter un commerce
            </Link>
          </div>
        </div>

        {newOrders > 0 && (
          <Link
            href="/dashboard/orders"
            className="mt-6 block rounded-2xl border border-[#E7C780] bg-[#FFF6E0] p-4 text-sm text-[#5C4310]"
          >
            <strong>
              {newOrders} {newOrders > 1 ? "nouvelles commandes" : "nouvelle commande"}
            </strong>{" "}
            à traiter. Appuyez ici pour {newOrders > 1 ? "les" : "la"} confirmer.
          </Link>
        )}

        {pending > 0 && (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {plural(pending, "fiche")} en attente de validation :{" "}
            {pending > 1 ? "elles seront visibles" : "elle sera visible"} dans l’annuaire dès
            l’approbation.
          </p>
        )}

        {/* STATISTIQUES */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-[#E7E5E4] bg-white p-5">
              <div className="text-2xl" aria-hidden="true">
                {s.icon}
              </div>
              <div className="mt-3 font-display text-2xl font-semibold text-[#18181B]">
                {s.value}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-[#78716C]">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* MES COMMERCES */}
        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-[#18181B]">Mes commerces</h2>
          <p className="mb-4 mt-1 text-sm text-[#78716C]">Gérez vos fiches professionnelles.</p>

          {loading ? (
            <div
              className="h-40 animate-pulse rounded-2xl bg-[#EFEAE2] motion-reduce:animate-none"
              aria-busy="true"
            />
          ) : vendors.length === 0 ? (
            <div className="rounded-2xl border border-[#E7E5E4] bg-white p-10 text-center md:p-16">
              <div className="text-5xl" aria-hidden="true">
                ☕
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-[#18181B]">
                Votre espace est prêt
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#78716C]">
                Créez votre première fiche pour présenter votre commerce aux clients d’Annuaire
                Café CI.
              </p>
              <Link
                href="/dashboard/new"
                className="btn-primary mt-5 inline-block rounded-full px-5 py-3 font-mono text-sm"
              >
                Créer ma première fiche
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {vendors.map((v) => {
                const cover = v.photos?.[0]?.url;
                const status = STATUS[v.status ?? "APPROVED"] ?? STATUS.APPROVED;
                const photos = v.photos?.length ?? 0;
                const products = v.products?.length ?? 0;
                const reviews = v.reviews?.length ?? 0;

                return (
                  <Link
                    key={v.id}
                    href={`/dashboard/${v.id}`}
                    className={`group overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white transition-transform motion-safe:hover:-translate-y-0.5 ${FOCUS}`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* PHOTO */}
                      <div className="relative h-36 shrink-0 bg-[#E7E5E4] sm:h-auto sm:w-44">
                        {cover ? (
                          <Image
                            src={cover}
                            alt={v.name ?? "Commerce"}
                            fill
                            sizes="(min-width: 640px) 176px, 100vw"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div
                            className="flex h-full w-full items-center justify-center text-4xl"
                            aria-hidden="true"
                          >
                            ☕
                          </div>
                        )}
                      </div>

                      {/* INFORMATIONS */}
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="font-display text-xl font-semibold text-[#18181B]">
                              {v.name}
                            </div>
                            {v.category && (
                              <div className="mt-1 font-mono text-xs text-[#C2410C]">
                                {catLabel(v.category)}
                              </div>
                            )}
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <div className="mt-3 text-sm text-[#57534E]">
                          📍 {v.neighborhood ? `${v.neighborhood}, ` : ""}
                          {v.city}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-4 border-t border-[#E7E5E4] pt-3 font-mono text-xs text-[#78716C]">
                          <span>📸 {plural(photos, "photo")}</span>
                          <span>🛍️ {plural(products, "produit")}</span>
                          <span>⭐ {reviews} avis</span>
                        </div>

                        <div className="mt-4 font-mono text-xs text-[#C2410C]">
                          Gérer cette fiche →
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
          <div className="mt-8 rounded-2xl bg-[#18181B] p-6 text-white">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D6D3D1]">
                  Conseil
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold">
                  Une fiche complète attire davantage l’attention.
                </h3>
                <p className="mt-1 text-sm text-[#A8A29E]">
                  Ajoutez des photos et vos produits pour présenter votre activité de manière
                  professionnelle.
                </p>
              </div>

              <Link
                href={`/dashboard/${vendors[0].id}`}
                className="whitespace-nowrap rounded-full bg-white px-4 py-3 text-center font-mono text-xs text-[#18181B]"
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
