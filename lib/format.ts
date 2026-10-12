// lib/format.ts
// Les prix sont stockés en texte dans la base (Product.price est un String).
// Le FCFA n'a pas de centimes : on ne garde que les chiffres.

/** "5 000 FCFA", "5.000", "5000" → 5000. Retourne 0 si le prix est vide ou invalide. */
export function parseFcfa(value: string | number | null | undefined): number {
  if (typeof value === "number") return Number.isFinite(value) ? Math.round(value) : 0;
  const digits = (value ?? "").replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

/**
 * 15000 → "15 000 FCFA".
 * Séparateur construit à la main (espace insécable classique) : le séparateur
 * d'Intl.NumberFormat("fr-FR") s'affiche mal sur certains vieux Android.
 */
export function formatFcfa(value: string | number | null | undefined): string {
  const n = parseFcfa(value);
  return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0")}\u00A0FCFA`;
}
