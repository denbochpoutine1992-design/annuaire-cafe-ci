import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export default async function AdminHome() {
  await requireAdmin();

  const [pending, approved, rejected, featured, users, reviews, latestPending] =
    await Promise.all([
      db.vendor.count({ where: { status: "PENDING" } }),
      db.vendor.count({ where: { status: "APPROVED" } }),
      db.vendor.count({ where: { status: "REJECTED" } }),
      db.vendor.count({ where: { featured: true, featuredUntil: { gt: new Date() } } }),
      db.user.count(),
      db.review.count(),
      db.vendor.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, city: true, createdAt: true },
      }),
    ]);

  const stats = [
    { label: "À valider", value: pending, href: "/admin/vendors?status=PENDING" },
    { label: "Approuvés", value: approved, href: "/admin/vendors?status=APPROVED" },
    { label: "Refusés", value: rejected, href: "/admin/vendors?status=REJECTED" },
    { label: "En vedette", value: featured, href: "/admin/vendors?status=APPROVED" },
    { label: "Utilisateurs", value: users, href: null },
    { label: "Avis", value: reviews, href: "/admin/reviews" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Tableau de bord</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map((s) => {
          const inner = (
            <>
              <p className="text-3xl font-semibold">{s.value}</p>
              <p className="mt-1 text-sm text-[#6B5F55]">{s.label}</p>
            </>
          );
          const cls = "rounded-2xl border border-[#E5DDD2] bg-white p-5";
          return s.href ? (
            <Link key={s.label} href={s.href} className={`${cls} transition hover:shadow-md`}>
              {inner}
            </Link>
          ) : (
            <div key={s.label} className={cls}>
              {inner}
            </div>
          );
        })}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Dernières fiches à valider</h2>

        {latestPending.length === 0 ? (
          <p className="mt-3 text-[#6B5F55]">Aucune fiche en attente.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[#E5DDD2] rounded-2xl border border-[#E5DDD2] bg-white">
            {latestPending.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{v.name}</p>
                  <p className="text-sm text-[#6B5F55]">
                    {v.city} · {v.createdAt.toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <Link
                  href="/admin/vendors?status=PENDING"
                  className="shrink-0 rounded-full bg-[#21150F] px-4 py-2 text-sm font-semibold text-white"
                >
                  Examiner
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
