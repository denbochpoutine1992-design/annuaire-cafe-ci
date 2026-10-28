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

/**
 * Stock reçu dans l'entrepôt. Une case vide = stock non suivi (le produit n'est jamais « épuisé »).
 */
export async function setProductStock(formData: FormData) {
  await requireAdmin();
  const id = getId(formData);
  const raw = formData.get("stock");
  const text = typeof raw === "string" ? raw.trim() : "";

  const stock = text === "" ? null : Math.max(0, parseInt(text.replace(/\D/g, ""), 10) || 0);

  await db.product.update({ where: { id }, data: { stock } });
  revalidatePath("/admin", "layout");
}
