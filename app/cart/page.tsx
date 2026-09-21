
"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const {
    items,
    total,
    updateQuantity,
    removeFromCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-bold">
          Votre panier
        </h1>

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
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">
        Votre panier
      </h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.vendorId + "-" + item.productId}
            className="rounded-2xl border bg-white p-4 shadow-sm"
          >
            <div className="flex gap-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl object-cover"
                />
              )}

              <div className="flex-1">
                <p className="text-sm font-medium text-[#7C4A2D]">
                  {item.vendorName}
                </p>

                <h2 className="font-bold">
                  {item.name}
                </h2>

                <p className="text-sm text-gray-600">
                  {item.price.toLocaleString("fr-FR")} FCFA / unité
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.vendorId,
                        item.quantity - 1
                      )
                    }
                    className="h-9 w-9 rounded-lg border"
                  >
                    −
                  </button>

                  <span className="font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.vendorId,
                        item.quantity + 1
                      )
                    }
                    className="h-9 w-9 rounded-lg border"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold">
                  {(item.price * item.quantity).toLocaleString("fr-FR")} FCFA
                </p>

                <button
                  type="button"
                  onClick={() =>
                    removeFromCart(
                      item.productId,
                      item.vendorId
                    )
                  }
                  className="mt-3 text-sm text-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-gray-50 p-6">
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>

          <span>
            {total.toLocaleString("fr-FR")} FCFA
          </span>
        </div>

        <Link
          href="/checkout"
          className="mt-6 block rounded-xl bg-[#7C4A2D] px-6 py-4 text-center font-bold text-white"
        >
          Passer la commande
        </Link>
      </div>
    </main>
  );
}
```
