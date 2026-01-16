import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  FileText,
  CreditCard,
  Share2,
  Hospital,
  Book,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function GetActivationToken() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Replace with your actual API call
      const response = await fetch("/api/auth/get-activation-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to send activation link");
      }

      toast.success("Activation link sent! Check your email inbox.", {
        duration: 5000,
        icon: "📧",
      });

      // Optionally navigate to a success page
      // navigate("/check-email");
    } catch (err: any) {
      toast.error(
        err.message || "Failed to send activation link. Please try again.",
        {
          duration: 4000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full ">
      <div className="flex w-full max-w-7xl mx-auto">
        {/* Left Column: Form */}
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:items-start lg:px-20 xl:px-24">
          <div className="w-full max-w-[440px]">
            {/* Logo */}
            <Link to="/">
              <div className="mb-16 flex items-center gap-2">
                <Hospital className="size-10 text-blue-500" />
                <h2 className="text-xl font-bold tracking-tight text-blue-500">
                  ClinicAI
                </h2>
              </div>
            </Link>

            <h1 className="mb-3 text-4xl font-bold tracking-tight ">
              Get started for free
            </h1>
            <p className="mb-10 text-lg text-slate-400 leading-relaxed">
              Join thousands of independent practitioners using ClinicAI to
              streamline their clinical documentation.
            </p>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-semibold ">
                  Name
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    className="h-14 pr-12 text-base"
                    placeholder="Your full name"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 ">
                    <Book className="size-5" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-semibold ">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    className="h-14 pr-12 text-base"
                    placeholder="dr.smith@yourclinic.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 ">
                    <Mail className="size-5" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="hover:cursor-pointer h-14 w-full text-base font-semibold bg-blue-500 hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending Link...
                  </>
                ) : (
                  <>
                    Get Activation Link
                    <ArrowRight className="ml-2 size-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-500 hover:underline"
                >
                  Log In
                </Link>
              </p>
            </div>

            {/* Compliance Badges */}
            <div className="mt-16 flex items-center justify-center gap-6 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-green-500" />
                HIPAA COMPLIANT
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-blue-500" />
                SOC2 CERTIFIED
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Lock className="size-5 text-red-500" />
                AES-256
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Features */}
        <div className="hidden lg:relative lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center overflow-hidden py-10 pr-10">
          <div className="relative z-0 h-full w-full ">
            <img
              alt="Modern clinical setting"
              className="h-full w-full object-cover rounded-4xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaq472xiAzrBfcy3EhKvhU3qupVRT5n-vZ1trFbTFacHwbAAJYI5RIjZHrKzRJXsNBS_WuP0yyogaJe16lOLPjHFQ8peIDQqmX4UfCFd9w4MbEVKqsAPGrte2TK6foPDsi8Gr7-w98n2IoFtbChHuJa6DjN0gmTtxle3YGsuTt1mGEha6mp-_PjBvSqf-Hd6vyV_HJ0YaphC2Y5t_IVQSXSmmFoypKp3SXv4BKutNHl9kzxNVv2z9NmoMidmiWnQmT9FGcEVFCxUSm"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 via-blue-500/40 to-transparent rounded-4xl"></div> */}

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-12">
              <div className=" items-center justify-center mb-2 inline-flex gap-2 rounded-full bg-teal-50 px-4 py-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
                <div className="size-2 rounded-full bg-teal-500"></div>
                Empowering Independent Care
              </div>
              <h2 className="mb-6 text-5xl font-bold leading-tight text-slate-900">
                Focus on patients,{" "}
                <span className="italic">not paperwork.</span>
              </h2>
              <div className="space-y-3">
                {/* Feature 1 */}
                <div className="rounded-2xl bg-white p-2 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                      <FileText className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 mb-2">
                        AI-Generated SOAP Notes
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Reduce documentation time by up to 60%. Our AI drafts
                        comprehensive notes from your patient sessions in
                        seconds.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Feature 2 */}
                <div className="rounded-2xl bg-white p-2 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 flex-shrink-0">
                      <CreditCard className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 mb-2">
                        Intelligent Billing Suggestions
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Minimize claim denials with real-time coding suggestions
                        tailored to your clinical documentation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="rounded-2xl bg-white p-2 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 flex-shrink-0">
                      <Share2 className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 mb-2">
                        Universal Exports
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Seamlessly export your data to PDF or Google Docs.
                        Maintain total control and portability of your patient
                        records.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex items-center gap-3">
                  <div className="flex -space-x-3">
                    <div className="size-10 rounded-full bg-[url('https://img.freepik.com/free-photo/portrait-experienced-professional-therapist-with-stethoscope-looking-camera_1098-19305.jpg?semt=ais_hybrid&w=740&q=80')] bg-cover bg-center border-2 border-white"></div>
                    <div className="size-10 rounded-full bg-[url('https://media.istockphoto.com/id/1165314750/photo/living-that-urban-life.webp?b=1&s=612x612&w=0&k=20&c=qcb3jWENfvlAtTGjE3wwlCaSoUBhMMTI9V7Yehyc-b0=')] bg-cover bg-center border-2 border-white"></div>
                    <div className="size-10 rounded-full bg-[url('https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827774.jpg')] bg-cover bg-center border-2 border-white"></div>
                    <div className="size-10 rounded-full bg-[url('https://static.vecteezy.com/system/resources/previews/015/265/164/non_2x/beautiful-young-female-medical-doctor-is-looking-at-camera-and-smiling-shot-of-a-female-doctor-standing-confidently-with-her-arms-crossed-photo.jpg')] bg-cover bg-center border-2 border-white"></div>
                  </div>
                  <p className="text-sm font-medium">Join 100+ clinicians</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
