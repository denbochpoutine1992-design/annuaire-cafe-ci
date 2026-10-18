"use client";

import { useEffect, useState } from "react";
import { VILLES } from "@/lib/constants";
import { formatFcfa } from "@/lib/format";
import type { VendorGroup } from "@/components/CartProvider";
import type { PaymentInstructions, PaymentMethod } from "@/lib/payment";

export type OrderDone = {
  reference: string;
  totalFcfa: number;
  vendorName: string;
  buyerPhone: string;
  payment: PaymentInstructions | null;
};

const STORAGE_KEY = "annuairecafe-buyer";

const FIELD =
  "h-12 w-full rounded-xl border border-[#D9CFC1] bg-white px-4 text-base text-[#18120E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B78B42]";

export default function CheckoutForm({
  group,
  methods = [{ id: "CASH", label: "Payer à la livraison" }],
  onDone,
  onCancel,
}: {
  group: VendorGroup;
  methods?: PaymentMethod[];
  onDone: (info: OrderDone) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [method, setMethod] = useState<string>(methods[0]?.id ?? "CASH");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Préremplissage avec les coordonnées de la dernière commande (sur cet appareil)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved && typeof saved === "object") {
        if (typeof saved.name === "string") setName(saved.name);
        if (typeof saved.phone === "string") setPhone(saved.phone);
        if (typeof saved.city === "string") setCity(saved.city);
        if (typeof saved.address === "string") setAddress(saved.address);
      }
    } catch {
      /* rien à préremplir */
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);

    try {
      // Seuls les identifiants et les quantités sont envoyés : le serveur recalcule les prix.
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId: group.vendorId,
          items: group.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          buyerName: name,
          buyerPhone: phone,
          deliveryCity: city,
          deliveryAddress: address,
          note,
          paymentMethod: method,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? "La commande n'a pas pu être enregistrée. Réessayez.");
        return;
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, phone, city, address }));
      } catch {
        /* sans importance */
      }

      onDone({
        reference: data.reference,
        totalFcfa: data.totalFcfa,
        vendorName: group.vendorName,
        buyerPhone: phone,
        payment: data.payment ?? null,
      });
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau, puis réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  const label = "mb-1.5 block text-sm font-medium text-[#18120E]";

  return (
    <form onSubmit={submit} className="space-y-4 border-t border-[#EFE8DC] p-5">
      <h3 className="font-semibold">Vos coordonnées de livraison</h3>

      <div>
        <label htmlFor={`name-${group.vendorId}`} className={label}>
          Nom et prénom
        </label>
        <input
          id={`name-${group.vendorId}`}
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          className={FIELD}
        />
      </div>

      <div>
        <label htmlFor={`phone-${group.vendorId}`} className={label}>
          Téléphone (pour vous joindre)
        </label>
        <input
          id={`phone-${group.vendorId}`}
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="07 00 00 00 00"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={30}
          className={FIELD}
        />
      </div>

      <div>
        <label htmlFor={`city-${group.vendorId}`} className={label}>
          Ville
        </label>
        <select
          id={`city-${group.vendorId}`}
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={FIELD}
        >
          <option value="">Choisir la ville</option>
          {VILLES.map((ville) => (
            <option key={ville} value={ville}>
              {ville}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`address-${group.vendorId}`} className={label}>
          Adresse de livraison (quartier, repère)
        </label>
        <textarea
          id={`address-${group.vendorId}`}
          required
          rows={2}
          autoComplete="street-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          maxLength={300}
          className={`${FIELD} h-auto py-3`}
        />
      </div>

      <div>
        <label htmlFor={`note-${group.vendorId}`} className={label}>
          Note pour la livraison (facultatif)
        </label>
        <textarea
          id={`note-${group.vendorId}`}
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={300}
          className={`${FIELD} h-auto py-3`}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-[#18120E]">Moyen de paiement</legend>
        <div className="space-y-2">
          {methods.map((m) => (
            <label
              key={m.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-base ${
                method === m.id ? "border-[#B78B42] bg-[#FFF9EA]" : "border-[#D9CFC1] bg-white"
              }`}
            >
              <input
                type="radio"
                name={`method-${group.vendorId}`}
                value={m.id}
                checked={method === m.id}
                onChange={() => setMethod(m.id)}
                className="h-5 w-5 accent-[#21150F]"
              />
              <span>{m.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="text-sm text-[#6B5F55]">
        Total : <strong>{formatFcfa(group.subtotal)}</strong>.{" "}
        {method === "CASH"
          ? "Nous vous appelons pour confirmer votre commande et organiser la livraison. Paiement à la livraison."
          : "Après validation, vous recevrez le numéro auquel envoyer le paiement par Mobile Money."}
      </p>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[#21150F] px-6 py-3 font-semibold text-white transition hover:bg-black disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B78B42]"
        >
          {submitting ? "Envoi en cours…" : "Valider ma commande"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-full border border-[#D9CFC1] px-5 py-3 font-medium transition hover:bg-[#F4EFE7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B78B42]"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
