// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Eye, EyeOff, Loader2 } from "lucide-react";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const from = location.state?.from?.pathname || "/dashboard";

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       await login(email, password);
//       navigate(from, { replace: true });
//     } catch (err: any) {
//       setError(err.message || "Login failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen max-w-7xl flex items-center justify-center bg-transparent p-4">
//       <div>
//         {" "}
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle>Login</CardTitle>
//             <CardDescription>
//               Enter your credentials to access your account
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {error && (
//                 <Alert variant="destructive">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="your@email.com"
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showConfirmPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter your password"
//                     required
//                     className="pr-10"
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     className="hover:cursor-pointer absolute right-0 top-0 h-full px-3 hover:bg-transparent"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="h-4 w-4 text-muted-foreground" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-muted-foreground" />
//                     )}
//                   </Button>
//                 </div>
//               </div>

//               <Button
//                 type="submit"
//                 className="hover:cursor-pointer w-full"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Logging in...
//                   </>
//                 ) : (
//                   "Login"
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="hidden lg:relative lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:bg-slate-900 overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           <img
//             alt="Modern clinical setting"
//             className="h-full w-full object-cover opacity-90"
//             src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaq472xiAzrBfcy3EhKvhU3qupVRT5n-vZ1trFbTFacHwbAAJYI5RIjZHrKzRJXsNBS_WuP0yyogaJe16lOLPjHFQ8peIDQqmX4UfCFd9w4MbEVKqsAPGrte2TK6foPDsi8Gr7-w98n2IoFtbChHuJa6DjN0gmTtxle3YGsuTt1mGEha6mp-_PjBvSqf-Hd6vyV_HJ0YaphC2Y5t_IVQSXSmmFoypKp3SXv4BKutNHl9kzxNVv2z9NmoMidmiWnQmT9FGcEVFCxUSm"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-slate-900/10 mix-blend-multiply"></div>
//           <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]"></div>
//         </div>

//         <div className="relative z-10 mx-12 max-w-lg text-center text-white">
//           <div className="mb-8 flex justify-center">
//             <div className="flex size-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl">
//               <span className="material-symbols-outlined text-[48px] text-white">
//                 Logo{" "}
//               </span>
//             </div>
//           </div>
//           <h3 className="mb-6 text-4xl font-bold leading-tight">
//             Designed for doctors, <br />
//             powered by intelligence.
//           </h3>
//           <p className="text-xl text-blue-50 opacity-90 leading-relaxed">
//             Spend more time with patients and less time on paperwork. Join
//             5,000+ independent clinics today.
//           </p>

//           <div className="mt-12 flex items-center justify-center gap-8 border-t border-white/20 pt-8">
//             <div className="text-center">
//               <p className="text-3xl font-bold">98%</p>
//               <p className="text-xs uppercase tracking-widest font-semibold opacity-70">
//                 Accuracy Rate
//               </p>
//             </div>
//             <div className="h-10 w-px bg-white/20"></div>
//             <div className="text-center">
//               <p className="text-3xl font-bold">2hrs</p>
//               <p className="text-xs uppercase tracking-widest font-semibold opacity-70">
//                 Daily Savings
//               </p>
//             </div>
//             <div className="h-10 w-px bg-white/20"></div>
//             <div className="text-center">
//               <p className="text-3xl font-bold">100%</p>
//               <p className="text-xs uppercase tracking-widest font-semibold opacity-70">
//                 Data Security
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
//           <div className="h-1.5 w-8 rounded-full bg-white"></div>
//           <div className="h-1.5 w-1.5 rounded-full bg-white/40"></div>
//           <div className="h-1.5 w-1.5 rounded-full bg-white/40"></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// ==========================================================================================

import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
    <div className="flex min-h-screen w-full">
      <div className="flex w-full max-w-7xl mx-auto">
        {/* Left Column: Form */}
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:items-start lg:px-20 xl:px-20">
          <div className="w-full max-w-[440px]">
            {/* Logo */}

            <div className="hover:cursor-pointer mb-12 flex items-center gap-3" onClick={() => navigate('/')} >
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
              <h2 className="text-xl font-bold tracking-tight "> ClinicAi</h2>
            </div>

            <h1 className="mb-2 text-3xl font-bold tracking-tight ">
              Doctor Login
            </h1>
            <p className="mb-10 ">Secure access to your clinical workspace.</p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Work Email</span>
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

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold ">Password</span>
                  <Link to="/forgot-password">
                    <button
                      type="button"
                      className="hover:cursor-pointer text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </Link>
                </div>
                <div className="relative">
                  <input
                    className="h-12 w-full rounded-lg border border-slate-200 px-4 pr-12 text-base  placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div
                    className="hover:cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
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

              <button
                className="hover:cursor-pointer mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
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

              <div className="mt-2 text-center">
                <p className="text-sm text-slate-500">
                  New here?{" "}
                  <button
                    type="button"
                    className="font-bold text-blue-500 hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </form>

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
                  <Lock className="size-4 text-slate-400" />
                  AES-256
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Branding */}
        <div className="hidden lg:relative lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center overflow-hidden py-10 pr-10">
          <div className="relative z-0 h-full w-full max-w-125">
            <img
              alt="Modern clinical setting"
              className="h-full w-full object-cover rounded-4xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaq472xiAzrBfcy3EhKvhU3qupVRT5n-vZ1trFbTFacHwbAAJYI5RIjZHrKzRJXsNBS_WuP0yyogaJe16lOLPjHFQ8peIDQqmX4UfCFd9w4MbEVKqsAPGrte2TK6foPDsi8Gr7-w98n2IoFtbChHuJa6DjN0gmTtxle3YGsuTt1mGEha6mp-_PjBvSqf-Hd6vyV_HJ0YaphC2Y5t_IVQSXSmmFoypKp3SXv4BKutNHl9kzxNVv2z9NmoMidmiWnQmT9FGcEVFCxUSm"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 via-blue-500/40 to-transparent rounded-4xl"></div> */}

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
              <h3 className="mb-6 text-4xl font-bold leading-tight  text-center">
                Designed for doctors, <br />
                powered by intelligence.
              </h3>
              <p className="text-xl opacity-90 leading-relaxed text-center">
                Spend more time with patients and less time on paperwork. Join
                5,000+ independent clinics today.
              </p>

              <div className="mt-12 flex items-center justify-center gap-8 border-t border-white/20 pt-8 ">
                <div className="text-center">
                  <p className="text-3xl font-bold">98%</p>
                  <p className="text-xs uppercase tracking-widest font-semibold opacity-70">
                    Accuracy Rate
                  </p>
                </div>
                <div className="h-10 w-px bg-white/20"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold">2hrs</p>
                  <p className="text-xs uppercase tracking-widest font-semibold opacity-70">
                    Daily Savings
                  </p>
                </div>
                <div className="h-10 w-px bg-white/20"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-xs uppercase tracking-widest font-semibold opacity-70">
                    Data Security
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
