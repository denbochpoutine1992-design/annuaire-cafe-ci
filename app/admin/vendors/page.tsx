import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { catLabel } from "@/lib/constants";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { deleteVendor, setVendorStatus, toggleFeatured } from "../actions";

const TABS = [
  { value: "PENDING", label: "À valider" },
  { value: "APPROVED", label: "Approuvés" },
  { value: "REJECTED", label: "Refusés" },
  { value: "ALL", label: "Tous" },
] as const;

const BADGE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-900",
  APPROVED: "bg-green-100 text-green-900",
  REJECTED: "bg-red-100 text-red-900",
};

const LABEL: Record<string, string> = {
  PENDING: "À valider",
  APPROVED: "Approuvé",
  REJECTED: "Refusé",
};

const BTN =
  "rounded-full border border-[#D9CFC1] px-3 py-1.5 text-sm font-medium text-[#18120E] transition hover:bg-[#F4EFE7]";

export default async function AdminVendors({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  await requireAdmin();

  const current = TABS.some((t) => t.value === searchParams.status)
    ? (searchParams.status as (typeof TABS)[number]["value"])
    : "PENDING";

  const vendors = await db.vendor.findMany({
    where: current === "ALL" ? {} : { status: current },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { owner: { select: { email: true } } },
  });

  const now = new Date();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Commerces</h1>

      <nav aria-label="Filtrer par statut" className="mt-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={`/admin/vendors?status=${t.value}`}
            aria-current={current === t.value ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              current === t.value
                ? "bg-[#21150F] text-white"
                : "bg-white text-[#6B5F55] border border-[#E5DDD2]"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {vendors.length === 0 ? (
        <p className="mt-8 text-[#6B5F55]">Aucun commerce dans cette catégorie.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {vendors.map((v) => {
            const isFeatured = v.featured && v.featuredUntil !== null && v.featuredUntil > now;
            return (
              <li key={v.id} className="rounded-2xl border border-[#E5DDD2] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold">
                      <Link href={`/vendors/${v.id}`} className="hover:underline">
                        {v.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-[#6B5F55]">
                      {catLabel(v.category)} · {v.city}
                      {v.neighborhood ? `, ${v.neighborhood}` : ""} · {v.phone}
                    </p>
                    <p className="text-sm text-[#6B5F55]">
                      {v.owner.email} · créé le {v.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {isFeatured && (
                      <span className="rounded-full bg-[#F2E8D8] px-3 py-1 text-xs font-semibold text-[#6B4516]">
                        En vedette jusqu’au {v.featuredUntil!.toLocaleDateString("fr-FR")}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${BADGE[v.status]}`}
                    >
                      {LABEL[v.status]}
                    </span>
                  </div>
                </div>

                {v.description && (
                  <p className="mt-3 line-clamp-3 text-sm text-[#4A3F36]">{v.description}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {v.status !== "APPROVED" && (
                    <form action={setVendorStatus}>
                      <input type="hidden" name="id" value={v.id} />
                      <input type="hidden" name="status" value="APPROVED" />
                      <button
                        type="submit"
                        className="rounded-full bg-[#0F7A40] px-4 py-1.5 text-sm font-semibold text-white"
                      >
                        Approuver
                      </button>
                    </form>
                  )}

                  {v.status !== "REJECTED" && (
                    <form action={setVendorStatus}>
                      <input type="hidden" name="id" value={v.id} />
                      <input type="hidden" name="status" value="REJECTED" />
                      <button type="submit" className={BTN}>
                        Refuser
                      </button>
                    </form>
                  )}

                  {v.status === "APPROVED" && (
                    <form action={toggleFeatured}>
                      <input type="hidden" name="id" value={v.id} />
                      <button type="submit" className={BTN}>
                        {isFeatured ? "Retirer de la vedette" : "Mettre en vedette (30 jours)"}
                      </button>
                    </form>
                  )}

                  <form action={deleteVendor}>
                    <input type="hidden" name="id" value={v.id} />
                    <ConfirmButton
                      message={`Supprimer définitivement « ${v.name} » ainsi que ses photos, produits et avis ?`}
                      className="rounded-full border border-red-300 px-3 py-1.5 text-sm font-medium text-red-800 transition hover:bg-red-50"
                    >
                      Supprimer
                    </ConfirmButton>
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
