"use client";

import { useState } from "react";
import StarRating from "@/components/StarRating";

export default function ReviewsSection({
  vendorId,
  reviews,
  avgRating,
  accent,
  onSubmitted,
}: {
  vendorId: string;
  reviews: any[];
  avgRating: number;
  accent: string;
  onSubmitted: () => void;
}) {
  const [reviewForm, setReviewForm] = useState({
    authorName: "",
    rating: 5,
    comment: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();

    if (!reviewForm.authorName.trim()) {
      setReviewError("Votre nom est requis.");
      return;
    }

    setSubmitting(true);
    setReviewError("");

    const res = await fetch(`/api/vendors/${vendorId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewForm),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setReviewError(data.error || "Une erreur est survenue.");
      return;
    }

    setReviewForm({
      authorName: "",
      rating: 5,
      comment: "",
    });

    onSubmitted();
  }

  return (
    <section
      className="bg-white rounded-3xl p-6 md:p-8"
      style={{
        border: "1px solid #E4E4E7",
      }}
    >
      <div className="mb-6">
        <p
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: accent }}
        >
          Expériences clients
        </p>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-black mt-1">
            Avis clients
          </h2>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating
                value={avgRating}
                size={18}
              />

              <span className="font-bold">
                {avgRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* FORMULAIRE */}
      <form
        onSubmit={submitReview}
        className="rounded-2xl p-5 mb-6"
        style={{
          background: "#FAFAFA",
          border: "1px solid #E4E4E7",
        }}
      >
        <h3 className="font-bold mb-4">
          Partagez votre expérience
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            value={reviewForm.authorName}
            onChange={(e) =>
              setReviewForm({
                ...reviewForm,
                authorName: e.target.value,
              })
            }
            placeholder="Votre nom"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              border: "1px solid #D4D4D8",
              background: "#fff",
            }}
          />

          <div
            className="flex items-center justify-center rounded-xl px-4"
            style={{
              background: "#fff",
              border: "1px solid #D4D4D8",
            }}
          >
            <StarRating
              value={reviewForm.rating}
              interactive
              size={22}
              onChange={(value) =>
                setReviewForm({
                  ...reviewForm,
                  rating: value,
                })
              }
            />
          </div>
        </div>

        <textarea
          value={reviewForm.comment}
          onChange={(e) =>
            setReviewForm({
              ...reviewForm,
              comment: e.target.value,
            })
          }
          placeholder="Votre avis (optionnel)"
          rows={4}
          className="w-full mt-4 px-4 py-3 rounded-xl text-sm outline-none resize-none"
          style={{
            border: "1px solid #D4D4D8",
            background: "#fff",
          }}
        />

        {reviewError && (
          <p
            className="text-sm mt-3"
            style={{ color: "#DC2626" }}
          >
            {reviewError}
          </p>
        )}

        <button
          disabled={submitting}
          className="mt-4 px-5 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50"
          style={{
            background: accent,
          }}
        >
          {submitting
            ? "Publication..."
            : "⭐ Publier mon avis"}
        </button>
      </form>

      {/* LISTE DES AVIS */}
      <div className="space-y-4">
        {reviews.length === 0 && (
          <div
            className="text-center py-8 rounded-2xl"
            style={{
              background: "#FAFAFA",
            }}
          >
            <div className="text-3xl mb-2">💬</div>

            <p
              className="text-sm"
              style={{ color: "#71717A" }}
            >
              Aucun avis pour l'instant.
            </p>

            <p
              className="text-sm mt-1"
              style={{ color: "#A1A1AA" }}
            >
              Soyez le premier à partager votre
              expérience.
            </p>
          </div>
        )}

        {reviews.map((r: any) => (
          <div
            key={r.id}
            className="rounded-2xl p-5"
            style={{
              background: "#FAFAFA",
              border: "1px solid #E4E4E7",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                  style={{
                    background: accent,
                  }}
                >
                  {r.authorName
                    ?.charAt(0)
                    ?.toUpperCase() || "?"}
                </div>

                <div>
                  <div
                    className="font-bold text-sm"
                    style={{ color: "#18181B" }}
                  >
                    {r.authorName}
                  </div>

                  <div
                    className="text-xs mt-1"
                    style={{ color: "#A1A1AA" }}
                  >
                    Avis client
                  </div>
                </div>
              </div>

              <StarRating value={r.rating} />
            </div>

            {r.comment && (
              <p
                className="text-sm leading-6 mt-4"
                style={{ color: "#52525B" }}
              >
                “{r.comment}”
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
