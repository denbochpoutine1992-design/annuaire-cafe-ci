"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { parseFcfa } from "@/lib/format";

function getId(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) throw new Error("Identifiant manquant.");
  return id;
}

export async function setProductStatus(formData: FormData) {
  await requireAdmin();
  const id = getId(formData);
  const status = formData.get("status");

  if (status !== "PENDING" && status !== "APPROVED" && status !== "REJECTED") {
    throw new Error("Statut invalide.");
  }

  await db.product.update({ where: { id }, data: { status } });
  revalidatePath("/admin", "layout");
}

/** Prix de vente décidé par l'administrateur (en FCFA, sans centimes). */
export async function setProductPrice(formData: FormData) {
  await requireAdmin();
  const id = getId(formData);
  const raw = formData.get("price");

  const amount = parseFcfa(typeof raw === "string" ? raw : "");
  if (amount <= 0) throw new Error("Prix invalide.");

  await db.product.update({ where: { id }, data: { price: `${amount} FCFA` } });
  revalidatePath("/admin", "layout");
}
