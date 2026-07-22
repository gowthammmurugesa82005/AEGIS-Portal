import { SignJWT, jwtVerify } from "jose";
import type { AuthSession } from "@/types";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ?? "aegis-dev-secret-change-in-production-32ch"
);

// Create a signed JWT for the session
export async function createSessionToken(session: AuthSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET);
}

// Verify and decode a session token
export async function verifySessionToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AuthSession;
  } catch {
    return null;
  }
}

// Cookie name constant
export const SESSION_COOKIE = "aegis_session";
