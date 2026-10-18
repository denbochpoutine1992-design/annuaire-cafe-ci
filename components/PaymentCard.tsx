"use client";

import { useState } from "react";
import { formatFcfa } from "@/lib/format";
import type { PaymentInstructions } from "@/lib/payment";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B78B42]";

/** Écran affiché après une commande payée par Mobile Money. */
export default function PaymentCard({
  reference,
  totalFcfa,
  buyerPhone,
  payment,
}: {
  reference: string;
  totalFcfa: number;
  buyerPhone: string;
  payment: PaymentInstructions;
}) {
  const [txRef, setTxRef] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(payment.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* le client peut recopier le numéro à la main */
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setError("");
    setState("sending");

    try {
      const res = await fetch("/api/orders/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, buyerPhone, paymentRef: txRef }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? "Impossible d'enregistrer l'identifiant. Réessayez.");
        setState("idle");
        return;
      }
      setState("sent");
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau, puis réessayez.");
      setState("idle");
    }
  }

  return (
    <section role="status" className="mt-6 rounded-2xl border border-[#E7C780] bg-[#FFF9EA] p-5">
      <p className="text-lg font-semibold text-[#5C4310]">
        Commande {reference} enregistrée : il reste à payer
      </p>

      <ol className="mt-3 list-decimal space-y-2 pl-5 text-[#4A3A10]">
        <li>
          Ouvrez <strong>{payment.label}</strong> sur votre téléphone.
        </li>
        <li>
          Envoyez <strong>{formatFcfa(totalFcfa)}</strong> au numéro{" "}
          <strong className="whitespace-nowrap">{payment.number}</strong>.
        </li>
        <li>
          Vérifiez que le nom du bénéficiaire est <strong>{payment.accountName}</strong> avant de
          confirmer.
        </li>
        <li>Notez l’identifiant de la transaction reçu par SMS, puis saisissez-le ci-dessous.</li>
      </ol>

      <button
        type="button"
        onClick={copyNumber}
        className={`mt-3 rounded-full border border-[#D9B864] px-4 py-2 text-sm font-medium text-[#5C4310] transition hover:bg-white ${FOCUS}`}
      >
        {copied ? "Numéro copié ✓" : "Copier le numéro"}
      </button>

      {state === "sent" ? (
        <p className="mt-4 rounded-xl bg-[#EEF9F2] px-4 py-3 text-[#0F5A31]">
          ✓ Merci ! Nous vérifions votre paiement, puis nous préparons votre commande et vous
          appelons pour la livraison.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <label htmlFor="tx-ref" className="mb-1.5 block text-sm font-medium text-[#18120E]">
              Identifiant de la transaction
            </label>
            <input
              id="tx-ref"
              required
              value={txRef}
              onChange={(e) => setTxRef(e.target.value)}
              maxLength={40}
              autoComplete="off"
              className="h-12 w-full rounded-xl border border-[#D9CFC1] bg-white px-4 text-base text-[#18120E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B78B42]"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={state === "sending"}
            className={`rounded-full bg-[#21150F] px-6 py-3 font-semibold text-white transition hover:bg-black disabled:opacity-60 ${FOCUS}`}
          >
            {state === "sending" ? "Envoi…" : "J’ai payé"}
          </button>
        </form>
      )}

      <p className="mt-3 text-sm text-[#6B5A2A]">
        Gardez votre référence : <strong>{reference}</strong>. Votre commande n’est préparée
        qu’après vérification du paiement.
      </p>
    </section>
  );
}
