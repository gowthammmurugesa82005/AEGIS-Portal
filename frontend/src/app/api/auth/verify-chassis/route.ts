import { NextRequest, NextResponse } from "next/server";
import { TEST_CHASSIS, TEST_MOBILE } from "@/lib/mockData";

// In-memory OTP store (use Redis in production)
// Key: sessionId, Value: { otp, expiresAt, chassisNumber }
const otpStore = new Map<string, { otp: string; expiresAt: number; chassis: string }>();

export async function POST(req: NextRequest) {
  const { chassisNumber } = await req.json();

  if (!chassisNumber || typeof chassisNumber !== "string") {
    return NextResponse.json({ error: "Chassis number is required" }, { status: 400 });
  }

  const normalised = chassisNumber.trim().toUpperCase();

  // ── TEST MODE: accept only test chassis ─────────────────────────────────
  // In production: query VAHAN API here to look up registered mobile number
  if (normalised !== TEST_CHASSIS) {
    return NextResponse.json({
      error: "Vehicle not found. For testing, use chassis: AEGIS2024TEST001",
    }, { status: 404 });
  }

  // Generate 6-digit OTP
  const otp = process.env.NEXT_PUBLIC_TEST_MODE === "true"
    ? "123456"                               // Fixed OTP in test mode
    : Math.floor(100000 + Math.random() * 900000).toString();

  const sessionId = crypto.randomUUID();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore.set(sessionId, { otp, expiresAt, chassis: normalised });

  // Clean up old entries
  for (const [key, val] of otpStore.entries()) {
    if (val.expiresAt < Date.now()) otpStore.delete(key);
  }

  // In production: send SMS via Resend/Fast2SMS instead of returning OTP
  // await sendSMS(mobileFromVAHAN, otp);

  return NextResponse.json({
    success:     true,
    sessionId,
    maskedMobile: TEST_MOBILE,
    // Only include testOtp in test mode — remove this in production!
    ...(process.env.NEXT_PUBLIC_TEST_MODE === "true" && { testOtp: otp }),
    message:     `OTP sent to ${TEST_MOBILE}`,
  });
}

// Export the store so verify-otp route can access it
// In production, use Redis instead
export { otpStore };
