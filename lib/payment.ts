// lib/payment.ts
// Moyens de paiement proposés aux clients. Les numéros marchands viennent des variables
// d'environnement de Vercel (PAYMENT_*). Un opérateur sans numéro n'est pas proposé.

export type PaymentMethodId = "CASH" | "ORANGE" | "MTN" | "MOOV" | "WAVE";

export type PaymentMethod = { id: PaymentMethodId; label: string };

export type PaymentInstructions = {
  method: PaymentMethodId;
  label: string;
  number: string;
  accountName: string;
};

const MOBILE_MONEY: { id: Exclude<PaymentMethodId, "CASH">; label: string; env: string }[] = [
  { id: "ORANGE", label: "Orange Money", env: "PAYMENT_ORANGE_NUMBER" },
  { id: "MTN", label: "MTN MoMo", env: "PAYMENT_MTN_NUMBER" },
  { id: "MOOV", label: "Moov Money", env: "PAYMENT_MOOV_NUMBER" },
  { id: "WAVE", label: "Wave", env: "PAYMENT_WAVE_NUMBER" },
];

function readEnv(name: string) {
  return (process.env[name] ?? "").trim();
}

/**
 * Moyens disponibles pour le client (SANS les numéros).
 * Le nom du titulaire est obligatoire : sans lui, aucun moyen Mobile Money n'est proposé,
 * car le client doit pouvoir vérifier à qui il envoie son argent.
 */
export function getAvailableMethods(): PaymentMethod[] {
  const methods: PaymentMethod[] = [];

  if (readEnv("PAYMENT_ACCOUNT_NAME")) {
    for (const m of MOBILE_MONEY) {
      if (readEnv(m.env)) methods.push({ id: m.id, label: m.label });
    }
  }

  methods.push({ id: "CASH", label: "Payer à la livraison" });
  return methods;
}

/** Numéro et titulaire à communiquer au client APRÈS qu'il a passé sa commande. */
export function getMobileInstructions(id: string): PaymentInstructions | null {
  const m = MOBILE_MONEY.find((x) => x.id === id);
  if (!m) return null;

  const number = readEnv(m.env);
  const accountName = readEnv("PAYMENT_ACCOUNT_NAME");
  if (!number || !accountName) return null;

  return { method: m.id, label: m.label, number, accountName };
}
