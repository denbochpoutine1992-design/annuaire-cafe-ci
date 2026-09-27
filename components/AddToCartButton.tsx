"use client";

import { useCart } from "./CartProvider";

type Props = {
  productId: string;
  vendorId: string;
  vendorName: string;
  name: string;
  price: number;
  image?: string;
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

  function handleAdd() {
    addToCart({
      productId,
      vendorId,
      vendorName,
      name,
      price:
        typeof price === "number"
          ? price
          : Number(String(price).replace(/[^\d]/g, "")) || 0,
      image,
    });
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Ajouter ${name} au panier`}
      title="Ajouter au panier"
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#D8B46A] text-3xl font-light text-black shadow-md transition-all duration-200 hover:scale-105 hover:bg-[#C9A052] active:scale-95"
    >
      +
    </button>
  );
}
