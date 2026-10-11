// types/vendor.ts
export type Vendor = {
  id: string | number;
  city?: string | null;
  featured?: boolean;
  featuredUntil?: string | Date | null;
};
