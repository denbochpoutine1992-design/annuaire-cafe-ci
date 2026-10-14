// lib/public-vendor.ts
// Dans le modèle « entrepôt central », le client ne doit jamais pouvoir joindre
// ni localiser un vendeur : ces champs ne sortent donc JAMAIS dans l'API publique.
const PRIVATE_FIELDS = ["phone", "latitude", "longitude", "neighborhood", "ownerId"] as const;

export function toPublicVendor<T extends object>(vendor: T): Record<string, unknown> {
  const copy: Record<string, unknown> = { ...vendor };
  for (const field of PRIVATE_FIELDS) delete copy[field];
  return copy;
}
