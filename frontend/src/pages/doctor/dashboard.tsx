import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PatientDetailsModal from "@/components/PatientDetailsModal";
import {
  Stethoscope,
  ClipboardList,
  CreditCard,
  Mic,
  Loader2,
  ChevronRight,
} from "lucide-react";

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

interface RecentVisit {
  visitId: string;
  patientMongoId: string;
  patientId: string;
  patientName: string;
  visitDate: string | null;
  status: "review" | "billing" | "completed";
}

interface DashboardStats {
  todayVisits: number;
  inReview: number;
  readyForBilling: number;
  recentActivity: RecentVisit[];
}

const STATUS_CONFIG = {
  review: {
    label: "Ready for Review",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    action: "Review",
    actionColor: "text-blue-600 hover:text-blue-800",
  },
  billing: {
    label: "Billing Pending",
    pill: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
    action: "Finalize",
    actionColor: "text-blue-600 hover:text-blue-800",
  },
  completed: {
    label: "Completed",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-400",
    action: "Details",
    actionColor: "text-slate-400 hover:text-slate-600",
  },
};

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function avatarHue(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

function fmtVisitTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (isToday) {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  if (isYesterday) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function firstName(fullName: string) {
  return fullName.trim().split(" ")[0];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/dashboard/stats`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        setStats(await res.json());
      } catch {
        setStats({
          todayVisits: 0,
          inReview: 0,
          readyForBilling: 0,
          recentActivity: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  const statCards = [
    {
      icon: Stethoscope,
      label: "Today's Visits",
      value: stats?.todayVisits ?? 0,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: ClipboardList,
      label: "In Review",
      value: stats?.inReview ?? 0,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      icon: CreditCard,
      label: "Ready for Billing",
      value: stats?.readyForBilling ?? 0,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f7f8]">

      {/* ── Welcome header ── */}
      <div className="bg-white border-b border-slate-100 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">
              Dashboard
            </p>
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
              {greeting()}, Dr.&nbsp;{user ? firstName(user.name) : "Doctor"}&nbsp;👋
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Here's what's happening in your practice today
            </p>
          </div>
          <div className="text-right hidden sm:block flex-shrink-0">
            <p className="text-sm font-medium text-slate-700">{todayLabel()}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
              {statCards.map(({ icon: Icon, label, value, iconBg, iconColor }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
                >
                  <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <p className="text-sm text-slate-500">{label}</p>
                  {loading ? (
                    <div className="h-8 w-12 bg-slate-100 rounded animate-pulse mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Recent Patient Activity */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">Recent Patient Activity</h2>
                <button
                  onClick={() => navigate("/doctor/patients")}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-0.5 hover:cursor-pointer"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {loading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                </div>
              ) : !stats?.recentActivity.length ? (
                <div className="p-10 text-center text-slate-400 text-sm">
                  No recent activity yet
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Time</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Patient</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentActivity.map((row) => {
                      const cfg = STATUS_CONFIG[row.status] ?? STATUS_CONFIG.completed;
                      const hue = avatarHue(row.patientName);
                      return (
                        <tr
                          key={row.visitId}
                          className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                        >
                          {/* Time */}
                          <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                            {row.visitDate ? fmtVisitTime(row.visitDate) : "—"}
                          </td>

                          {/* Patient */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 select-none"
                                style={{
                                  background: `hsl(${hue},55%,88%)`,
                                  color: `hsl(${hue},45%,35%)`,
                                }}
                              >
                                {getInitials(row.patientName)}
                              </span>
                              <div>
                                <p className="font-semibold text-slate-800 leading-tight">
                                  {row.patientName}
                                </p>
                                <p className="text-xs text-slate-400">
                                  #{row.patientId.slice(-6)}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.pill}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => navigate(`/doctor/patients/${row.patientMongoId}`)}
                              className={`text-sm font-medium hover:cursor-pointer ${cfg.actionColor}`}
                            >
                              {cfg.action}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-4">
            {/* New Consultation card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="h-28 relative flex items-end p-4">
                <img
                  src="/consultation-bg.jpg"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <h3 className="relative text-lg font-bold text-white">New Consultation</h3>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-sm text-slate-500">
                  Start a new session to generate AI SOAP notes immediately.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors hover:cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  Record Live Visit
                </button>
              </div>
            </div>

            {/* System status */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3">
                System Health
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: "AI Processing", status: "Online" },
                  { label: "Voice Capture", status: "Active" },
                ].map(({ label, status }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <PatientDetailsModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
