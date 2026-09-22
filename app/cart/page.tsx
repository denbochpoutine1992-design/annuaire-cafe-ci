"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const {
    items,
    total,
    count,
    updateQuantity,
    removeFromCart,
  } = useCart();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
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
        <>
          <p className="mb-6 text-lg">
            <strong>{count}</strong> article(s) dans votre panier.
          </p>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.vendorId + "-" + item.productId}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <p className="mb-1 text-sm font-semibold text-[#7C4A2D]">
                  {item.vendorName}
                </p>

                <h2 className="text-lg font-bold">
                  {item.name}
                </h2>

                <p className="mt-2">
                  Prix unitaire :{" "}
                  <strong>
                    {item.price.toLocaleString("fr-FR")} FCFA
                  </strong>
                </p>

                <p className="mt-1">
                  Quantité : <strong>{item.quantity}</strong>
                </p>

                <p className="mt-2 text-lg font-bold">
                  Sous-total :{" "}
                  {(item.price * item.quantity).toLocaleString("fr-FR")} FCFA
                </p>

                <div className="mt-4 flex items-center gap-3">
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

                  <span className="font-bold">
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

                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(
                        item.productId,
                        item.vendorId
                      )
                    }
                    className="ml-4 text-sm text-red-600"
                  >
                    Supprimer
                  </button>
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
          </div>
        </>
      )}
    </main>
  );
}
