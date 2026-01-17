import { useState, useEffect, useRef } from "react";
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
  FileText,
  CreditCard,
  Share2,
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
  const SERVER_URL = import.meta.env.VITE_API_BASE_URL!;
  const hasCheckedToken = useRef(false);

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
    practiceType: "private",
    yearsOfExperience: "",
    organizationName: "",
    phoneNumber: "",
    password: "",
  });

  // Validate token on component mount
  useEffect(() => {
    if (hasCheckedToken.current) return;
    hasCheckedToken.current = true;

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
        const response = await fetch(
          `${SERVER_URL}/api/auth/activate?token=${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          },
        );

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
          },
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
    console.log("Submitting form data:", formData);

    try {
      // Replace with your actual API call
      const response = await fetch(`${SERVER_URL}/api/auth/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctor: formData, token: token }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Registration successful!", {
        duration: 5000,
      });

      navigate("/doctor");
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT COLUMN */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:px-20 xl:px-24 bg-white">
        {/* Logo */}
        <Link to="/" className="mb-10 inline-block">
          <div className="flex items-center gap-3">
            <Hospital className="size-6 text-blue-600" />
            <h2 className="text-xl font-bold tracking-tight">ClinicAI</h2>
          </div>
        </Link>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Complete your profile
        </h1>
        <p className="mb-8 text-slate-500">
          Set up your professional credentials to begin using ClinicAI.
        </p>

        {/* Data Collection Form  */}
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
                onChange={(e) => handleInputChange("fullName", e.target.value)}
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
                  value={formData.yearsOfExperience}
                  onChange={(e) =>
                    handleInputChange("yearsOfExperience", e.target.value)
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
                  className="flex flex-col items-start gap-1 rounded-lg border-2 border-slate-200 p-4 hover:bg-gradient-to-b from-blue-50 to-blue-100 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-linear-to-b from-blue-50 to-blue-100 cursor-pointer transition-all"
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
                  className="flex flex-col items-start gap-1 rounded-lg border-2 border-slate-200 p-4 hover:bg-linear-to-b from-blue-50 to-blue-100 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-linear-to-b from-blue-50 to-blue-100 cursor-pointer transition-all"
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
            <Label htmlFor="organizationName" className="text-sm font-semibold">
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
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                <Loader2 className="size-5 animate-spin" />
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

        {/* Compliance */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs font-bold text-slate-500">
          <span>HIPAA COMPLIANT</span>
          <span>BANK-GRADE SECURITY</span>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="hidden lg:flex flex-col justify-center px-14 bg-gradient-to-b from-blue-50 to-blue-100">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-white px-4 py-1 rounded-full w-fit mb-6">
          ● EMPOWERING INDEPENDENT CARE
        </span>

        <h2 className="text-4xl font-semibold text-gray-900 leading-tight mb-10">
          Focus on patients,{" "}
          <span className="text-blue-600 italic font-serif">
            not paperwork.
          </span>
        </h2>

        <div className="space-y-6 max-w-lg">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                AI-Generated SOAP Notes
              </h3>
              <p className="text-sm text-gray-500">
                Generate accurate clinical notes in seconds and reduce
                documentation time by up to 60%.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Intelligent Billing
              </h3>
              <p className="text-sm text-gray-500">
                Real-time billing suggestions help reduce claim denials and
                revenue loss.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Universal Exports
              </h3>
              <p className="text-sm text-gray-500">
                Export records securely to PDF or Google Docs anytime.
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-12">
          Trusted by <span className="font-medium">2,000+</span> clinicians
        </p>
      </div>
    </div>
  );
}
