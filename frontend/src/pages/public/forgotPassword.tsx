import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
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
    <div className="flex min-h-screen w-full">
      <div className="flex w-full max-w-7xl mx-auto">
        {/* Left Column: Form */}
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:items-start lg:px-20 xl:px-20">
          <div className="w-full max-w-[440px]">
            {/* Logo */}
            <div className="mb-12 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold tracking-tight">ClinicAi</h2>
            </div>

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
                        className="h-12 w-full rounded-lg border border-slate-200 px-4 pr-12 text-base  placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="dr.smith@clinic.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="size-5" />
                      </div>
                    </div>
                  </div>

                  <button
                    className="hover:cursor-pointer mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                  <p className="mb-8 font-semibold ">{email}</p>

                  <p className="text-sm text-slate-500 mb-6">
                    Didn't receive the email? Check your spam folder also
                  </p>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="text-sm font-medium hover:cursor-pointer text-blue-500 hover:text-blue-600 hover:underline"
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

            <div className="mt-16 flex flex-col items-center gap-6 border-t border-slate-100 pt-8 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
                Industry-Standard Compliance
              </p>
              <div className="flex gap-6">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 text-green-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516 11.209 11.209 0 0 1-7.877-3.08Zm3.154 8.438a.75.75 0 1 0-1.06-1.06l-3.97 3.97-1.8-1.8a.75.75 0 1 0-1.06 1.06l2.33 2.33a.75.75 0 0 0 1.06 0l4.5-4.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  HIPAA COMPLIANT
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 text-blue-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516 11.209 11.209 0 0 1-7.877-3.08Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  SOC2 TYPE II
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 text-slate-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  AES-256
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Branding */}
        <div className="hidden lg:relative lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center overflow-hidden py-10 pr-10">
          <div className="relative z-0 h-full w-full">
            <img
              alt="Modern clinical setting"
              className="h-full w-full object-cover rounded-4xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaq472xiAzrBfcy3EhKvhU3qupVRT5n-vZ1trFbTFacHwbAAJYI5RIjZHrKzRJXsNBS_WuP0yyogaJe16lOLPjHFQ8peIDQqmX4UfCFd9w4MbEVKqsAPGrte2TK6foPDsi8Gr7-w98n2IoFtbChHuJa6DjN0gmTtxle3YGsuTt1mGEha6mp-_PjBvSqf-Hd6vyV_HJ0YaphC2Y5t_IVQSXSmmFoypKp3SXv4BKutNHl9kzxNVv2z9NmoMidmiWnQmT9FGcEVFCxUSm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 via-blue-500/40 to-transparent rounded-4xl"></div>

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-12">
              <div className="mb-8 flex justify-center">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-12 text-white"
                  >
                    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                  </svg>
                </div>
              </div>
              <h3 className="mb-6 text-4xl font-bold leading-tight text-white text-center">
                Secure Password <br />
                Recovery
              </h3>
              <p className="text-xl text-white opacity-90 leading-relaxed text-center">
                Your account security is our priority. Reset your password
                safely with our encrypted recovery system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
