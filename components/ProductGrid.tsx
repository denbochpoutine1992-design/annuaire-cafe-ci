import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: string | null;
  photoUrl: string | null;
  vendorId: string;
  vendorName: string;
};

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="font-semibold text-xl" style={{ color: "#18181B" }}>
        Produits disponibles
      </h2>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {products.map((p) => (
          <Link key={p.id} href={`/vendors/${p.vendorId}`} className="product-tile block">
            <div className="product-tile-image">
              {p.photoUrl ? (
                <img src={p.photoUrl} alt={p.name} />
              ) : (
                <span style={{ fontSize: 13 }}>☕</span>
              )}
            </div>
            <div className="p-2.5">
              <div className="font-semibold text-[13px] leading-snug" style={{ color: "#18181B" }}>
                {p.name}
              </div>
              {p.price && (
                <div className="font-bold text-[13px] mt-1.5" style={{ color: "#18181B" }}>
                  {p.price}
                </div>
              )}
              <div className="text-[11px] mt-1 truncate" style={{ color: "#71717A" }}>
                🏪 {p.vendorName}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
