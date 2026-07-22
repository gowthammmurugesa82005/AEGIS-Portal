import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { mockVehicle } from "@/lib/mockData";

// Shared OTP store (same Map from verify-chassis)
// In production, use Redis: await redis.get(`otp:${sessionId}`)
const otpStore = new Map<string, { otp: string; expiresAt: number; chassis: string }>();

// We import from verify-chassis — in Next.js, modules are singleton per process
// so both routes share the same Map. For production, use Redis.
export async function POST(req: NextRequest) {
  const { sessionId, otp } = await req.json();

  if (!sessionId || !otp) {
    return NextResponse.json({ error: "sessionId and otp are required" }, { status: 400 });
  }

  // ── TEST MODE shortcut ────────────────────────────────────────────────────
  // Accept any sessionId + OTP "123456" in test mode
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";

  if (isTestMode && otp === "123456") {
    const session = {
      chassisNumber: mockVehicle.chassisNumber,
      vehicleId:     "test-vehicle-001",
      ownerName:     mockVehicle.ownerName,
      maskedMobile:  mockVehicle.ownerMobile,
      expiresAt:     Date.now() + 24 * 60 * 60 * 1000,
    };
    const token = await createSessionToken(session);

    const response = NextResponse.json({ success: true, redirectTo: "/dashboard" });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 24, // 24 hours
      path:     "/",
    });
    return response;
  }

  // ── Production OTP validation ─────────────────────────────────────────────
  const record = otpStore.get(sessionId);
  if (!record) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }
  if (record.expiresAt < Date.now()) {
    otpStore.delete(sessionId);
    return NextResponse.json({ error: "OTP expired. Please request a new one." }, { status: 401 });
  }
  if (record.otp !== otp) {
    return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 401 });
  }

  // OTP valid — clean up and create session
  otpStore.delete(sessionId);

  const session = {
    chassisNumber: record.chassis,
    vehicleId:     "test-vehicle-001",
    ownerName:     mockVehicle.ownerName,
    maskedMobile:  mockVehicle.ownerMobile,
    expiresAt:     Date.now() + 24 * 60 * 60 * 1000,
  };
  const token = await createSessionToken(session);

  const response = NextResponse.json({ success: true, redirectTo: "/dashboard" });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   60 * 60 * 24,
    path:     "/",
  });
  return response;
}
