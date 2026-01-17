import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Mail, ArrowLeft, Hospital,Lock, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Replace with your actual API call
      const response = await fetch("/api/auth/forgot-password", {
    
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      setIsSubmitted(true);
      toast.success("Reset link sent! Check your email inbox.", {
        duration: 5000,
        icon: "📧",
      });
    } catch (err: any) {
      // Don't reveal if email exists or not for security
      toast.error(
        err.message || "Failed to send reset link. Please try again.",
        {
          duration: 4000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

return (
  <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
    {/* LEFT COLUMN — FORGOT PASSWORD FLOW (UNCHANGED CONTENT) */}
    <div className="flex w-full flex-col items-center justify-center px-6 lg:px-20 xl:px-20 bg-white">
      <div className="w-full max-w-lg">

        {/* Logo */}
       <Link to="/">
          <div className="mb-16 flex items-center gap-2">
            <Hospital className="size-10 text-blue-500" />
            <h2 className="text-xl font-bold tracking-tight text-blue-500">
              ClinicAI
            </h2>
          </div>
        </Link>

        {!isSubmitted ? (
          <>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-500 transition-colors mb-8"
            >
              <ArrowLeft className="size-4" />
              Back to login
            </Link>

            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              Forgot Password?
            </h1>
            <p className="mb-10 text-slate-500">
              No worries! Enter your email address and we'll send you a link
              to reset your password.
            </p>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Email Address</span>
                <div className="relative">
                  <input
                    className="h-12 w-full rounded-lg border border-slate-200 px-4 pr-12 text-base placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="dr.smith@clinic.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                </div>
              </div>

              <button
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-8 text-green-600"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>
              </div>

              <h1 className="mb-2 text-3xl font-bold tracking-tight">
                Check Your Email
              </h1>
              <p className="mb-6 text-slate-500">
                We've sent a password reset link to
              </p>
              <p className="mb-8 font-semibold">{email}</p>

              <p className="mb-6 text-sm text-slate-500">
                Didn't receive the email? Check your spam folder also
              </p>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline"
              >
                Try another email address
              </button>
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-500 transition-colors"
              >
                <ArrowLeft className="size-4" />
                Back to login
              </Link>
            </div>
          </>
        )}

        {/* Compliance */}
        <div className="mt-16 flex flex-col items-center gap-6 border-t border-slate-100 pt-8 text-center">
          <p className="text-xs uppercase tracking-widest font-medium text-slate-400">
            Industry-Standard Compliance
          </p>
          <div className="flex gap-6">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <ShieldCheck className="size-5 text-green-500" />
              HIPAA COMPLIANT
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <ShieldCheck className="size-5 text-blue-500" />
              SOC2 TYPE II
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <Lock className="size-5 text-red-500" />
              AES-256
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT COLUMN — BRANDING (NEW STRUCTURE, SAME TEXT) */}
    <div className="hidden lg:flex flex-col justify-center px-14 bg-gradient-to-b from-blue-50 to-blue-200">
      <h3 className="mb-6 text-4xl font-bold leading-tight text-center">
        Secure Password <br />
        Recovery
      </h3>

      <p className="mx-auto max-w-xl text-center text-xl opacity-90 leading-relaxed">
        Your account security is our priority. Reset your password
        safely with our encrypted recovery system.
      </p>

      <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl mx-auto">
        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <p className="text-3xl font-bold">100%</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Encrypted
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <p className="text-3xl font-bold">SOC2</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Certified
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <p className="text-3xl font-bold">HIPAA</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Compliant
          </p>
        </div>
      </div>
    </div>
  </div>
);


}
