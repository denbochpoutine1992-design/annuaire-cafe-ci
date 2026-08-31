"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
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
    router.push(searchParams.get("next") || "/dashboard");
  }

  return (
    <form onSubmit={submit} className="stitch w-full max-w-sm p-6 bg-paperRaised">
      <h1 className="font-display font-semibold text-2xl">Connexion</h1>
      <p className="text-sm mt-1" style={{ color: "#78716C" }}>
        Accédez à la gestion de votre fiche.
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
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-3 py-2.5 rounded-lg text-sm border border-line"
        />
        {error && <p className="text-xs" style={{ color: "#C2410C" }}>{error}</p>}
        <button disabled={loading} className="btn-primary font-mono text-sm px-5 py-3 rounded-full">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </div>

      <p className="text-xs mt-4" style={{ color: "#78716C" }}>
        Pas de compte ? <Link href="/register" className="underline">Inscrire mon commerce</Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
