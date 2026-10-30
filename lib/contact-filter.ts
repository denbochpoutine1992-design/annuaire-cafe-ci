// lib/contact-filter.ts
// Toutes les ventes passent par la plateforme : les vendeurs ne doivent pas pouvoir écrire
// leurs coordonnées (téléphone, e-mail, lien, réseau social) dans leurs fiches et produits.
// Aucun filtre n'est parfait : ceci bloque les cas courants, et l'administrateur valide le reste.

export const CONTACT_BLOCKED_MESSAGE =
  "Pour votre sécurité, n'indiquez ni numéro de téléphone, ni e-mail, ni lien, ni réseau social : toutes les ventes passent par Annuaire Café CI.";

/** Minuscules, sans accents. */
function normalize(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const MESSAGING_WORDS =
  /\b(whats?\s?app|watsap|telegram|messenger|facebook|instagram|snapchat|tiktok|linkedin)\b|\b(wa|t)\.me\b/;

const URL_PATTERN =
  /(https?:\/\/|www\.)|\b[a-z0-9-]+\.(com|net|org|ci|fr|io|me|co|app|shop|store|site|online)\b/;

const EMAIL_PATTERN = /[a-z0-9._%+-]+\s*(@|\(at\)|\[at\]|arobase)\s*[a-z0-9.-]+/;

const SPELLED_DIGITS =
  /(\b(zero|un|deux|trois|quatre|cinq|six|sept|huit|neuf)\b[\s,.-]*){6,}/;

/** Vrai si l'un des textes contient un moyen de contact. */
export function containsContactInfo(...texts: (string | null | undefined)[]): boolean {
  for (const raw of texts) {
    if (!raw) continue;
    const text = normalize(raw);

    // « 07 49 58 30 50 », « 07.49.58.30.50 », « +225-07-49… » : on recolle les chiffres séparés
    const compact = text.replace(/(\d)[\s.\-()/]+(?=\d)/g, "$1");
    if (/\d{8,}/.test(compact)) return true;

    if (MESSAGING_WORDS.test(text)) return true;
    if (URL_PATTERN.test(text)) return true;
    if (EMAIL_PATTERN.test(text)) return true;
    if (SPELLED_DIGITS.test(text)) return true;
  }
  return false;
}
