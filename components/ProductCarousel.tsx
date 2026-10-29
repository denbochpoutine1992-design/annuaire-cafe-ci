"use client";

// NB : le nom du fichier est conservé (ProductCarousel) pour ne pas avoir à modifier
// la page d'un commerce. Le composant affiche maintenant une GRILLE de produits
// (2 colonnes sur téléphone), avec le sélecteur de quantité − / + relié au panier.

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { formatFcfa, parseFcfa } from "@/lib/format";

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price?: string | null;
  photoUrl?: string | null;
  stock?: number | null;
};

type Vendor = { id: string; name: string };

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B78B42]";

function ProductCard({
  product,
  vendor,
  accent,
  priority,
}: {
  product: Product;
  vendor: Vendor;
  accent: string;
  priority: boolean;
}) {
  const { items, addToCart, updateQuantity } = useCart();
  const [expanded, setExpanded] = useState(false);

  const price = parseFcfa(product.price);

  // Quantité déjà présente dans le panier pour ce produit
  const quantity =
    items.find((i) => i.productId === product.id && i.vendorId === vendor.id)?.quantity ?? 0;

  // Stock suivi : « épuisé » à 0, et on ne peut pas mettre plus que ce qu'il reste dans le panier
  const stock = typeof product.stock === "number" ? product.stock : null;
  const soldOut = stock !== null && stock <= 0;
  const canAddMore = stock === null || quantity < stock;

  const description = product.description ?? "";
  const isLong = description.length > 70;

  function add() {
    addToCart({
      productId: product.id,
      vendorId: vendor.id,
      vendorName: vendor.name,
      name: product.name,
      price,
      image: product.photoUrl ?? undefined,
    });
  }

  function remove() {
    updateQuantity(product.id, vendor.id, quantity - 1);
  }

  return (
    <li className="flex flex-col rounded-3xl border border-[#E5DDD2] bg-[#F6F0E6] p-2.5 sm:p-3">
      {/* Image carrée : hauteur réservée, pas de saut de mise en page */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white">
        {product.photoUrl ? (
          <Image
            src={product.photoUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-contain p-2"
            loading={priority ? "eager" : "lazy"}
            unoptimized
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center text-5xl"
            style={{ color: accent }}
          >
            ☕
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3">
        <h3 className="font-display line-clamp-2 text-lg font-semibold leading-tight text-[#18120E]">
          {product.name}
        </h3>

        {description && (
          <p
            className={`mt-1.5 text-sm leading-snug text-[#6B5F55] ${
              expanded ? "" : "line-clamp-2"
            }`}
          >
            {description}
          </p>
        )}

        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className={`mt-1.5 self-start text-sm text-[#8A5C20] underline ${FOCUS}`}
          >
            {expanded ? "Réduire" : "Voir les détails"}
          </button>
        )}

        <p className="font-display mt-3 text-xl font-semibold text-[#18120E]">
          {price > 0 ? formatFcfa(price) : "Prix non renseigné"}
        </p>

        {stock !== null && stock > 0 && stock <= 5 && (
          <p className="mt-1 text-xs font-semibold text-[#9A3412]">Plus que {stock} en stock</p>
        )}

        {price > 0 && soldOut && (
          <div className="mt-auto pt-3">
            <p className="rounded-full bg-zinc-200 px-4 py-3 text-center text-sm font-semibold text-zinc-600">
              Épuisé
            </p>
          </div>
        )}

        {/* Sélecteur de quantité : on n'ajoute rien sans prix valide ni sans stock */}
        {price > 0 && !soldOut && (
          <div className="mt-auto pt-3">
            <div className="flex items-center justify-between rounded-full border border-[#CFC4B3] bg-[#FBF8F2] p-1">
              <button
                type="button"
                onClick={remove}
                disabled={quantity === 0}
                aria-label={`Retirer une unité de ${product.name}`}
                className={`flex h-11 w-11 items-center justify-center rounded-full text-xl text-[#18120E] transition disabled:text-[#B9AE9E] ${FOCUS}`}
              >
                −
              </button>

              <span
                className="min-w-[1.5rem] text-center font-semibold text-[#18120E]"
                aria-live="polite"
                aria-label={`Quantité dans le panier : ${quantity}`}
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={add}
                disabled={!canAddMore}
                aria-label={`Ajouter ${product.name} au panier`}
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-[#D8B46A] text-2xl font-medium text-black shadow transition hover:bg-[#C9A052] active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${FOCUS}`}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

export default function ProductCarousel({
  products,
  vendor,
  accent,
}: {
  products: Product[];
  vendor: Vendor;
  accent: string;
}) {
  return (
    <ul
      aria-label={`Produits de ${vendor.name}`}
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          vendor={vendor}
          accent={accent}
          priority={index < 4}
        />
      ))}
    </ul>
  );
}
