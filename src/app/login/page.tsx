"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]); // 4 digit OTP handled via Brevo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      
      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const code = otp.join("");
    if (code.length !== 4) {
      setError("Please enter a valid 4-digit code");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      
      // Redirect based on role
      if (data.user.role === "admin") router.push("/admin");
      else if (data.user.role === "kitchen") router.push("/kitchen");
      else router.push("/");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(value.length - 1); // Only allow 1 char
    if (!/^\d*$/.test(value)) return; // Only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen flex flex-col font-body antialiased">
      {/* Top AppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#fdf9f2] flex justify-center items-center px-6 py-8">
        <h1 className="font-headline font-bold italic text-2xl tracking-tight text-[#1c1c18]">The Roasted Bean</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-24 pb-12 relative z-10">
        <div className="w-full max-w-md space-y-12">
          
          {step === "email" ? (
            <>
              {/* Email Step UI */}
              <section className="space-y-4 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto shadow-xl shadow-black/5 bg-gray-200">
                    <img 
                      alt="Coffee Cup" 
                      className="w-full h-full object-cover" 
                      src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=200&auto=format&fit=crop" 
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#894d00] text-white p-2 rounded-full shadow-lg h-9 w-9 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">coffee</span>
                  </div>
                </div>
                <h2 className="font-headline text-4xl font-bold tracking-tight text-[#1c1c18]">Welcome Back</h2>
                <p className="text-[#534437] text-md max-w-xs mx-auto leading-relaxed">
                  Enter your email to continue
                </p>
              </section>

              <form className="space-y-8" onSubmit={handleSendOtp}>
                <div className="relative group">
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-[#894d00] mb-2 transition-all">
                    Email Address
                  </label>
                  <input 
                    id="email" 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-[#d8c3b2] focus:border-[#894d00] focus:ring-0 py-4 px-0 text-xl font-body placeholder:text-black/20 transition-colors" 
                    placeholder="e.g. hello@domain.com" 
                  />
                </div>
                {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}
                
                <div className="space-y-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#894d00] text-white font-bold py-5 rounded-full shadow-lg shadow-[#894d00]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-[#a96413]"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                    {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* OTP Step UI */}
              <section className="space-y-4 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto shadow-xl shadow-black/5 bg-gray-200">
                    <img 
                      alt="Coffee Cup" 
                      className="w-full h-full object-cover" 
                      src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=200&auto=format&fit=crop" 
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#894d00] text-white p-2 rounded-full shadow-lg h-9 w-9 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                </div>
                <h2 className="font-headline text-4xl font-bold tracking-tight text-[#1c1c18]">Verify Identity</h2>
                <p className="text-[#534437] text-md max-w-xs mx-auto leading-relaxed">
                  We sent a 4-digit code to <span className="font-semibold text-[#1c1c18]">{email}</span>
                </p>
              </section>

              <form className="space-y-8" onSubmit={handleVerifyOtp}>
                <div className="flex justify-center gap-4 mb-4">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      autoFocus={i === 0}
                      className="w-16 h-16 text-center text-3xl font-headline font-bold bg-[#ebe8e1] border-b-2 border-transparent focus:border-[#894d00] focus:bg-[#dddad3] rounded-t-lg transition-all"
                    />
                  ))}
                </div>
                
                {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}
                
                <div className="space-y-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#894d00] text-white font-bold py-5 rounded-full shadow-lg shadow-[#894d00]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-[#a96413]"
                  >
                    {loading ? "Verifying..." : "Verify & Continue"}
                  </button>
                  <div className="text-center pt-2">
                    <button 
                      type="button" 
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="text-[#894d00] font-bold text-sm tracking-widest uppercase hover:underline"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}

        </div>
      </main>
      
      {/* Decorative Background Element */}
      <div className="fixed right-0 w-1/3 h-full overflow-hidden pointer-events-none z-0 hidden lg:block" style={{ top: 0 }}>
        <div className="w-full h-full bg-[#f7f3ec] relative">
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale mix-blend-multiply" 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop" 
            alt="Cafe Interior"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#fdf9f2]"></div>
        </div>
      </div>
    </div>
  );
}
