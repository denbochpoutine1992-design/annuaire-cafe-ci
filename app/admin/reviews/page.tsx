import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { deleteReview } from "../actions";

export default async function AdminReviews() {
  await requireAdmin();

  const reviews = await db.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { vendor: { select: { id: true, name: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Avis</h1>

      {reviews.length === 0 ? (
        <p className="mt-6 text-[#6B5F55]">Aucun avis pour le moment.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-[#E5DDD2] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">
                    {r.authorName} · {r.rating}/5
                  </p>
                  <p className="text-sm text-[#6B5F55]">
                    sur{" "}
                    <Link href={`/vendors/${r.vendor.id}`} className="underline">
                      {r.vendor.name}
                    </Link>{" "}
                    · {r.createdAt.toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <form action={deleteReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <ConfirmButton
                    message="Supprimer cet avis ?"
                    className="rounded-full border border-red-300 px-3 py-1.5 text-sm font-medium text-red-800 transition hover:bg-red-50"
                  >
                    Supprimer
                  </ConfirmButton>
                </form>
              </div>

              {r.comment && <p className="mt-3 text-sm text-[#4A3F36]">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
