// types/vendor.ts
// À ajuster selon ton modèle Prisma si un champ diffère.
export type VendorPhoto = { url: string };
export type VendorReview = { rating: number };

export type Vendor = {
  id: string | number;
  name?: string | null;
  category?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  phone?: string | null;
  description?: string | null;
  priceInfo?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  featured?: boolean;
  featuredUntil?: string | Date | null;
  photos?: VendorPhoto[];
  reviews?: VendorReview[];
  products?: unknown[];
};
