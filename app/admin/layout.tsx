import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

const LINKS = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/vendors", label: "Commerces" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/orders", label: "Commandes" },
  { href: "/admin/reviews", label: "Avis" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  // Compteurs affichés sur les liens « Commandes » et « Produits »
  const [newOrders, pendingProducts] = await Promise.all([
    db.order.count({ where: { OR: [{ status: "NEW" }, { paymentStatus: "TO_VERIFY" }] } }),
    db.product.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#18120E]">
      <header className="border-b border-[#E5DDD2] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <nav aria-label="Administration" className="flex flex-wrap items-center gap-1">
            <span className="mr-3 font-semibold">Administration</span>
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-1.5 text-sm text-[#6B5F55] transition hover:bg-[#F4EFE7] hover:text-[#18120E]"
              >
                {l.label}
                {l.href === "/admin/orders" && newOrders > 0 && (
                  <span className="ml-1.5 rounded-full bg-[#B78B42] px-2 py-0.5 text-xs font-bold text-black">
                    {newOrders}
                  </span>
                )}
                {l.href === "/admin/products" && pendingProducts > 0 && (
                  <span className="ml-1.5 rounded-full bg-[#B78B42] px-2 py-0.5 text-xs font-bold text-black">
                    {pendingProducts}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-[#6B5F55]">{admin.email}</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
    </div>
  );
}
