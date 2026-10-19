"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

function getId(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) throw new Error("Identifiant manquant.");
  return id;
}

export async function setOrderStatus(formData: FormData) {
  await requireAdmin();

  const id = getId(formData);
  const status = formData.get("status");

  if (
    status !== "NEW" &&
    status !== "CONFIRMED" &&
    status !== "DELIVERED" &&
    status !== "CANCELLED"
  ) {
    throw new Error("Statut invalide.");
  }

  // Une commande payée par Mobile Money ne se confirme qu'après validation du paiement.
  if (status === "CONFIRMED") {
    const order = await db.order.findUnique({
      where: { id },
      select: { paymentMethod: true, paymentStatus: true },
    });
    if (!order) throw new Error("Commande introuvable.");

    const needsPayment = !!order.paymentMethod && order.paymentMethod !== "CASH";
    if (needsPayment && order.paymentStatus !== "PAID") {
      throw new Error("Validez d'abord le paiement de cette commande.");
    }
  }

  await db.order.update({ where: { id }, data: { status } });

  // Met à jour la liste, le tableau de bord et les compteurs de la barre d'administration
  revalidatePath("/admin", "layout");
}

/**
 * L'administrateur contrôle le paiement dans son application Mobile Money.
 * - PAID : paiement reçu. Une commande « nouvelle » passe alors en préparation.
 * - UNPAID : paiement non reçu. L'identifiant saisi est effacé et le client peut en saisir un autre.
 */
export async function setPaymentStatus(formData: FormData) {
  await requireAdmin();

  const id = getId(formData);
  const action = formData.get("action");

  const order = await db.order.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!order) throw new Error("Commande introuvable.");

  if (action === "PAID") {
    await db.order.update({
      where: { id },
      data: {
        paymentStatus: "PAID",
        paidAt: new Date(),
        ...(order.status === "NEW" ? { status: "CONFIRMED" as const } : {}),
      },
    });
  } else if (action === "UNPAID") {
    await db.order.update({
      where: { id },
      data: { paymentStatus: "UNPAID", paidAt: null, paymentRef: null },
    });
  } else {
    throw new Error("Action invalide.");
  }

  revalidatePath("/admin", "layout");
}
