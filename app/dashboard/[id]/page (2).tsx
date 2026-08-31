"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import VendorFormFields, { emptyVendorForm, VendorFormState } from "@/components/VendorFormFields";
import PhotoUploader from "@/components/PhotoUploader";
import ProductManager from "@/components/ProductManager";

export default function EditVendorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<VendorFormState>(emptyVendorForm());
  const [photos, setPhotos] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/vendors/${id}`)
      .then((r) => r.json())
      .then((v) => {
        setForm({
          name: v.name || "",
          category: v.category,
          city: v.city,
          neighborhood: v.neighborhood || "",
          phone: v.phone || "",
          description: v.description || "",
          priceInfo: v.priceInfo || "",
          latitude: v.latitude,
          longitude: v.longitude,
        });
        setPhotos(v.photos || []);
        setProducts(v.products || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch(`/api/vendors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue.");
      return;
    }
    router.push("/dashboard");
  }

  async function deleteVendor() {
    if (!confirm("Supprimer définitivement cette fiche ?")) return;
    await fetch(`/api/vendors/${id}`, { method: "DELETE" });
    router.push("/dashboard");
  }

  async function deletePhoto(photoId: string) {
    await fetch(`/api/vendors/${id}/photos`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId }),
    });
    setPhotos((p) => p.filter((ph) => ph.id !== photoId));
  }

  if (loading) {
    return <p className="p-10 font-mono text-sm" style={{ color: "#78716C" }}>Chargement...</p>;
  }

  return (
    <div className="min-h-screen">
      <nav className="px-6 md:px-12 py-4 border-b border-line flex items-center justify-between">
        <Link href="/dashboard" className="font-mono text-xs uppercase tracking-wide">← Retour</Link>
        <Link href={`/vendors/${id}`} className="font-mono text-xs uppercase tracking-wide" style={{ color: "#C2410C" }}>
          Voir la fiche publique →
        </Link>
      </nav>
      <main className="px-6 md:px-12 py-10 max-w-lg mx-auto">
        <h1 className="font-display font-semibold text-2xl">Modifier le commerce</h1>

        <div className="mt-6">
          <span className="font-mono text-[11px] uppercase tracking-wide" style={{ color: "#78716C" }}>
            Photos
          </span>
          <div className="flex flex-wrap gap-3 mt-2">
            {photos.map((p) => (
              <div key={p.id} className="relative">
                <img src={p.url} alt="" className="w-24 h-24 object-cover rounded-md border border-line" />
                <button
                  onClick={() => deletePhoto(p.id)}
                  className="absolute -top-2 -right-2 bg-clay text-white rounded-full w-6 h-6 text-xs"
                  style={{ background: "#C2410C", color: "#FFFFFF" }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <PhotoUploader vendorId={id} onUploaded={(url) => setPhotos((p) => [...p, { id: url, url }])} />
          </div>
        </div>

        <form onSubmit={submit} className="mt-8">
          <VendorFormFields form={form} setForm={setForm} />
          {error && <p className="text-xs mt-3" style={{ color: "#C2410C" }}>{error}</p>}
          <div className="flex items-center gap-3 mt-5">
            <button disabled={saving} className="btn-primary font-mono text-sm px-5 py-3 rounded-full">
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={deleteVendor}
              className="font-mono text-sm px-5 py-3 rounded-full border border-line"
              style={{ color: "#C2410C" }}
            >
              Supprimer la fiche
            </button>
          </div>
        </form>

        <div className="mt-12 pt-8" style={{ borderTop: "1px solid #E7E5E4" }}>
          <h2 className="font-display font-semibold text-xl">Mes articles</h2>
          <p className="text-sm mt-1 mb-4" style={{ color: "#78716C" }}>
            Ajoutez les produits que vous vendez (café moulu, capsules, grains...). Ils
            s'afficheront sur votre fiche publique.
          </p>
          <ProductManager vendorId={id} products={products} onChange={setProducts} />
        </div>
      </main>
    </div>
  );
}
