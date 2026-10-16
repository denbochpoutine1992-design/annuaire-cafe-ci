"use client";

import { useState } from "react";
import ImageUploadField from "./ImageUploadField";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  photoUrl: string | null;
  status?: "PENDING" | "APPROVED" | "REJECTED";
};

const emptyDraft = { name: "", description: "", price: "", photoUrl: "" };

const STATUS_LABEL: Record<string, string> = {
  PENDING: "En attente de validation",
  REJECTED: "Refusé",
};

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
  const [editError, setEditError] = useState("");

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
    setEditError("");
    setEditDraft({
      name: p.name,
      description: p.description || "",
      price: p.price || "",
      photoUrl: p.photoUrl || "",
    });
  }

  async function saveEdit(id: string) {
    setEditError("");
    const res = await fetch(`/api/vendors/${vendorId}/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editDraft),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setEditError(data.error || "Une erreur est survenue.");
      return;
    }
    const updated = await res.json();
    onChange(products.map((p) => (p.id === id ? updated : p)));
    setEditingId(null);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    const res = await fetch(`/api/vendors/${vendorId}/products/${id}`, { method: "DELETE" });
    if (res.ok) onChange(products.filter((p) => p.id !== id));
  }

  return (
    <div>
      <p
        className="mb-4 rounded-lg px-3 py-2 text-xs"
        style={{ background: "#FFF7ED", color: "#9A3412" }}
      >
        Vos nouveaux articles et chaque modification (nom, prix, photo, description) sont visibles
        par les clients après validation par Annuaire Café CI.
      </p>

      <div className="flex flex-col gap-3">
        {products.length === 0 && (
          <p className="text-sm" style={{ color: "#78716C" }}>
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
                {editError && (
                  <p className="text-xs" style={{ color: "#C2410C" }}>
                    {editError}
                  </p>
                )}
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
                    style={{ border: "1px solid #E7E5E4" }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{p.name}</div>
                  {p.status && p.status !== "APPROVED" && (
                    <span
                      className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        background: p.status === "PENDING" ? "#FEF3C7" : "#FEE2E2",
                        color: p.status === "PENDING" ? "#92400E" : "#991B1B",
                      }}
                    >
                      {STATUS_LABEL[p.status]}
                    </span>
                  )}
                  {p.price && (
                    <div className="font-mono text-xs mt-0.5" style={{ color: "#C2410C" }}>
                      {p.price}
                    </div>
                  )}
                  {p.description && (
                    <div className="text-xs mt-1 line-clamp-2" style={{ color: "#57534E" }}>
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
                    style={{ color: "#C2410C" }}
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
        <span className="font-mono text-[11px] uppercase tracking-wide" style={{ color: "#78716C" }}>
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
        {error && <p className="text-xs" style={{ color: "#C2410C" }}>{error}</p>}
        <button disabled={adding} className="btn-primary font-mono text-xs px-4 py-2 rounded-full self-start">
          {adding ? "Ajout..." : "+ Ajouter l'article"}
        </button>
      </form>
    </div>
  );
}
