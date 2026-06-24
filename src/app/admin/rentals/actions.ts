"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sendRentalApprovedEmail, sendRentalRejectedEmail } from "@/lib/email";

export async function approveRentalAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const rental = await prisma.rental.update({
    where: { id },
    data: { status: "APPROVED" },
    include: { product: true },
  });

  try {
    await sendRentalApprovedEmail({
      customerName: rental.customerName,
      customerEmail: rental.customerEmail,
      productName: rental.product.name,
      startDate: rental.startDate,
      endDate: rental.endDate,
    });
  } catch (e) {
    console.error("Erro a enviar email de aprovação:", e);
  }

  revalidatePath("/admin/rentals");
  revalidatePath("/admin");
}

export async function rejectRentalAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const rental = await prisma.rental.update({
    where: { id },
    data: { status: "REJECTED" },
    include: { product: true },
  });

  try {
    await sendRentalRejectedEmail({
      customerName: rental.customerName,
      customerEmail: rental.customerEmail,
      productName: rental.product.name,
      startDate: rental.startDate,
      endDate: rental.endDate,
    });
  } catch (e) {
    console.error("Erro a enviar email de rejeição:", e);
  }

  revalidatePath("/admin/rentals");
  revalidatePath("/admin");
}

export async function cancelRentalAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.rental.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/admin/rentals");
  revalidatePath("/admin");
}