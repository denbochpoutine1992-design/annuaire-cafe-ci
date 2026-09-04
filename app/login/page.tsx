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

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error || "Email ou mot de passe incorrect."
        );
        setLoading(false);
        return;
      }

      router.push(
        searchParams.get("next") || "/dashboard"
      );
    } catch {
      setError(
        "Impossible de se connecter. Vérifiez votre connexion."
      );
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#F7F7F5",
      }}
    >
      {/* NAVIGATION */}
      <nav
        className="bg-white border-b"
        style={{
          borderColor: "#E4E4E7",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-black"
            style={{
              color: "#18181B",
            }}
          >
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{
                background: "#18181B",
              }}
            >
              ☕
            </span>

            <span>Annuaire Café CI</span>
          </Link>

          <Link
            href="/register"
            className="text-sm font-semibold"
            style={{
              color: "#52525B",
            }}
          >
            Créer un compte
          </Link>
        </div>
      </nav>

      {/* CONTENU */}
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
          
          {/* PRÉSENTATION */}
          <div className="hidden lg:block">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: "#F4EDE7",
                color: "#7C4A2D",
              }}
            >
              ☕ ESPACE PROFESSIONNEL
            </div>

            <h1
              className="text-5xl font-black leading-tight mt-5"
              style={{
                color: "#18181B",
              }}
            >
              Bienvenue
              <br />
              dans votre espace
              <br />
              professionnel.
            </h1>

            <p
              className="text-base leading-7 mt-5 max-w-md"
              style={{
                color: "#71717A",
              }}
            >
              Gérez votre commerce, vos photos, vos produits
              et consultez les avis de vos clients depuis votre
              espace professionnel.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "#FFFFFF",
                  }}
                >
                  🏪
                </span>

                <span
                  className="text-sm font-semibold"
                  style={{
                    color: "#3F3F46",
                  }}
                >
                  Gérez votre commerce
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "#FFFFFF",
                  }}
                >
                  ☕
                </span>

                <span
                  className="text-sm font-semibold"
                  style={{
                    color: "#3F3F46",
                  }}
                >
                  Présentez vos produits
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "#FFFFFF",
                  }}
                >
                  ⭐
                </span>

                <span
                  className="text-sm font-semibold"
                  style={{
                    color: "#3F3F46",
                  }}
                >
                  Suivez vos avis clients
                </span>
              </div>
            </div>
          </div>

          {/* FORMULAIRE */}
          <div
            className="bg-white rounded-3xl p-6 md:p-8"
            style={{
              border: "1px solid #E4E4E7",
              boxShadow:
                "0 25px 60px -35px rgba(24,24,27,.35)",
            }}
          >
            <div className="text-center">
              <div
                className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  background: "#F4EDE7",
                }}
              >
                ☕
              </div>

              <h2
                className="text-2xl md:text-3xl font-black mt-5"
                style={{
                  color: "#18181B",
                }}
              >
                Connexion
              </h2>

              <p
                className="text-sm mt-2"
                style={{
                  color: "#71717A",
                }}
              >
                Accédez à votre espace professionnel.
              </p>
            </div>

            <form
              onSubmit={submit}
              className="mt-7 space-y-5"
            >
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold mb-2"
                >
                  Adresse email
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
                  style={{
                    border: "1px solid #D4D4D8",
                    background: "#FAFAFA",
                  }}
                />
              </div>

              {/* MOT DE PASSE */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-bold"
                  >
                    Mot de passe
                  </label>
                </div>

                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
                  style={{
                    border: "1px solid #D4D4D8",
                    background: "#FAFAFA",
                  }}
                />
              </div>

              {/* ERREUR */}
              {error && (
                <div
                  className="rounded-xl px-4 py-3 text-sm font-medium"
                  style={{
                    background: "#FEF2F2",
                    color: "#B91C1C",
                    border: "1px solid #FECACA",
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              {/* BOUTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-sm font-bold text-white transition disabled:opacity-50"
                style={{
                  background: "#18181B",
                }}
              >
                {loading
                  ? "Connexion..."
                  : "Se connecter →"}
              </button>
            </form>

            {/* INSCRIPTION */}
            <div
              className="mt-7 pt-6 border-t text-center"
              style={{
                borderColor: "#F4F4F5",
              }}
            >
              <p
                className="text-sm"
                style={{
                  color: "#71717A",
                }}
              >
                Vous n'avez pas encore de compte ?
              </p>

              <Link
                href="/register"
                className="inline-block mt-2 text-sm font-bold"
                style={{
                  color: "#7C4A2D",
                }}
              >
                Inscrire mon commerce
              </Link>
            </div>

            {/* RETOUR */}
            <Link
              href="/"
              className="block text-center text-xs mt-6"
              style={{
                color: "#A1A1AA",
              }}
            >
              ← Retour à l'annuaire
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className="py-6 text-center text-xs"
        style={{
          background: "#18181B",
          color: "#71717A",
        }}
      >
        © {new Date().getFullYear()} Annuaire Café CI
      </footer>
    </div>
  );
}
