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
  alert("Produit ajouté au panier");

  addToCart({
      productId,
      vendorId,
      vendorName,
      name,
      price: Number(price) || 0,
      image,
    });
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="w-full rounded-xl bg-[#7C4A2D] px-4 py-3 font-semibold text-white transition hover:bg-[#603820]"
    >
      🛒 Ajouter au panier
    </button>
  );
}
