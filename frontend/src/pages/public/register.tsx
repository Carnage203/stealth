import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  Lock,
  Phone,
  User,
  Building2,
  Briefcase,
  Calendar,
  Eye,
  EyeOff,
  Hospital,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast from "react-hot-toast";

export default function Registration() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    speciality: "",
    experience: "",
    practiceType: "private",
    organizationName: "",
    phoneNumber: "",
    password: "",
  });

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        toast.error("Activation token is missing!", {
          duration: 4000,
        });

        // navigate("/get-activation-link");
        return;
      }

      setIsValidatingToken(true);
      try {
        const response = await fetch("/api/auth/validate-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Invalid token");
        }

        const data = await response.json();

        // Pre-fill name and email from token validation

        setFormData((prev) => ({
          ...prev,
          fullName: data.name || "",
          email: data.email || "",
        }));

        setIsTokenValid(true);
        toast.success("Email verified! Please complete your registration.", {
          duration: 3000,
          icon: "✅",
        });
      } catch (err: any) {
        toast.error(
          err.message || "Token validation failed. Please request a new link.",
          {
            duration: 4000,
          }
        );
        // setTimeout(() => {
        //   navigate("/get-activation-link");
        // }, 2000);
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Replace with your actual API call
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Registration successful! Welcome to ClinicAI.", {
        duration: 5000,
        icon: "🎉",
      });

      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.", {
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Show loading spinner while validating token
  if (isValidatingToken) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="size-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">
            Validating your activation link...
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Please wait while we verify your email.
          </p>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="text-center">
          <AlertCircle className="size-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">
            Invalid or expired activation link.
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Please request a new activation link to continue.
          </p>
          <Button
            onClick={() => navigate("/get-activation-link")}
            className="mt-4"
          >
            Get Activation Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex w-full max-w-7xl mx-auto">
        {/* Left Column: Form */}
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:items-start lg:px-20 xl:px-24">
          <div className="w-full max-w-[440px]">
            {/* Logo */}
            <Link to="/" className="mb-10 inline-block">
              <img
                src="/logo-clinicai-blue.png"
                alt="ClinicAI Logo"
                className="h-8 w-auto"
              />
            <div className="mb-8 flex items-center gap-3">
              <Hospital className="size-6 text-blue-600" />
              <h2 className="text-xl font-bold tracking-tight">ClinicAI</h2>
            </div>
            </Link>

            {/* Email Verified Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clipRule="evenodd"
                />
              </svg>
              Email Verified
            </div>

            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              Complete your profile
            </h1>
            <p className="mb-8 text-slate-500">
              Set up your professional credentials to begin using ClinicAI.
            </p>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName" className="text-sm font-semibold">
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    className="h-12 pr-12"
                    placeholder="Dr. Jane Smith"
                    value={formData.fullName}
                    readOnly
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="size-5" />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    className="h-12 pr-12"
                    placeholder="dr.smith@clinic.com"
                    value={formData.email}
                    readOnly
                    disabled
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="size-5" />
                  </div>
                </div>
              </div>

              {/* Speciality and Experience */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="speciality" className="text-sm font-semibold">
                    Speciality
                  </Label>
                  <Select
                    value={formData.speciality}
                    onValueChange={(value) =>
                      handleInputChange("speciality", value)
                    }
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select Speciality" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-black">
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="general">General Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="experience" className="text-sm font-semibold">
                    Experience (Years)
                  </Label>
                  <div className="relative">
                    <Input
                      id="experience"
                      type="number"
                      className="h-12 pr-12"
                      placeholder="e.g. 10"
                      value={formData.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                      required
                    />
                    {/* <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Calendar className="size-5" />
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Practice Type */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold">Practice Type</Label>
                <RadioGroup
                  value={formData.practiceType}
                  onValueChange={(value) =>
                    handleInputChange("practiceType", value)
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="private"
                      id="private"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="private"
                      className="flex flex-col items-start gap-1 rounded-lg border-2 border-slate-200 p-4 hover:bg-slate-500/40 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-slate-500/50 cursor-pointer transition-all"
                    >
                      <span className="font-semibold">Private Practice</span>
                      <span className="text-xs text-slate-500">
                        Independent clinic
                      </span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="organization"
                      id="organization"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="organization"
                      className="flex flex-col items-start gap-1 rounded-lg border-2 border-slate-200 p-4 hover:bg-slate-500/40 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-slate-500/50 cursor-pointer transition-all"
                    >
                      <span className="font-semibold ">Organization</span>
                      <span className="text-xs text-slate-500">
                        Hospital or Group
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Organization Name */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="organizationName"
                  className="text-sm font-semibold"
                >
                  {formData.practiceType === "private"
                    ? "Clinic Name"
                    : "Hospital/Organization Name"}
                </Label>
                <div className="relative">
                  <Input
                    id="organizationName"
                    className="h-12 pr-12"
                    placeholder="Clinic or Hospital Name"
                    value={formData.organizationName}
                    onChange={(e) =>
                      handleInputChange("organizationName", e.target.value)
                    }
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Building2 className="size-5" />
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="phoneNumber" className="text-sm font-semibold">
                  Phone Number
                </Label>
                <div className="relative">
                  <Input
                    id="phoneNumber"
                    type="tel"
                    className="h-12 pr-12"
                    placeholder="+91 9876543210"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone className="size-5" />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Set Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="h-12 pr-12"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Minimum 8 characters with at least one number and symbol
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className=" hover:cursor-pointer mt-4 h-12 w-full text-base font-semibold"
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
                    Completing Registration...
                  </>
                ) : (
                  <>
                    <User className="mr-2 size-5" />
                    Complete Registration
                  </>
                )}
              </Button>
            </form>

            {/* Compliance Badges */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
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
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-1.5">
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
                Bank-Grade Security
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
                Designed for healers, <br />
                powered by intelligence.
              </h3>

              <div className="mt-12 space-y-6">
                <div className="flex items-start gap-4 text-white">
                  <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                      <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">
                      Documentation in seconds
                    </h4>
                    <p className="text-sm text-blue-50 opacity-90">
                      Reduce administrative burden by up to 80% with
                      AI-generated clinical notes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-white">
                  <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516 11.209 11.209 0 0 1-7.877-3.08Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">
                      Privacy by Design
                    </h4>
                    <p className="text-sm text-blue-50 opacity-90">
                      End-to-end encryption ensures patient data never leaves
                      your secure environment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center text-white/80 text-sm">
                <p className="font-medium">TRUSTED BY 100+ CLINICS</p>
                <p className="text-xs mt-1">SOC2 TYPE II CERTIFIED</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
