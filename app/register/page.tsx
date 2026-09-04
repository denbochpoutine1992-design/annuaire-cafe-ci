"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (password.length < 6) {
      setError(
        "Le mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Les deux mots de passe ne correspondent pas."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
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
          data.error || "Une erreur est survenue."
        );
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError(
        "Impossible de créer le compte. Vérifiez votre connexion."
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
            href="/login"
            className="text-sm font-semibold"
            style={{
              color: "#52525B",
            }}
          >
            Se connecter
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
              Faites connaître
              <br />
              votre commerce
              <br />
              de café.
            </h1>

            <p
              className="text-base leading-7 mt-5 max-w-md"
              style={{
                color: "#71717A",
              }}
            >
              Créez votre compte professionnel et présentez
              votre activité aux amateurs de café en Côte
              d'Ivoire.
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
                  Présentez votre commerce
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "#FFFFFF",
                  }}
                >
                  📸
                </span>

                <span
                  className="text-sm font-semibold"
                  style={{
                    color: "#3F3F46",
                  }}
                >
                  Ajoutez vos photos et produits
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
                  Recevez des avis de vos clients
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
                Créer votre compte
              </h2>

              <p
                className="text-sm mt-2"
                style={{
                  color: "#71717A",
                }}
              >
                Rejoignez Annuaire Café CI en quelques secondes.
              </p>
            </div>

            <form
              onSubmit={submit}
              className="mt-7 space-y-4"
            >
              {/* EMAIL */}
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="email"
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
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition"
                  style={{
                    border: "1px solid #D4D4D8",
                    background: "#FAFAFA",
                  }}
                />
              </div>

              {/* MOT DE PASSE */}
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Mot de passe
                </label>

                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="6 caractères minimum"
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

                <p
                  className="text-xs mt-2"
                  style={{
                    color: "#A1A1AA",
                  }}
                >
                  Utilisez au minimum 6 caractères.
                </p>
              </div>

              {/* CONFIRMATION */}
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirmer le mot de passe
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Retapez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
                  style={{
                    border:
                      confirmPassword &&
                      confirmPassword !== password
                        ? "1px solid #FCA5A5"
                        : "1px solid #D4D4D8",
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
                  ? "Création du compte..."
                  : "Créer mon compte →"}
              </button>
            </form>

            {/* CONNEXION */}
            <div
              className="mt-6 pt-6 border-t text-center"
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
                Vous avez déjà un compte ?
              </p>

              <Link
                href="/login"
                className="inline-block mt-2 text-sm font-bold"
                style={{
                  color: "#7C4A2D",
                }}
              >
                Se connecter
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
