"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VendorFormFields, { emptyVendorForm, VendorFormState } from "@/components/VendorFormFields";

export default function NewVendorPage() {
  const router = useRouter();
  const [form, setForm] = useState<VendorFormState>(emptyVendorForm());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = form.name.trim() && form.phone.trim() && form.city;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      setError("Le nom, le téléphone et la ville sont nécessaires.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue.");
      return;
    }
    const vendor = await res.json();
    router.push(`/dashboard/${vendor.id}`);
  }

  return (
    <div className="min-h-screen">
      <nav className="px-6 md:px-12 py-4 border-b border-line">
        <Link href="/dashboard" className="font-mono text-xs uppercase tracking-wide">← Retour</Link>
      </nav>
      <main className="px-6 md:px-12 py-10 max-w-lg mx-auto">
        <h1 className="font-display font-semibold text-2xl">Nouveau commerce</h1>
        <p className="text-sm mt-1" style={{ color: "#8A7355" }}>
          Vous pourrez ajouter des photos une fois la fiche créée.
        </p>
        <form onSubmit={submit} className="mt-6">
          <VendorFormFields form={form} setForm={setForm} />
          {error && <p className="text-xs mt-3" style={{ color: "#B85C38" }}>{error}</p>}
          <button disabled={loading} className="btn-primary font-mono text-sm px-5 py-3 rounded-full mt-5">
            {loading ? "Création..." : "Créer la fiche"}
          </button>
        </form>
      </main>
    </div>
  );
}
