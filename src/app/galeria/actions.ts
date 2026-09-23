"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createReviewAction(formData: FormData) {
  const customerName = String(formData.get("customerName") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const rating = Number(formData.get("rating"));

  if (!customerName || !body) return;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return;

  await prisma.review.create({
    data: {
      customerName: customerName.slice(0, 80),
      body: body.slice(0, 1000),
      rating,
      status: "APPROVED",
    },
  });

  revalidatePath("/galeria");
  redirect("/galeria");
}