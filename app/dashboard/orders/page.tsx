import Link from "next/link";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { formatFcfa } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mes ventes",
};

const TABS = [
  { value: "CONFIRMED", label: "À préparer" },
  { value: "DELIVERED", label: "Livrées" },
  { value: "ALL", label: "Toutes" },
] as const;

const LABEL: Record<string, string> = {
  NEW: "Reçue",
  CONFIRMED: "À préparer",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const BADGE: Record<string, string> = {
  NEW: "bg-amber-100 text-amber-900",
  CONFIRMED: "bg-blue-100 text-blue-900",
  DELIVERED: "bg-green-100 text-green-900",
  CANCELLED: "bg-zinc-200 text-zinc-700",
};

/**
 * Espace vendeur en LECTURE SEULE : il voit ce qui a été vendu, jamais l'identité
 * ni les coordonnées du client. La plateforme prépare et livre les commandes.
 */
export default async function MySales({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login?next=/dashboard/orders");

  const current = TABS.some((t) => t.value === searchParams.status)
    ? (searchParams.status as (typeof TABS)[number]["value"])
    : "CONFIRMED";

  // Une vente n'apparaît chez le vendeur qu'une fois la commande confirmée par la plateforme
  // (donc payée, pour Mobile Money). Les commandes en attente ou annulées restent invisibles.
  const mine = {
    vendor: { ownerId: userId },
    status: { in: ["CONFIRMED", "DELIVERED"] as ("CONFIRMED" | "DELIVERED")[] },
  };

  const [orders, grouped] = await Promise.all([
    db.order.findMany({
      where: current === "ALL" ? mine : { ...mine, status: current },
      orderBy: { createdAt: "desc" },
      take: 100,
      // Aucun champ « acheteur » n'est demandé à la base : il ne peut pas fuiter.
      select: {
        id: true,
        reference: true,
        status: true,
        createdAt: true,
        items: {
          select: { id: true, nameSnapshot: true, unitPriceFcfa: true, quantity: true },
        },
      },
    }),
    db.order.groupBy({ by: ["status"], where: mine, _count: { _all: true } }),
  ]);

  const counts: Record<string, number> = {};
  let total = 0;
  for (const g of grouped) {
    counts[g.status] = g._count._all;
    total += g._count._all;
  }
  counts.ALL = total;

  return (
    <>
      <NavBar />

      <main className="mx-auto max-w-3xl px-5 py-8 md:py-12">
        <Link href="/dashboard" className="text-sm text-[#6B5F55] underline">
          ← Mon tableau de bord
        </Link>

        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">Mes ventes</h1>
        <p className="mt-1 text-sm text-[#6B5F55]">
          Les produits de vos commerces vendus sur Annuaire Café CI. Une vente apparaît ici une fois la
          commande confirmée et payée. La plateforme prépare et livre les colis.
        </p>

        <nav aria-label="Filtrer par statut" className="mt-5 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Link
              key={t.value}
              href={`/dashboard/orders?status=${t.value}`}
              aria-current={current === t.value ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                current === t.value
                  ? "bg-[#21150F] text-white"
                  : "border border-[#E5DDD2] bg-white text-[#6B5F55]"
              }`}
            >
              {t.label} ({counts[t.value] ?? 0})
            </Link>
          ))}
        </nav>

        {orders.length === 0 ? (
          <p className="mt-8 text-[#6B5F55]">Aucune vente dans cette catégorie.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {orders.map((o) => {
              const amount = o.items.reduce((sum, i) => sum + i.unitPriceFcfa * i.quantity, 0);
              return (
                <li key={o.id} className="rounded-2xl border border-[#E5DDD2] bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold">{o.reference}</h2>
                      <p className="text-sm text-[#6B5F55]">
                        {o.createdAt.toLocaleString("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                          timeZone: "Africa/Abidjan",
                        })}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${BADGE[o.status]}`}
                    >
                      {LABEL[o.status]}
                    </span>
                  </div>

                  <ul className="mt-4 divide-y divide-[#EFE8DC] rounded-xl bg-[#FBF8F2] px-4">
                    {o.items.map((i) => (
                      <li key={i.id} className="flex justify-between gap-4 py-2 text-sm">
                        <span>
                          {i.quantity} × {i.nameSnapshot}
                        </span>
                        <span className="shrink-0 font-medium">
                          {formatFcfa(i.unitPriceFcfa * i.quantity)}
                        </span>
                      </li>
                    ))}
                    <li className="flex justify-between gap-4 py-2 text-sm font-semibold">
                      <span>Montant des ventes</span>
                      <span>{formatFcfa(amount)}</span>
                    </li>
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
