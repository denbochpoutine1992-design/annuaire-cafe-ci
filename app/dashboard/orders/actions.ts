"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

// Changements de statut autorisés pour un vendeur (l'administrateur peut tout corriger).
const ALLOWED: Record<string, string[]> = {
  NEW: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["DELIVERED", "CANCELLED"],
};

export async function setMyOrderStatus(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) throw new Error("Non authentifié.");

  const id = formData.get("id");
  const status = formData.get("status");
  if (typeof id !== "string" || !id || typeof status !== "string") {
    throw new Error("Requête invalide.");
  }

  // La commande doit appartenir à un commerce de CE vendeur
  const order = await db.order.findFirst({
    where: { id, vendor: { ownerId: userId } },
    select: { id: true, status: true },
  });
  if (!order) throw new Error("Commande introuvable.");

  if (!(ALLOWED[order.status] ?? []).includes(status)) {
    throw new Error("Changement de statut impossible.");
  }

  await db.order.update({
    where: { id: order.id },
    data: { status: status as "CONFIRMED" | "DELIVERED" | "CANCELLED" },
  });

  revalidatePath("/dashboard/orders");
}
