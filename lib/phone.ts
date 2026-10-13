// lib/phone.ts

/** Numéro ivoirien au format international, chiffres uniquement (ex. 2250749583050). */
export function toIntlDigits(phone?: string | null): string {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) return "";

  let local = digits.startsWith("225") ? digits.slice(3) : digits;

  // Numéro enregistré sans le 0 initial : 749583050 → 0749583050
  if (local.length === 9 && !local.startsWith("0")) local = `0${local}`;

  return `225${local}`;
}

/** Numéro plausible : entre 8 et 15 chiffres. */
export function isValidPhone(phone: string): boolean {
  const n = phone.replace(/\D/g, "").length;
  return n >= 8 && n <= 15;
}
