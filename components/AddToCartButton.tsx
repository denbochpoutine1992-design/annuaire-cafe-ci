"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { parseFcfa } from "@/lib/format";

type Props = {
  productId: string;
  vendorId: string;
  vendorName: string;
  name: string;
  price: number | string;
  image?: string | null;
};

export default function AddToCartButton({
  productId,
  vendorId,
  vendorName,
  name,
  price,
  image,
}: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleAdd() {
    addToCart({
      productId,
      vendorId,
      vendorName,
      name,
      price: parseFcfa(price),
      image: image ?? undefined,
    });

    // Confirmation visible pendant un court instant
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1500);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Ajouter ${name} au panier`}
        title="Ajouter au panier"
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl font-medium text-black shadow-md transition-all duration-200 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B78B42] ${
          added ? "bg-[#0F7A40] text-white" : "bg-[#D8B46A] hover:scale-105 hover:bg-[#C9A052]"
        }`}
      >
        {added ? "✓" : "+"}
      </button>

      {/* Annonce pour les lecteurs d'écran */}
      <span className="sr-only" aria-live="polite">
        {added ? `${name} ajouté au panier` : ""}
      </span>
    </>
  );
}
