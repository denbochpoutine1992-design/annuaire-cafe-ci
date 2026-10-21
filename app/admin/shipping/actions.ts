"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { VILLES } from "@/lib/constants";
import { DEFAULT_FEE_KEY, FREE_THRESHOLD_KEY } from "@/lib/shipping";

/** Montant en FCFA : chiffres uniquement. Vide = 0. */
function amount(value: FormDataEntryValue | null) {
  const digits = typeof value === "string" ? value.replace(/\D/g, "") : "";
  return digits ? parseInt(digits, 10) : 0;
}

export async function saveShippingSettings(formData: FormData) {
  await requireAdmin();

  const defaultFee = amount(formData.get("defaultFee"));
  const freeThreshold = amount(formData.get("freeThreshold"));

  await Promise.all([
    db.setting.upsert({
      where: { key: DEFAULT_FEE_KEY },
      update: { value: String(defaultFee) },
      create: { key: DEFAULT_FEE_KEY, value: String(defaultFee) },
    }),
    db.setting.upsert({
      where: { key: FREE_THRESHOLD_KEY },
      update: { value: String(freeThreshold) },
      create: { key: FREE_THRESHOLD_KEY, value: String(freeThreshold) },
    }),
  ]);

  revalidatePath("/admin/shipping");
}

/** Un champ vide = la ville utilise le tarif par défaut. Seules les villes de la liste sont acceptées. */
export async function saveShippingRates(formData: FormData) {
  await requireAdmin();

  for (const city of VILLES) {
    const raw = formData.get(`fee:${city}`);
    const hasValue = typeof raw === "string" && raw.trim() !== "";

    if (!hasValue) {
      await db.shippingRate.deleteMany({ where: { city } });
      continue;
    }

    const feeFcfa = amount(raw);
    await db.shippingRate.upsert({
      where: { city },
      update: { feeFcfa },
      create: { city, feeFcfa },
    });
  }

  revalidatePath("/admin/shipping");
}
