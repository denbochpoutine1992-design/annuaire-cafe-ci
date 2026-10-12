"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { formatFcfa, parseFcfa } from "@/lib/format";

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price?: string | null;
  photoUrl?: string | null;
};

/**
 * Carrousel horizontal 100 % CSS pour le défilement (scroll-snap) :
 * - au doigt sur mobile, sans JavaScript ;
 * - boutons précédent/suivant sur ordinateur (le JS ne fait que déplacer le défilement).
 */
export default function ProductCarousel({
  products,
  vendor,
  accent,
}: {
  products: Product[];
  vendor: { id: string; name: string };
  accent: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const start = el.scrollLeft <= 4;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setEdge((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update, products.length]);

  function scrollPage(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: reduce ? "auto" : "smooth" });
  }

  const arrow =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-xl shadow-md transition hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-0 md:flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B78B42]";

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Produits précédents"
        disabled={edge.start}
        onClick={() => scrollPage(-1)}
        className={`${arrow} -left-3`}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Produits suivants"
        disabled={edge.end}
        onClick={() => scrollPage(1)}
        className={`${arrow} -right-3`}
      >
        ›
      </button>

      <ul
        ref={trackRef}
        onScroll={update}
        tabIndex={0}
        aria-label={`Produits de ${vendor.name}`}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-4 motion-reduce:scroll-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p, index) => {
          const price = parseFcfa(p.price);
          return (
            <li
              key={p.id}
              className="flex w-[72%] min-w-[220px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white sm:w-[46%] lg:w-[31%]"
            >
              {/* Hauteur réservée (carré) : pas de saut de mise en page au chargement */}
              <div className="relative aspect-square bg-zinc-100">
                {p.photoUrl ? (
                  <Image
                    src={p.photoUrl}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 300px, 72vw"
                    className="object-contain p-3"
                    loading={index < 2 ? "eager" : "lazy"}
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

              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-base font-bold leading-tight text-zinc-900">
                  {p.name}
                </h3>

                {p.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-snug text-zinc-600">
                    {p.description}
                  </p>
                )}

                <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                  <p className="text-base font-black text-zinc-900">
                    {price > 0 ? formatFcfa(price) : "Prix non renseigné"}
                  </p>

                  {/* Pas d'ajout au panier sans prix valide */}
                  {price > 0 && (
                    <AddToCartButton
                      productId={p.id}
                      vendorId={vendor.id}
                      vendorName={vendor.name}
                      name={p.name}
                      price={price}
                      image={p.photoUrl}
                    />
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {!edge.end && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent"
        />
      )}
    </div>
  );
}
