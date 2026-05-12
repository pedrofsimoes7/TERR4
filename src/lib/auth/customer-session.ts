import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_NAME = "terr4-customer-session";

const secret = new TextEncoder().encode(
  process.env.CUSTOMER_SESSION_SECRET ||
    "customer-dev-secret-change-this"
);

type CustomerSessionPayload = {
  customerId: string;
  email: string;
};

export async function createCustomerSession(
  payload: CustomerSessionPayload
) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroyCustomerSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_NAME);
}

export async function getCustomerSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_NAME)?.value;

  if (!token) return null;

  try {
    const verified = await jwtVerify(token, secret);

    return verified.payload as CustomerSessionPayload;
  } catch {
    return null;
  }
}