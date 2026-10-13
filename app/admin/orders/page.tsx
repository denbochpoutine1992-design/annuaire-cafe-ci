import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { formatFcfa } from "@/lib/format";
import { toIntlDigits } from "@/lib/phone";
import { setOrderStatus } from "./actions";

const TABS = [
  { value: "NEW", label: "Nouvelles" },
  { value: "CONFIRMED", label: "Confirmées" },
  { value: "DELIVERED", label: "Livrées" },
  { value: "CANCELLED", label: "Annulées" },
  { value: "ALL", label: "Toutes" },
] as const;

const LABEL: Record<string, string> = {
  NEW: "Nouvelle",
  CONFIRMED: "Confirmée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const BADGE: Record<string, string> = {
  NEW: "bg-amber-100 text-amber-900",
  CONFIRMED: "bg-blue-100 text-blue-900",
  DELIVERED: "bg-green-100 text-green-900",
  CANCELLED: "bg-zinc-200 text-zinc-700",
};

const BTN =
  "rounded-full border border-[#D9CFC1] px-4 py-1.5 text-sm font-medium text-[#18120E] transition hover:bg-[#F4EFE7]";

/** Boutons proposés selon le statut actuel de la commande. */
const ACTIONS: Record<string, { status: string; label: string; primary?: boolean }[]> = {
  NEW: [
    { status: "CONFIRMED", label: "Confirmer", primary: true },
    { status: "CANCELLED", label: "Annuler" },
  ],
  CONFIRMED: [
    { status: "DELIVERED", label: "Marquer comme livrée", primary: true },
    { status: "CANCELLED", label: "Annuler" },
  ],
  DELIVERED: [],
  CANCELLED: [{ status: "NEW", label: "Rouvrir" }],
};

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  await requireAdmin();

  const current = TABS.some((t) => t.value === searchParams.status)
    ? (searchParams.status as (typeof TABS)[number]["value"])
    : "NEW";

  const [orders, grouped] = await Promise.all([
    db.order.findMany({
      where: current === "ALL" ? {} : { status: current },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        items: true,
        vendor: { select: { id: true, phone: true } },
      },
    }),
    db.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const counts: Record<string, number> = {};
  let totalCount = 0;
  for (const g of grouped) {
    counts[g.status] = g._count._all;
    totalCount += g._count._all;
  }
  counts.ALL = totalCount;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Commandes</h1>

      <nav aria-label="Filtrer par statut" className="mt-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={`/admin/orders?status=${t.value}`}
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
        <p className="mt-8 text-[#6B5F55]">Aucune commande dans cette catégorie.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border border-[#E5DDD2] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">{o.reference}</h2>
                  <p className="text-sm text-[#6B5F55]">
                    {o.createdAt.toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                      timeZone: "Africa/Abidjan",
                    })}{" "}
                    · chez{" "}
                    {o.vendor ? (
                      <Link href={`/vendors/${o.vendor.id}`} className="underline">
                        {o.vendorName}
                      </Link>
                    ) : (
                      o.vendorName
                    )}
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
                  <span>Total</span>
                  <span>{formatFcfa(o.totalFcfa)}</span>
                </li>
              </ul>

              <div className="mt-4 text-sm text-[#4A3F36]">
                <p>
                  <strong>{o.buyerName}</strong> · {o.buyerPhone}
                </p>
                <p>
                  {o.deliveryAddress}, {o.deliveryCity}
                </p>
                {o.note && <p className="mt-1 text-[#6B5F55]">Note : {o.note}</p>}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {ACTIONS[o.status].map((a) => (
                  <form key={a.status} action={setOrderStatus}>
                    <input type="hidden" name="id" value={o.id} />
                    <input type="hidden" name="status" value={a.status} />
                    <button
                      type="submit"
                      className={
                        a.primary
                          ? "rounded-full bg-[#0F7A40] px-4 py-1.5 text-sm font-semibold text-white"
                          : BTN
                      }
                    >
                      {a.label}
                    </button>
                  </form>
                ))}

                <a
                  href={`https://wa.me/${toIntlDigits(o.buyerPhone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={BTN}
                >
                  Écrire au client
                </a>

                {o.vendor?.phone && (
                  <a
                    href={`https://wa.me/${toIntlDigits(o.vendor.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={BTN}
                  >
                    Écrire au vendeur
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalCount > 100 && current === "ALL" && (
        <p className="mt-4 text-sm text-[#6B5F55]">Les 100 commandes les plus récentes sont affichées.</p>
      )}
    </div>
  );
}
