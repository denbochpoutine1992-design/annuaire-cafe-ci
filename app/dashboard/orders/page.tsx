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
  CONFIRMED: "À préparer",
  DELIVERED: "Livrée",
};

const BADGE: Record<string, string> = {
  CONFIRMED: "bg-blue-100 text-blue-900",
  DELIVERED: "bg-green-100 text-green-900",
};

/**
 * Espace vendeur en LECTURE SEULE : il voit ses produits vendus, jamais l'identité ni les
 * coordonnées du client, ni les produits des autres vendeurs, ni la livraison.
 * La plateforme prépare et livre un colis unique.
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

  const myVendors = await db.vendor.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });
  const myIds = new Set(myVendors.map((v) => v.id));
  const idList = Array.from(myIds);

  // Une vente n'apparaît qu'une fois la commande confirmée par la plateforme (donc payée,
  // pour Mobile Money). Aucun champ « acheteur » n'est demandé à la base : il ne peut pas fuiter.
  const orders =
    idList.length === 0
      ? []
      : await db.order.findMany({
          where: {
            status: { in: ["CONFIRMED", "DELIVERED"] as ("CONFIRMED" | "DELIVERED")[] },
            OR: [{ vendorId: { in: idList } }, { items: { some: { vendorId: { in: idList } } } }],
          },
          orderBy: { createdAt: "desc" },
          take: 200,
          select: {
            id: true,
            reference: true,
            status: true,
            createdAt: true,
            vendorId: true,
            items: {
              select: {
                id: true,
                vendorId: true,
                nameSnapshot: true,
                unitPriceFcfa: true,
                quantity: true,
              },
            },
          },
        });

  // Uniquement les lignes qui appartiennent à ce vendeur (anciennes commandes : vendeur sur la commande)
  const sales = orders
    .map((o) => {
      const items = o.items.filter((i) => {
        const owner = i.vendorId ?? o.vendorId;
        return !!owner && myIds.has(owner);
      });
      const amount = items.reduce((sum, i) => sum + i.unitPriceFcfa * i.quantity, 0);
      return { id: o.id, reference: o.reference, status: o.status, createdAt: o.createdAt, items, amount };
    })
    .filter((s) => s.items.length > 0);

  const counts: Record<string, number> = {
    CONFIRMED: sales.filter((s) => s.status === "CONFIRMED").length,
    DELIVERED: sales.filter((s) => s.status === "DELIVERED").length,
    ALL: sales.length,
  };

  const shown = current === "ALL" ? sales : sales.filter((s) => s.status === current);

  return (
    <>
      <NavBar />

      <main className="mx-auto max-w-3xl px-5 py-8 md:py-12">
        <Link href="/dashboard" className="text-sm text-[#6B5F55] underline">
          ← Mon tableau de bord
        </Link>

        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">Mes ventes</h1>
        <p className="mt-1 text-sm text-[#6B5F55]">
          Vos produits vendus sur Annuaire Café CI. Une vente apparaît ici une fois la commande
          confirmée et payée. La plateforme prépare et livre les colis.
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

        {shown.length === 0 ? (
          <p className="mt-8 text-[#6B5F55]">Aucune vente dans cette catégorie.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {shown.map((s) => (
              <li key={s.id} className="rounded-2xl border border-[#E5DDD2] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold">{s.reference}</h2>
                    <p className="text-sm text-[#6B5F55]">
                      {s.createdAt.toLocaleString("fr-FR", {
                        dateStyle: "short",
                        timeStyle: "short",
                        timeZone: "Africa/Abidjan",
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${BADGE[s.status]}`}
                  >
                    {LABEL[s.status]}
                  </span>
                </div>

                <ul className="mt-4 divide-y divide-[#EFE8DC] rounded-xl bg-[#FBF8F2] px-4">
                  {s.items.map((i) => (
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
                    <span>Montant de vos ventes</span>
                    <span>{formatFcfa(s.amount)}</span>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
