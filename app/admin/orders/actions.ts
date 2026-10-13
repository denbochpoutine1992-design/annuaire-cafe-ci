"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function setOrderStatus(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  const status = formData.get("status");

  if (typeof id !== "string" || !id) throw new Error("Identifiant manquant.");
  if (
    status !== "NEW" &&
    status !== "CONFIRMED" &&
    status !== "DELIVERED" &&
    status !== "CANCELLED"
  ) {
    throw new Error("Statut invalide.");
  }

  await db.order.update({ where: { id }, data: { status } });

  // Met à jour la liste, le tableau de bord et le compteur de la barre d'administration
  revalidatePath("/admin", "layout");
}
