import {
  Mail,
  ArrowRight,
  FileText,
  CreditCard,
  Share2,
  Hospital,
  Loader2,
  Book,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";


export default function GetStarted() {

  const SERVER_URL = import.meta.env.VITE_API_BASE_URL!

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = { name: "", email: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log("Form submitted:", formData);
      const response = await fetch(`${SERVER_URL}/api/auth/signup`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();

      toast.success(data.message , { duration: 5000 });
      setFormData({ name: "", email: "" });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT SECTION */}
      <div className="flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 bg-white">
        {/* <div className="flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 lg:items-start bg-white"> */}

        {/* Logo */}
        <Link to="/">
          <div className="mb-16 flex items-center gap-2">
            <Hospital className="size-10 text-blue-500" />
            <h2 className="text-xl font-bold tracking-tight text-blue-500">
              ClinicAI
            </h2>
          </div>
        </Link>

        {/* Heading */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          {/* <h1 className="text-3xl font-semibold text-gray-900 mb-2 text-center lg:text-left"> */}
          Get started for free
        </h1>
        <p className="text-gray-500 mb-8 max-w-md">
          {/* <p className="text-gray-500 mb-8 max-w-md text-center lg:text-left"> */}
          Join thousands of independent practitioners using ClinicAI to
          streamline their clinical documentation.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Name
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. John Smith"
                className={`text-gray-700 w-full rounded-lg border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 ${
                  errors.name ? "focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                disabled={isSubmitting}
              />
              <Book className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Work Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="dr.smith@yourclinic.com"
                className={` text-gray-700 w-full rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 ${
                  errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                disabled={isSubmitting}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="hover:cursor-pointer w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Get Activation Link
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 mt-4 text-center lg:text-left">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Log In
            </Link>
          </p>
        </form>

        {/* Compliance */}
        <div className="flex gap-6 mt-10 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              ✓
            </span>
            HIPAA COMPLIANT
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              ✓
            </span>
            SOC2 CERTIFIED
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
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
