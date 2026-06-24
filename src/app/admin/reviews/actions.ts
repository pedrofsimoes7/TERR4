"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// ── Reviews ──
export async function approveReviewAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.review.update({ where: { id }, data: { status: "APPROVED" } });
  revalidatePath("/admin/reviews");
  revalidatePath("/galeria");
}

export async function rejectReviewAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.review.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/reviews");
  revalidatePath("/galeria");
}

export async function deleteReviewAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
  revalidatePath("/galeria");
}

// ── Galeria ──
export async function addGalleryImageAction(formData: FormData) {
  const url = String(formData.get("url") || "").trim();
  if (!url) return;

  const count = await prisma.galleryImage.count();
  await prisma.galleryImage.create({
    data: { url, sortOrder: count },
  });
  revalidatePath("/admin/reviews");
  revalidatePath("/galeria");
}

export async function deleteGalleryImageAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin/reviews");
  revalidatePath("/galeria");
}