"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function getId(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) throw new Error("Identifiant manquant.");
  return id;
}

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/admin/vendors");
  revalidatePath("/admin/reviews");
}

export async function setVendorStatus(formData: FormData) {
  await requireAdmin();
  const id = getId(formData);
  const status = formData.get("status");

  if (status !== "PENDING" && status !== "APPROVED" && status !== "REJECTED") {
    throw new Error("Statut invalide.");
  }

  await db.vendor.update({ where: { id }, data: { status } });
  refresh();
}

export async function toggleFeatured(formData: FormData) {
  await requireAdmin();
  const id = getId(formData);

  const vendor = await db.vendor.findUnique({
    where: { id },
    select: { featured: true, featuredUntil: true },
  });
  if (!vendor) return;

  const active =
    vendor.featured && vendor.featuredUntil !== null && vendor.featuredUntil > new Date();

  await db.vendor.update({
    where: { id },
    data: active
      ? { featured: false, featuredUntil: null }
      : { featured: true, featuredUntil: new Date(Date.now() + THIRTY_DAYS) },
  });
  refresh();
}

export async function deleteVendor(formData: FormData) {
  await requireAdmin();
  await db.vendor.delete({ where: { id: getId(formData) } });
  refresh();
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  await db.review.delete({ where: { id: getId(formData) } });
  refresh();
}
