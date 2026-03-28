import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Hospital,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

 return (
  <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
    {/* LEFT COLUMN — LOGIN FORM (UNCHANGED CONTENT) */}
    <div className="flex flex-col items-center justify-center px-6 lg:px-20 bg-white">
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

        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Doctor Login
        </h1>
        <p className="mb-10">
          Secure access to your clinical workspace.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Work Email</span>
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

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Password</span>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                className="h-12 w-full rounded-lg border border-slate-200 px-4 pr-12 text-base placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="text-center text-sm text-slate-500">
            New here?{" "}
            <Link
              to="/get-activation-link"
              className="font-bold text-blue-500 hover:underline"
            >
              Get an Activation Link
            </Link>
          </p>
        </form>

        {/* Compliance */}
        <div className="mt-16 flex items-center justify-center gap-6 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-green-500" />
            HIPAA COMPLIANT
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-blue-500" />
            SOC2 CERTIFIED
          </div>
          <div className="flex items-center gap-2">
            <Lock className="size-5 text-red-500" />
            AES-256
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT COLUMN — BRANDING (NEW STRUCTURE, SAME TEXT) */}
    <div className="hidden lg:flex flex-col justify-center px-14 bg-gradient-to-b from-blue-50 to-blue-200">
      <h3 className="mb-6 text-4xl font-bold leading-tight text-center">
        Designed for doctors, <br />
        powered by intelligence.
      </h3>

      <p className="mx-auto mb-12 max-w-xl text-center text-xl opacity-90">
        Spend more time with patients and less time on paperwork. Join
        5,000+ independent clinics today.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <p className="text-3xl font-bold">98%</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Accuracy Rate
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <p className="text-3xl font-bold">2hrs</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Daily Savings
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <p className="text-3xl font-bold">100%</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Data Security
          </p>
        </div>
      </div>

      <p className="mt-12 text-center text-sm text-slate-500">
        Trusted by <span className="font-semibold">5,000+</span> clinics worldwide
      </p>
    </div>
  </div>
);


}
