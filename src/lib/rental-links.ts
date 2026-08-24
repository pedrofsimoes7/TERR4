import { createHash, randomBytes } from "crypto";

export const RENTAL_RESPONSE_WINDOW_MS = 24 * 60 * 60 * 1000;

export function createRentalDecisionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashRentalToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function formatRentalDates(startDate: Date, endDate: Date) {
  const formatter = new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${formatter.format(startDate)} a ${formatter.format(endDate)}`;
}
