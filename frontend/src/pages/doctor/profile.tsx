import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  Stethoscope,
  Briefcase,
  Clock,
  ShieldCheck,
  Pencil,
  X,
  Save,
  Loader2,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

interface DoctorProfile {
  id: string;
  email: string;
  fullName: string;
  speciality: string;
  practiceType: string;
  yearsOfExperience: number;
  organizationName: string;
  phoneNumber: string;
  createdAt: string | null;
  isActive: boolean;
}

interface EditForm {
  fullName: string;
  speciality: string;
  practiceType: string;
  yearsOfExperience: string;
  organizationName: string;
  phoneNumber: string;
}

function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function fmtMemberSince(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-slate-100 last:border-0">
      <div className="p-2 rounded-lg bg-slate-50 flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide leading-none mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-800 truncate">
          {value || <span className="text-slate-400 font-normal">Not set</span>}
        </p>
      </div>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<EditForm>({
    fullName: "",
    speciality: "",
    practiceType: "",
    yearsOfExperience: "",
    organizationName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/auth/profile`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data: DoctorProfile = await res.json();
        setProfile(data);
        setForm({
          fullName: data.fullName,
          speciality: data.speciality,
          practiceType: data.practiceType,
          yearsOfExperience: String(data.yearsOfExperience),
          organizationName: data.organizationName,
          phoneNumber: data.phoneNumber,
        });
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const res = await fetch(`${SERVER_URL}/auth/update-profile`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken(),
        },
        body: JSON.stringify({
          fullName: form.fullName || undefined,
          speciality: form.speciality || undefined,
          practiceType: form.practiceType || undefined,
          yearsOfExperience: form.yearsOfExperience
            ? Number(form.yearsOfExperience)
            : undefined,
          organizationName: form.organizationName || undefined,
          phoneNumber: form.phoneNumber || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Update failed");
      }
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              fullName: form.fullName,
              speciality: form.speciality,
              practiceType: form.practiceType,
              yearsOfExperience: Number(form.yearsOfExperience),
              organizationName: form.organizationName,
              phoneNumber: form.phoneNumber,
            }
          : prev,
      );
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;
    setForm({
      fullName: profile.fullName,
      speciality: profile.speciality,
      practiceType: profile.practiceType,
      yearsOfExperience: String(profile.yearsOfExperience),
      organizationName: profile.organizationName,
      phoneNumber: profile.phoneNumber,
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 text-center text-red-500">{error ?? "Profile not found"}</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f8] pb-10">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 pt-10 pb-20">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end gap-5">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center flex-shrink-0 shadow-xl">
            <span className="text-3xl font-extrabold text-white tracking-tight select-none">
              {getInitials(profile.fullName)}
            </span>
          </div>

          {/* Name + badges */}
          <div className="flex-1 pb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Dr. {profile.fullName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {profile.speciality && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                  <Stethoscope className="w-3 h-3" />
                  {capitalize(profile.speciality)}
                </span>
              )}
              {profile.practiceType && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-medium backdrop-blur-sm">
                  <Briefcase className="w-3 h-3" />
                  {capitalize(profile.practiceType)} Practice
                </span>
              )}
              {profile.organizationName && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-medium backdrop-blur-sm">
                  <Building2 className="w-3 h-3" />
                  {profile.organizationName}
                </span>
              )}
            </div>
          </div>

          {/* Edit / Save button */}
          <div className="pb-1">
            {editing ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                >
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-white text-blue-700 hover:bg-blue-50 font-semibold"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-1" />
                  )}
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setEditing(true)}
                className="bg-white/15 border border-white/30 text-white hover:bg-white/25 backdrop-blur-sm"
                variant="outline"
              >
                <Pencil className="w-4 h-4 mr-1.5" /> Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cards area — overlaps the banner */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 -mt-10 space-y-4">
        {editing ? (
          /* ── Edit Form ── */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-5">
              Edit Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                  Full Name
                </Label>
                <Input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  placeholder="Full name"
                  className="h-10 text-sm border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                  Phone Number
                </Label>
                <Input
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phoneNumber: e.target.value }))
                  }
                  placeholder="Phone number"
                  className="h-10 text-sm border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                  Speciality
                </Label>
                <Input
                  value={form.speciality}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, speciality: e.target.value }))
                  }
                  placeholder="e.g. Neurology"
                  className="h-10 text-sm border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                  Practice Type
                </Label>
                <Input
                  value={form.practiceType}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, practiceType: e.target.value }))
                  }
                  placeholder="e.g. Private"
                  className="h-10 text-sm border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                  Organization / Hospital
                </Label>
                <Input
                  value={form.organizationName}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      organizationName: e.target.value,
                    }))
                  }
                  placeholder="Organization name"
                  className="h-10 text-sm border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                  Years of Experience
                </Label>
                <Input
                  type="number"
                  min={0}
                  max={60}
                  value={form.yearsOfExperience}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      yearsOfExperience: e.target.value,
                    }))
                  }
                  placeholder="e.g. 5"
                  className="h-10 text-sm border-slate-200"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Email address cannot be changed here.
            </p>
          </div>
        ) : (
          /* ── Read-only view ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Contact Information
              </h2>
              <InfoRow
                icon={User}
                label="Full Name"
                value={`Dr. ${profile.fullName}`}
              />
              <InfoRow icon={Mail} label="Email Address" value={profile.email} />
              <InfoRow
                icon={Phone}
                label="Phone Number"
                value={profile.phoneNumber}
              />
            </div>

            {/* Professional Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Professional Details
              </h2>
              <InfoRow
                icon={Stethoscope}
                label="Speciality"
                value={capitalize(profile.speciality)}
              />
              <InfoRow
                icon={Building2}
                label="Organization"
                value={profile.organizationName}
              />
              <InfoRow
                icon={Briefcase}
                label="Practice Type"
                value={capitalize(profile.practiceType)}
              />
              <InfoRow
                icon={Clock}
                label="Experience"
                value={
                  profile.yearsOfExperience
                    ? `${profile.yearsOfExperience} year${profile.yearsOfExperience !== 1 ? "s" : ""}`
                    : null
                }
              />
            </div>
          </div>
        )}

        {/* Account Info — always visible */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
            Account
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-50">
                <CalendarDays className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                  Member Since
                </p>
                <p className="text-sm font-medium text-slate-800">
                  {profile.createdAt
                    ? fmtMemberSince(profile.createdAt)
                    : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-50">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                  Account Status
                </p>
                <span
                  className={`inline-flex items-center gap-1 text-sm font-semibold ${
                    profile.isActive ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      profile.isActive ? "bg-emerald-500" : "bg-red-400"
                    }`}
                  />
                  {profile.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
