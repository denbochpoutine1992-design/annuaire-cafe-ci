"use client";

import { useState } from "react";
import ImageUploadField from "./ImageUploadField";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  photoUrl: string | null;
};

const emptyDraft = { name: "", description: "", price: "", photoUrl: "" };

export default function ProductManager({
  vendorId,
  products,
  onChange,
}: {
  vendorId: string;
  products: Product[];
  onChange: (products: Product[]) => void;
}) {
  const [draft, setDraft] = useState(emptyDraft);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState(emptyDraft);

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim()) {
      setError("Le nom de l'article est requis.");
      return;
    }
    setAdding(true);
    setError("");
    const res = await fetch(`/api/vendors/${vendorId}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setAdding(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue.");
      return;
    }
    const product = await res.json();
    onChange([product, ...products]);
    setDraft(emptyDraft);
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setEditDraft({
      name: p.name,
      description: p.description || "",
      price: p.price || "",
      photoUrl: p.photoUrl || "",
    });
  }

  async function saveEdit(id: string) {
    const res = await fetch(`/api/vendors/${vendorId}/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editDraft),
    });
    if (!res.ok) return;
    const updated = await res.json();
    onChange(products.map((p) => (p.id === id ? updated : p)));
    setEditingId(null);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    await fetch(`/api/vendors/${vendorId}/products/${id}`, { method: "DELETE" });
    onChange(products.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        {products.length === 0 && (
          <p className="text-sm" style={{ color: "#8A7355" }}>
            Aucun article pour l'instant. Ajoutez vos produits ci-dessous.
          </p>
        )}

        {products.map((p) => (
          <div key={p.id} className="stitch bg-paperRaised p-3">
            {editingId === p.id ? (
              <div className="flex flex-col gap-2">
                <ImageUploadField
                  value={editDraft.photoUrl}
                  onChange={(url) => setEditDraft({ ...editDraft, photoUrl: url })}
                />
                <input
                  value={editDraft.name}
                  onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                  placeholder="Nom de l'article"
                  className="px-3 py-2 rounded-lg text-sm border border-line"
                />
                <input
                  value={editDraft.price}
                  onChange={(e) => setEditDraft({ ...editDraft, price: e.target.value })}
                  placeholder="Prix (ex : 2000 FCFA)"
                  className="px-3 py-2 rounded-lg text-sm border border-line"
                />
                <textarea
                  value={editDraft.description}
                  onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })}
                  placeholder="Description (optionnel)"
                  rows={2}
                  className="px-3 py-2 rounded-lg text-sm border border-line resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(p.id)}
                    className="btn-primary font-mono text-xs px-4 py-2 rounded-full"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="font-mono text-xs px-4 py-2 rounded-full border border-line"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {p.photoUrl && (
                  <img
                    src={p.photoUrl}
                    alt={p.name}
                    className="w-14 h-14 object-cover rounded-md shrink-0"
                    style={{ border: "1px solid #DCC79E" }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{p.name}</div>
                  {p.price && (
                    <div className="font-mono text-xs mt-0.5" style={{ color: "#B85C38" }}>
                      {p.price}
                    </div>
                  )}
                  {p.description && (
                    <div className="text-xs mt-1 line-clamp-2" style={{ color: "#7A6449" }}>
                      {p.description}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(p)}
                    className="font-mono text-xs px-3 py-1.5 rounded-full border border-line"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="font-mono text-xs px-3 py-1.5 rounded-full border border-line"
                    style={{ color: "#B85C38" }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={addProduct} className="stitch p-4 mt-4 flex flex-col gap-3">
        <span className="font-mono text-[11px] uppercase tracking-wide" style={{ color: "#8A7355" }}>
          Ajouter un article
        </span>
        <ImageUploadField
          value={draft.photoUrl}
          onChange={(url) => setDraft({ ...draft, photoUrl: url })}
        />
        <input
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          placeholder="Nom de l'article (ex : Café moulu Robusta 500g)"
          className="px-3 py-2 rounded-lg text-sm border border-line"
        />
        <input
          value={draft.price}
          onChange={(e) => setDraft({ ...draft, price: e.target.value })}
          placeholder="Prix (ex : 2000 FCFA)"
          className="px-3 py-2 rounded-lg text-sm border border-line"
        />
        <textarea
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="Description (optionnel)"
          rows={2}
          className="px-3 py-2 rounded-lg text-sm border border-line resize-none"
        />
        {error && <p className="text-xs" style={{ color: "#B85C38" }}>{error}</p>}
        <button disabled={adding} className="btn-primary font-mono text-xs px-4 py-2 rounded-full self-start">
          {adding ? "Ajout..." : "+ Ajouter l'article"}
        </button>
      </form>
    </div>
  );
}
