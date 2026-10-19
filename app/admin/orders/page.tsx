import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { formatFcfa } from "@/lib/format";
import { toIntlDigits } from "@/lib/phone";
import { setOrderStatus, setPaymentStatus } from "./actions";

const TABS = [
  { value: "NEW", label: "Nouvelles" },
  { value: "VERIFY", label: "Paiements à vérifier" },
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

const METHOD_LABEL: Record<string, string> = {
  CASH: "À la livraison",
  ORANGE: "Orange Money",
  MTN: "MTN MoMo",
  MOOV: "Moov Money",
  WAVE: "Wave",
};

const PAY_LABEL: Record<string, string> = {
  UNPAID: "Non payée",
  TO_VERIFY: "Paiement à vérifier",
  PAID: "Payée",
};

const PAY_BADGE: Record<string, string> = {
  UNPAID: "bg-zinc-200 text-zinc-700",
  TO_VERIFY: "bg-amber-100 text-amber-900",
  PAID: "bg-green-100 text-green-900",
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

  const [orders, grouped, toVerify] = await Promise.all([
    db.order.findMany({
      where:
        current === "ALL"
          ? {}
          : current === "VERIFY"
          ? { paymentStatus: "TO_VERIFY" as const }
          : { status: current },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        items: true,
        vendor: { select: { id: true, phone: true } },
      },
    }),
    db.order.groupBy({ by: ["status"], _count: { _all: true } }),
    db.order.count({ where: { paymentStatus: "TO_VERIFY" } }),
  ]);

  const counts: Record<string, number> = {};
  let totalCount = 0;
  for (const g of grouped) {
    counts[g.status] = g._count._all;
    totalCount += g._count._all;
  }
  counts.ALL = totalCount;
  counts.VERIFY = toVerify;

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

              {(() => {
                const mobile = !!o.paymentMethod && o.paymentMethod !== "CASH";
                return (
                  <div className="mt-4 rounded-xl border border-[#E5DDD2] bg-[#FBF8F2] p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">
                        Paiement : {METHOD_LABEL[o.paymentMethod ?? "CASH"] ?? o.paymentMethod}
                      </span>
                      {mobile && (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${PAY_BADGE[o.paymentStatus]}`}
                        >
                          {PAY_LABEL[o.paymentStatus]}
                        </span>
                      )}
                    </div>

                    {mobile && o.paymentRef && (
                      <p className="mt-2">
                        Identifiant de transaction indiqué par le client :{" "}
                        <strong className="break-all">{o.paymentRef}</strong>
                      </p>
                    )}

                    {mobile && o.paymentStatus !== "PAID" && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <form action={setPaymentStatus}>
                          <input type="hidden" name="id" value={o.id} />
                          <input type="hidden" name="action" value="PAID" />
                          <button
                            type="submit"
                            className="rounded-full bg-[#0F7A40] px-4 py-1.5 text-sm font-semibold text-white"
                          >
                            Paiement reçu
                          </button>
                        </form>
                        {o.paymentStatus === "TO_VERIFY" && (
                          <form action={setPaymentStatus}>
                            <input type="hidden" name="id" value={o.id} />
                            <input type="hidden" name="action" value="UNPAID" />
                            <button type="submit" className={BTN}>
                              Paiement non reçu
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="mt-4 flex flex-wrap gap-2">
                {ACTIONS[o.status].map((a) => {
                  const blocked =
                    a.status === "CONFIRMED" &&
                    !!o.paymentMethod &&
                    o.paymentMethod !== "CASH" &&
                    o.paymentStatus !== "PAID";
                  return (
                    <form key={a.status} action={setOrderStatus}>
                      <input type="hidden" name="id" value={o.id} />
                      <input type="hidden" name="status" value={a.status} />
                      <button
                        type="submit"
                        disabled={blocked}
                        title={blocked ? "Validez d'abord le paiement" : undefined}
                        className={
                          a.primary
                            ? "rounded-full bg-[#0F7A40] px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
                            : BTN
                        }
                      >
                        {blocked ? "Confirmer (paiement à valider)" : a.label}
                      </button>
                    </form>
                  );
                })}

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
