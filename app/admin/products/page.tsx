import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { formatFcfa, parseFcfa } from "@/lib/format";
import { setProductPrice, setProductStatus, setProductStock } from "./actions";

const TABS = [
  { value: "PENDING", label: "À valider" },
  { value: "APPROVED", label: "Approuvés" },
  { value: "REJECTED", label: "Refusés" },
  { value: "ALL", label: "Tous" },
] as const;

const LABEL: Record<string, string> = {
  PENDING: "À valider",
  APPROVED: "Approuvé",
  REJECTED: "Refusé",
};

const BADGE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-900",
  APPROVED: "bg-green-100 text-green-900",
  REJECTED: "bg-red-100 text-red-900",
};

const BTN =
  "rounded-full border border-[#D9CFC1] px-4 py-1.5 text-sm font-medium text-[#18120E] transition hover:bg-[#F4EFE7]";

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  await requireAdmin();

  const current = TABS.some((t) => t.value === searchParams.status)
    ? (searchParams.status as (typeof TABS)[number]["value"])
    : "PENDING";

  const [products, grouped] = await Promise.all([
    db.product.findMany({
      where: current === "ALL" ? {} : { status: current },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { vendor: { select: { id: true, name: true } } },
    }),
    db.product.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const counts: Record<string, number> = {};
  let total = 0;
  for (const g of grouped) {
    counts[g.status] = g._count._all;
    total += g._count._all;
  }
  counts.ALL = total;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Produits</h1>
      <p className="mt-1 text-sm text-[#6B5F55]">
        Un produit n’est visible par les clients qu’une fois approuvé. Toute modification d’un
        vendeur le remet « à valider ».
      </p>

      <nav aria-label="Filtrer par statut" className="mt-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={`/admin/products?status=${t.value}`}
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

      {products.length === 0 ? (
        <p className="mt-8 text-[#6B5F55]">Aucun produit dans cette catégorie.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {products.map((p) => {
            const amount = parseFcfa(p.price);
            return (
              <li key={p.id} className="rounded-2xl border border-[#E5DDD2] bg-white p-5">
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                    {p.photoUrl ? (
                      <Image
                        src={p.photoUrl}
                        alt={p.name}
                        fill
                        sizes="80px"
                        className="object-contain p-1"
                        unoptimized
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-full w-full items-center justify-center text-3xl"
                      >
                        ☕
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h2 className="text-lg font-semibold leading-snug">{p.name}</h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${BADGE[p.status]}`}
                      >
                        {LABEL[p.status]}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-[#6B5F55]">
                      Vendeur :{" "}
                      <Link href={`/vendors/${p.vendor.id}`} className="underline">
                        {p.vendor.name}
                      </Link>
                    </p>

                    <p className="mt-2 text-base font-semibold">
                      {amount > 0 ? formatFcfa(amount) : "Prix non renseigné"}
                    </p>

                    <p className="mt-1 text-sm text-[#6B5F55]">
                      Stock :{" "}
                      {p.stock === null ? (
                        "non suivi"
                      ) : p.stock <= 0 ? (
                        <strong className="text-red-800">épuisé</strong>
                      ) : (
                        <strong>{p.stock}</strong>
                      )}
                    </p>

                    {p.description && (
                      <p className="mt-2 line-clamp-3 text-sm text-[#4A3F36]">{p.description}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {p.status !== "APPROVED" && (
                    <form action={setProductStatus}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="status" value="APPROVED" />
                      <button
                        type="submit"
                        className="rounded-full bg-[#0F7A40] px-4 py-1.5 text-sm font-semibold text-white"
                      >
                        Approuver
                      </button>
                    </form>
                  )}

                  {p.status !== "REJECTED" && (
                    <form action={setProductStatus}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="status" value="REJECTED" />
                      <button type="submit" className={BTN}>
                        Refuser
                      </button>
                    </form>
                  )}

                  <form action={setProductPrice} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={p.id} />
                    <label htmlFor={`price-${p.id}`} className="sr-only">
                      Prix de vente en FCFA
                    </label>
                    <input
                      id={`price-${p.id}`}
                      name="price"
                      inputMode="numeric"
                      defaultValue={amount > 0 ? String(amount) : ""}
                      placeholder="Prix FCFA"
                      className="h-9 w-28 rounded-full border border-[#D9CFC1] px-3 text-sm"
                    />
                    <button type="submit" className={BTN}>
                      Enregistrer le prix
                    </button>
                  </form>

                  <form action={setProductStock} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={p.id} />
                    <label htmlFor={`stock-${p.id}`} className="sr-only">
                      Quantité en stock
                    </label>
                    <input
                      id={`stock-${p.id}`}
                      name="stock"
                      inputMode="numeric"
                      defaultValue={p.stock === null ? "" : String(p.stock)}
                      placeholder="Stock"
                      className="h-9 w-24 rounded-full border border-[#D9CFC1] px-3 text-sm"
                    />
                    <button type="submit" className={BTN}>
                      Enregistrer le stock
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
