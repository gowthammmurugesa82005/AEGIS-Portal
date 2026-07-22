"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Zap, Car, ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";

type Step = "chassis" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step,        setStep]        = useState<Step>("chassis");
  const [chassis,     setChassis]     = useState("");
  const [otp,         setOtp]         = useState(["", "", "", "", "", ""]);
  const [sessionId,   setSessionId]   = useState("");
  const [maskedMobile,setMaskedMobile]= useState("");
  const [testOtp,     setTestOtp]     = useState("");
  const [showTestOtp, setShowTestOtp] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [countdown,   setCountdown]   = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Step 1: Verify chassis ────────────────────────────────────────────────
  async function handleChassisSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!chassis.trim()) return;
    setError("");
    setLoading(true);

    try {
      const res  = await fetch("/api/auth/verify-chassis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chassisNumber: chassis.trim() }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error ?? "Verification failed"); return; }

      setSessionId(data.sessionId);
      setMaskedMobile(data.maskedMobile);
      if (data.testOtp) setTestOtp(data.testOtp); // test mode only
      setStep("otp");
      startCountdown(60);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) { setError("Enter all 6 digits"); return; }
    setError("");
    setLoading(true);

    try {
      const res  = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, otp: fullOtp }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error ?? "OTP verification failed"); return; }

      router.push(data.redirectTo ?? "/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpInput(index: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function startCountdown(seconds: number) {
    setCountdown(seconds);
    const t = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aegis-dark via-aegis-navy to-slate-800 flex items-center justify-center p-4">

      {/* Test mode notice */}
      {process.env.NEXT_PUBLIC_TEST_MODE === "true" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-400/20 border border-amber-400/40 backdrop-blur-sm text-amber-200 text-xs px-4 py-2 rounded-full text-center">
          🧪 Testing Mode — use chassis <strong>AEGIS2024TEST001</strong> and OTP <strong>123456</strong>
        </div>
      )}

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-aegis-gold/20 border border-aegis-gold/30 mb-4">
            <Zap size={26} className="text-aegis-gold" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">AEGIS</h1>
          <p className="text-white/50 text-sm">Vehicle Owner Intelligence Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {step === "chassis" ? (
            <>
              <div className="flex items-center gap-2.5 mb-6">
                <Car size={20} className="text-aegis-navy" />
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Welcome Back</h2>
                  <p className="text-xs text-slate-500">Enter your vehicle chassis number to continue</p>
                </div>
              </div>

              <form onSubmit={handleChassisSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    Vehicle Chassis / VIN Number
                  </label>
                  <input
                    type="text"
                    className="input-field font-mono uppercase tracking-widest"
                    placeholder="AEGIS2024TEST001"
                    value={chassis}
                    onChange={(e) => setChassis(e.target.value.toUpperCase())}
                    maxLength={20}
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Found on your RC book, insurance document, or vehicle frame
                  </p>
                </div>

                {error && (
                  <p className="text-xs text-status-red bg-status-red-bg rounded-lg px-3 py-2">{error}</p>
                )}

                <button type="submit" disabled={loading} className="aegis-btn-primary w-full flex items-center justify-center gap-2 py-3">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  {loading ? "Verifying…" : "Verify Ownership"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5 mb-6">
                <ShieldCheck size={20} className="text-status-green" />
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Enter OTP</h2>
                  <p className="text-xs text-slate-500">
                    Sent to <strong>{maskedMobile}</strong>
                  </p>
                </div>
              </div>

              {/* Test mode OTP reveal */}
              {testOtp && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-center justify-between">
                  <p className="text-xs text-amber-800">
                    <strong>Test Mode OTP:</strong>{" "}
                    <span className={`font-mono font-bold ${showTestOtp ? "" : "blur-sm"}`}>
                      {testOtp}
                    </span>
                  </p>
                  <button onClick={() => setShowTestOtp(!showTestOtp)} className="text-amber-600">
                    {showTestOtp ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                {/* 6-digit OTP input */}
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-11 h-12 text-center text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-aegis-navy focus:outline-none transition-colors bg-slate-50"
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-xs text-status-red bg-status-red-bg rounded-lg px-3 py-2 text-center">{error}</p>
                )}

                <button type="submit" disabled={loading} className="aegis-btn-primary w-full flex items-center justify-center gap-2 py-3">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading ? "Verifying…" : "Verify & Sign In"}
                </button>

                <div className="text-center text-xs text-slate-500">
                  {countdown > 0 ? (
                    <span>Resend OTP in {countdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleChassisSubmit as unknown as React.MouseEventHandler}
                      className="text-aegis-navy font-medium hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => { setStep("chassis"); setOtp(["","","","","",""]); setError(""); }}
                  className="text-xs text-slate-400 hover:text-slate-600 w-full text-center"
                >
                  ← Use a different chassis number
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
