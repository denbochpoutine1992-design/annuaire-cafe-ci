"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="stitch w-full max-w-sm p-6 bg-paperRaised">
        <h1 className="font-display font-semibold text-2xl">Créer un compte vendeur</h1>
        <p className="text-sm mt-1" style={{ color: "#78716C" }}>
          Pour gérer votre fiche dans l'annuaire.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2.5 rounded-lg text-sm border border-line"
          />
          <input
            type="password"
            required
            placeholder="Mot de passe (6 caractères min.)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2.5 rounded-lg text-sm border border-line"
          />
          {error && <p className="text-xs" style={{ color: "#C2410C" }}>{error}</p>}
          <button disabled={loading} className="btn-primary font-mono text-sm px-5 py-3 rounded-full">
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </div>

        <p className="text-xs mt-4" style={{ color: "#78716C" }}>
          Déjà un compte ? <Link href="/login" className="underline">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}
