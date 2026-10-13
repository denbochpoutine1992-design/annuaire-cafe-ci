"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

/** Bouton « panier » de la barre du haut, avec le nombre d'articles. */
export default function CartLink() {
  const { count, ready } = useCart();
  const showCount = ready && count > 0;

  return (
    <Link
      href="/panier"
      aria-label={
        showCount ? `Panier, ${count} article${count > 1 ? "s" : ""}` : "Panier"
      }
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B78B42]"
      style={{ color: "#18181B" }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {showCount && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#B78B42] px-1 text-xs font-bold text-black">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
