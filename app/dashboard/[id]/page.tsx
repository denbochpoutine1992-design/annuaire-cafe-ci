"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import VendorFormFields, {
  emptyVendorForm,
  VendorFormState,
} from "@/components/VendorFormFields";

import PhotoUploader from "@/components/PhotoUploader";
import ProductManager from "@/components/ProductManager";

export default function EditVendorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] =
    useState<VendorFormState>(emptyVendorForm());

  const [photos, setPhotos] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);

    const res = await fetch(`/api/vendors/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();

      setError(
        data.error || "Une erreur est survenue."
      );

      return;
    }

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3500);
  }

  async function deleteVendor() {
    if (
      !confirm(
        "Supprimer définitivement cette fiche ? Cette action est irréversible."
      )
    ) {
      return;
    }

    await fetch(`/api/vendors/${id}`, {
      method: "DELETE",
    });

    router.push("/dashboard");
  }

  async function deletePhoto(photoId: string) {
    if (!confirm("Supprimer cette photo ?")) return;

    const res = await fetch(`/api/vendors/${id}/photos`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        photoId,
      }),
    });

    if (res.ok) {
      setPhotos((p) =>
        p.filter((ph) => ph.id !== photoId)
      );
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "#F7F7F5",
        }}
      >
        <div className="text-center">
          <div className="text-5xl mb-4">☕</div>

          <p
            className="text-sm"
            style={{
              color: "#71717A",
            }}
          >
            Chargement de votre espace...
          </p>
        </div>
      </div>
    );
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
        className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b"
        style={{
          borderColor: "#E4E4E7",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-bold"
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

            <span className="hidden sm:block">
              Mon espace professionnel
            </span>
          </Link>

          <Link
            href={`/vendors/${id}`}
            target="_blank"
            className="px-4 py-2.5 rounded-full text-xs md:text-sm font-bold"
            style={{
              background: "#18181B",
              color: "#FFFFFF",
            }}
          >
            👁️ Voir ma fiche
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="max-w-6xl mx-auto px-5 md:px-8 pt-8 md:pt-12">
        <Link
          href="/dashboard"
          className="text-sm font-semibold"
          style={{
            color: "#71717A",
          }}
        >
          ← Retour au tableau de bord
        </Link>

        <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{
                color: "#C2410C",
              }}
            >
              Gestion du commerce
            </p>

            <h1
              className="text-3xl md:text-4xl font-black mt-2"
              style={{
                color: "#18181B",
              }}
            >
              Modifier ma fiche
            </h1>

            <p
              className="mt-2 text-sm md:text-base"
              style={{
                color: "#71717A",
              }}
            >
              Présentez votre commerce de manière professionnelle
              aux visiteurs de l'annuaire.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* CONTENU */}
          <div className="space-y-6">
            {/* INFORMATIONS */}
            <section
              className="bg-white rounded-3xl p-6 md:p-8"
              style={{
                border: "1px solid #E4E4E7",
                boxShadow:
                  "0 15px 40px -30px rgba(24,24,27,.35)",
              }}
            >
              <div className="mb-6">
                <div
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{
                    color: "#C2410C",
                  }}
                >
                  01 · Informations
                </div>

                <h2 className="text-xl md:text-2xl font-black mt-1">
                  Présentation du commerce
                </h2>

                <p
                  className="text-sm mt-2"
                  style={{
                    color: "#71717A",
                  }}
                >
                  Vérifiez et mettez à jour les informations
                  visibles par vos clients.
                </p>
              </div>

              <form onSubmit={submit}>
                <VendorFormFields
                  form={form}
                  setForm={setForm}
                />

                {error && (
                  <div
                    className="mt-5 rounded-2xl px-4 py-3 text-sm font-medium"
                    style={{
                      background: "#FEF2F2",
                      color: "#B91C1C",
                      border: "1px solid #FECACA",
                    }}
                  >
                    ⚠️ {error}
                  </div>
                )}

                {success && (
                  <div
                    className="mt-5 rounded-2xl px-4 py-3 text-sm font-semibold"
                    style={{
                      background: "#F0FDF4",
                      color: "#166534",
                      border: "1px solid #BBF7D0",
                    }}
                  >
                    ✓ Votre fiche a été enregistrée avec succès.
                  </div>
                )}

                <div
                  className="mt-7 pt-6 border-t flex flex-col sm:flex-row gap-3"
                  style={{
                    borderColor: "#F4F4F5",
                  }}
                >
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-3.5 rounded-2xl text-sm font-bold text-white disabled:opacity-50"
                    style={{
                      background: "#18181B",
                    }}
                  >
                    {saving
                      ? "Enregistrement..."
                      : "💾 Enregistrer les modifications"}
                  </button>

                  <Link
                    href={`/vendors/${id}`}
                    target="_blank"
                    className="px-6 py-3.5 rounded-2xl text-sm font-bold text-center"
                    style={{
                      background: "#F4F4F5",
                      color: "#18181B",
                    }}
                  >
                    👁️ Aperçu
                  </Link>
                </div>
              </form>
            </section>

            {/* PHOTOS */}
            <section
              className="bg-white rounded-3xl p-6 md:p-8"
              style={{
                border: "1px solid #E4E4E7",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                <div>
                  <div
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{
                      color: "#C2410C",
                    }}
                  >
                    02 · Images
                  </div>

                  <h2 className="text-xl md:text-2xl font-black mt-1">
                    Photos du commerce
                  </h2>

                  <p
                    className="text-sm mt-2"
                    style={{
                      color: "#71717A",
                    }}
                  >
                    Des photos de qualité rendent votre fiche
                    plus attractive.
                  </p>
                </div>

                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full w-fit"
                  style={{
                    background: "#F4F4F5",
                    color: "#52525B",
                  }}
                >
                  {photos.length} photo
                  {photos.length > 1 ? "s" : ""}
                </span>
              </div>

              {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map((p, index) => (
                    <div
                      key={p.id}
                      className="relative group aspect-square overflow-hidden rounded-2xl"
                      style={{
                        background: "#F4F4F5",
                      }}
                    >
                      <img
                        src={p.url}
                        alt={`${form.name} - photo ${
                          index + 1
                        }`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {index === 0 && (
                        <span
                          className="absolute left-2 bottom-2 px-2.5 py-1 rounded-full text-[10px] font-bold"
                          style={{
                            background:
                              "rgba(0,0,0,.72)",
                            color: "#fff",
                          }}
                        >
                          PHOTO PRINCIPALE
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          deletePhoto(p.id)
                        }
                        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background: "#DC2626",
                          color: "#FFFFFF",
                        }}
                        aria-label="Supprimer la photo"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-2xl py-10 text-center"
                  style={{
                    background: "#FAFAFA",
                    border: "1px dashed #D4D4D8",
                  }}
                >
                  <div className="text-4xl mb-3">
                    🖼️
                  </div>

                  <p className="font-semibold text-sm">
                    Aucune photo pour le moment
                  </p>

                  <p
                    className="text-xs mt-1"
                    style={{
                      color: "#A1A1AA",
                    }}
                  >
                    Ajoutez des photos pour mettre votre commerce
                    en valeur.
                  </p>
                </div>
              )}

              <div
                className="mt-6 pt-6 border-t"
                style={{
                  borderColor: "#F4F4F5",
                }}
              >
                <PhotoUploader
                  vendorId={id}
                  onUploaded={(url) =>
                    setPhotos((p) => [
                      ...p,
                      {
                        id: url,
                        url,
                      },
                    ])
                  }
                />
              </div>
            </section>

            {/* PRODUITS */}
            <section
              className="bg-white rounded-3xl p-6 md:p-8"
              style={{
                border: "1px solid #E4E4E7",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                <div>
                  <div
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{
                      color: "#C2410C",
                    }}
                  >
                    03 · Catalogue
                  </div>

                  <h2 className="text-xl md:text-2xl font-black mt-1">
                    Mes produits
                  </h2>

                  <p
                    className="text-sm mt-2"
                    style={{
                      color: "#71717A",
                    }}
                  >
                    Présentez vos cafés, capsules, grains et
                    autres produits.
                  </p>
                </div>

                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full w-fit"
                  style={{
                    background: "#F4F4F5",
                    color: "#52525B",
                  }}
                >
                  {products.length} article
                  {products.length > 1 ? "s" : ""}
                </span>
              </div>

              <ProductManager
                vendorId={id}
                products={products}
                onChange={setProducts}
              />
            </section>

            {/* ZONE DANGER */}
            <section
              className="rounded-3xl p-6 md:p-8"
              style={{
                background: "#FFF7ED",
                border: "1px solid #FED7AA",
              }}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">
                  ⚠️
                </div>

                <div className="flex-1">
                  <h2
                    className="font-black"
                    style={{
                      color: "#9A3412",
                    }}
                  >
                    Zone de suppression
                  </h2>

                  <p
                    className="text-sm mt-1 leading-6"
                    style={{
                      color: "#7C2D12",
                    }}
                  >
                    La suppression de votre fiche est
                    définitive. Toutes les informations associées
                    pourront être supprimées.
                  </p>

                  <button
                    type="button"
                    onClick={deleteVendor}
                    className="mt-4 px-5 py-3 rounded-xl text-sm font-bold"
                    style={{
                      background: "#FFFFFF",
                      color: "#B91C1C",
                      border: "1px solid #FDBA74",
                    }}
                  >
                    Supprimer définitivement la fiche
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* COLONNE DROITE */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            {/* APERÇU */}
            <div
              className="rounded-3xl p-5 md:p-6 text-white overflow-hidden relative"
              style={{
                background:
                  "linear-gradient(145deg, #18181B, #292524)",
              }}
            >
              <div
                className="absolute -right-10 -top-10 w-32 h-32 rounded-full"
                style={{
                  background:
                    "rgba(255,255,255,.05)",
                }}
              />

              <div className="relative">
                <div className="text-4xl mb-5">
                  ☕
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Votre commerce
                </p>

                <h2 className="text-xl font-black mt-1">
                  {form.name || "Votre commerce"}
                </h2>

                <p className="text-sm text-zinc-400 mt-2">
                  {form.city || "Ville non renseignée"}
                </p>

                <Link
                  href={`/vendors/${id}`}
                  target="_blank"
                  className="flex items-center justify-center mt-6 w-full py-3 rounded-xl text-sm font-bold"
                  style={{
                    background: "#FFFFFF",
                    color: "#18181B",
                  }}
                >
                  Voir la fiche publique →
                </Link>
              </div>
            </div>

            {/* CONSEILS */}
            <div
              className="bg-white rounded-3xl p-5 md:p-6"
              style={{
                border: "1px solid #E4E4E7",
              }}
            >
              <h3 className="font-black">
                💡 Conseils
              </h3>

              <div className="space-y-4 mt-5">
                <div className="flex gap-3">
                  <span>📸</span>

                  <p
                    className="text-xs leading-5"
                    style={{
                      color: "#71717A",
                    }}
                  >
                    Ajoutez plusieurs photos de qualité pour
                    donner envie aux visiteurs.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span>☕</span>

                  <p
                    className="text-xs leading-5"
                    style={{
                      color: "#71717A",
                    }}
                  >
                    Ajoutez vos produits avec leurs prix et
                    descriptions.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span>📍</span>

                  <p
                    className="text-xs leading-5"
                    style={{
                      color: "#71717A",
                    }}
                  >
                    Vérifiez que votre ville et votre quartier
                    sont correctement renseignés.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span>⭐</span>

                  <p
                    className="text-xs leading-5"
                    style={{
                      color: "#71717A",
                    }}
                  >
                    Encouragez vos clients à laisser un avis sur
                    votre fiche.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className="border-t mt-4"
        style={{
          borderColor: "#E4E4E7",
          background: "#FFFFFF",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 flex flex-col md:flex-row justify-between gap-3 text-xs">
          <p
            style={{
              color: "#71717A",
            }}
          >
            © {new Date().getFullYear()} Annuaire Café CI
          </p>

          <Link
            href="/dashboard"
            className="font-semibold"
            style={{
              color: "#18181B",
            }}
          >
            ← Retour au tableau de bord
          </Link>
        </div>
      </footer>
    </div>
  );
}
