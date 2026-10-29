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

  const order = await db.order.findUnique({
    where: { id },
    select: {
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      items: { select: { productId: true, quantity: true } },
    },
  });
  if (!order) throw new Error("Commande introuvable.");

  // Une commande payée par Mobile Money ne se confirme qu'après validation du paiement.
  if (status === "CONFIRMED") {
    const needsPayment = !!order.paymentMethod && order.paymentMethod !== "CASH";
    if (needsPayment && order.paymentStatus !== "PAID") {
      throw new Error("Validez d'abord le paiement de cette commande.");
    }
  }

  const cancelling = status === "CANCELLED" && order.status !== "CANCELLED";
  const reopening = order.status === "CANCELLED" && status !== "CANCELLED";
  const productIds = order.items.map((i) => i.productId).filter((p): p is string => !!p);

  await db.$transaction(async (tx) => {
    // Annulation : les produits dont le stock est suivi retournent dans le stock.
    if (cancelling) {
      for (const item of order.items) {
        if (!item.productId) continue;
        await tx.product.updateMany({
          where: { id: item.productId, stock: { not: null } },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    // Réouverture d'une commande annulée : on reprend le stock, s'il en reste assez.
    if (reopening && productIds.length > 0) {
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, stock: true },
      });
      const tracked = new Set(products.filter((p) => p.stock !== null).map((p) => p.id));

      for (const item of order.items) {
        if (!item.productId || !tracked.has(item.productId)) continue;
        const res = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (res.count !== 1) {
          throw new Error("Stock insuffisant pour rouvrir cette commande.");
        }
      }
    }

    await tx.order.update({ where: { id }, data: { status } });
  });

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
