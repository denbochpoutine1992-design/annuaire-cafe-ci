"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useCart, type VendorGroup } from "@/components/CartProvider";
import CheckoutForm, { type OrderDone } from "@/components/CheckoutForm";
import PaymentCard from "@/components/PaymentCard";
import type { PaymentMethod } from "@/lib/payment";
import { formatFcfa } from "@/lib/format";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B78B42]";

const STEP_BTN = `flex h-11 w-11 items-center justify-center rounded-full border border-[#D9CFC1] bg-white text-xl transition hover:bg-[#F4EFE7] ${FOCUS}`;

function plural(n: number, word: string) {
  return `${n} ${word}${n > 1 ? "s" : ""}`;
}

export default function CartView({ methods }: { methods?: PaymentMethod[] }) {
  const { ready, groups, total, count, updateQuantity, removeFromCart, clearCart } =
    useCart();

  // Vendeur dont le formulaire de commande est ouvert
  const [openVendor, setOpenVendor] = useState<string | null>(null);
  // Dernière commande enregistrée (affichée en haut de la page)
  const [done, setDone] = useState<OrderDone | null>(null);

  function handleDone(group: VendorGroup, info: OrderDone) {
    // La commande est enregistrée : on retire du panier les produits de ce vendeur
    group.items.forEach((item) => removeFromCart(item.productId, item.vendorId));
    setOpenVendor(null);
    setDone(info);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 md:py-14">
      <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
        Mon panier
      </h1>

      {done && done.payment && (
        <PaymentCard
          reference={done.reference}
          totalFcfa={done.totalFcfa}
          buyerPhone={done.buyerPhone}
          payment={done.payment}
        />
      )}

      {done && !done.payment && (
        <section
          role="status"
          className="mt-6 rounded-2xl border border-[#BFE3CC] bg-[#EEF9F2] p-5"
        >
          <p className="text-lg font-semibold text-[#0F5A31]">
            ✓ Commande {done.reference} enregistrée
          </p>
          <p className="mt-2 text-[#2F4A3A]">
            Total : <strong>{formatFcfa(done.totalFcfa)}</strong>. Merci ! Annuaire Café CI vous
            appelle bientôt pour confirmer votre commande et organiser la livraison. Le paiement se
            fait à la livraison.
          </p>
          <p className="mt-3 text-sm text-[#2F4A3A]">
            Gardez votre référence : <strong>{done.reference}</strong>.
          </p>
        </section>
      )}

      {done && (
        <button
          type="button"
          onClick={() => setDone(null)}
          className={`mt-3 rounded-full border border-[#D9CFC1] px-5 py-2 text-sm font-medium transition hover:bg-[#F4EFE7] ${FOCUS}`}
        >
          Fermer ce message
        </button>
      )}

      {!ready ? (
        <div
          className="mt-8 h-40 animate-pulse rounded-2xl bg-[#F4EFE7] motion-reduce:animate-none"
          aria-busy="true"
        />
      ) : groups.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[#E5DDD2] bg-white p-10 text-center">
          <p className="text-lg font-medium">Votre panier est vide.</p>
          <p className="mt-2 text-[#6B5F55]">
            Parcourez les commerces et ajoutez vos cafés préférés.
          </p>
          <Link
            href="/"
            className={`mt-6 inline-flex rounded-full bg-[#21150F] px-6 py-3 font-semibold text-white ${FOCUS}`}
          >
            Découvrir les commerces
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-2 text-[#6B5F55]">
            {plural(count, "article")} chez {plural(groups.length, "vendeur")}
          </p>

          <div className="mt-8 space-y-6">
            {groups.map((group) => (
              <section
                key={group.vendorId}
                aria-labelledby={`vendor-${group.vendorId}`}
                className="overflow-hidden rounded-2xl border border-[#E5DDD2] bg-white"
              >
                <header className="flex items-center justify-between gap-3 border-b border-[#EFE8DC] px-5 py-4">
                  <h2 id={`vendor-${group.vendorId}`} className="truncate font-semibold">
                    <Link
                      href={`/vendors/${group.vendorId}`}
                      className={`hover:underline ${FOCUS}`}
                    >
                      {group.vendorName || "Vendeur"}
                    </Link>
                  </h2>
                  <p className="shrink-0 text-sm text-[#6B5F55]">
                    Sous-total : <strong>{formatFcfa(group.subtotal)}</strong>
                  </p>
                </header>

                <ul className="divide-y divide-[#EFE8DC]">
                  {group.items.map((item) => (
                    <li key={`${item.vendorId}-${item.productId}`} className="flex gap-4 p-5">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
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
                        <p className="line-clamp-2 font-medium leading-snug">{item.name}</p>
                        <p className="mt-1 text-sm text-[#6B5F55]">
                          {formatFcfa(item.price)} l’unité
                        </p>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Retirer une unité de ${item.name}`}
                              onClick={() =>
                                updateQuantity(item.productId, item.vendorId, item.quantity - 1)
                              }
                              className={STEP_BTN}
                            >
                              −
                            </button>
                            <span
                              className="w-8 text-center font-semibold"
                              aria-label={`Quantité : ${item.quantity}`}
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Ajouter une unité de ${item.name}`}
                              onClick={() =>
                                updateQuantity(item.productId, item.vendorId, item.quantity + 1)
                              }
                              className={STEP_BTN}
                            >
                              +
                            </button>
                          </div>

                          <p className="font-semibold">
                            {formatFcfa(item.price * item.quantity)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId, item.vendorId)}
                          className={`mt-3 text-sm text-red-800 underline ${FOCUS}`}
                        >
                          Retirer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {openVendor === group.vendorId ? (
                  <CheckoutForm
                    group={group}
                    methods={methods}
                    onDone={(info) => handleDone(group, info)}
                    onCancel={() => setOpenVendor(null)}
                  />
                ) : (
                  <div className="border-t border-[#EFE8DC] p-5">
                    <button
                      type="button"
                      onClick={() => setOpenVendor(group.vendorId)}
                      className={`w-full rounded-full bg-[#D8B46A] px-6 py-3.5 font-semibold text-black transition hover:bg-[#C9A052] ${FOCUS}`}
                    >
                      Commander chez {group.vendorName || "ce vendeur"}
                    </button>
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#E5DDD2] bg-white p-5">
            <div className="flex items-center justify-between text-lg">
              <span>Total</span>
              <strong>{formatFcfa(total)}</strong>
            </div>

            {groups.length > 1 && (
              <p className="mt-3 text-sm text-[#6B5F55]">
                Votre panier contient des produits de {groups.length} vendeurs : une commande
                séparée est passée avec chacun, et chaque vendeur prépare et livre la sienne.
              </p>
            )}
            <p className="mt-3 text-sm text-[#6B5F55]">
              Les prix sont vérifiés au moment de la commande.
            </p>

            <button
              type="button"
              onClick={() => {
                if (window.confirm("Vider tout le panier ?")) {
                  clearCart();
                  setOpenVendor(null);
                }
              }}
              className={`mt-5 rounded-full border border-[#D9CFC1] px-4 py-2 text-sm font-medium transition hover:bg-[#F4EFE7] ${FOCUS}`}
            >
              Vider le panier
            </button>
          </div>
        </>
      )}
    </main>
  );
}
