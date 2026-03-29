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
  ArrowRight,
  FileText,
  CreditCard,
  Share2,
  Book,
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
      <div className="flex flex-col items-center justify-center px-6 lg:px-20 ">
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
          <p className="mb-10">Secure access to your clinical workspace.</p>

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
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-teal-700 bg-white px-5 py-1.5 rounded-full shadow-sm w-fit mb-6">
          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
          EMPOWERING INDEPENDENT CARE
        </span>

        <h2 className="text-4xl font-semibold text-gray-900 leading-tight mb-10">
          Focus on patients,
          <span className="block text-blue-600 italic font-serif">
            not paperwork.
          </span>
        </h2>

        {/* Feature Cards */}
        <div className="space-y-6 max-w-lg">
          <FeatureCard
            icon={<FileText className="w-5 h-5" />}
            title="AI-Generated SOAP Notes"
            description="Reduce documentation time by up to 60%. Our AI drafts comprehensive notes from your patient sessions in seconds."
            bg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <FeatureCard
            icon={<CreditCard className="w-5 h-5" />}
            title="Intelligent Billing Suggestions"
            description="Minimize claim denials with real-time coding suggestions tailored to your clinical documentation."
            bg="bg-emerald-100"
            iconColor="text-emerald-600"
          />

          <FeatureCard
            icon={<Share2 className="w-5 h-5" />}
            title="Universal Exports"
            description="Seamlessly export your data to PDF or Google Docs. Maintain total control and portability of your patient records."
            bg="bg-gray-100"
            iconColor="text-gray-700"
          />
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-12">
          Join <span className="font-medium">2,000+</span> clinicians
        </p>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  bg,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex gap-4">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg} ${iconColor}`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
