"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { items, total } = useCart();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">
        Votre panier
      </h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center">
          <div className="mb-4 text-5xl">🛒</div>

          <p className="mb-6 text-gray-600">
            Votre panier est actuellement vide.
          </p>

          <Link
            href="/"
            className="inline-block rounded-xl bg-[#7C4A2D] px-6 py-3 font-semibold text-white"
          >
            Découvrir les cafés
          </Link>
        </div>
      ) : (
        <div>
          <p className="mb-6">
            {items.length} produit(s) dans votre panier.
          </p>

          <div className="rounded-2xl bg-gray-50 p-6">
            <p className="text-xl font-bold">
              Total : {total.toLocaleString("fr-FR")} FCFA
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
