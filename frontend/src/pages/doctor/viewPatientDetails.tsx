import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, History, Loader2, ChevronRight } from "lucide-react";

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string | null;
  status: "review" | "billing" | "completed";
}

interface VisitItem {
  id: string;
  date: string;
}

const STATUS_CONFIG = {
  review: {
    label: "Ready for Review",
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
  billing: {
    label: "Billing Pending",
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  completed: {
    label: "Finalized",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
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

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ViewPatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<PatientData | null>(null);
  const [visits, setVisits] = useState<VisitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${SERVER_URL}/patients/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Patient not found");
        const data = await res.json();
        setPatient(data.patient);
        const sorted = [...(data.visits as VisitItem[])].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setVisits(sorted);
      } catch {
        setError("Failed to load patient details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-8">
        <p className="text-red-500 mb-4">{error ?? "Patient not found"}</p>
        <button
          onClick={() => navigate("/doctor/patients")}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Patients
        </button>
      </div>
    );
  }

  const hue = avatarHue(patient.name);
  const lastVisit = visits[0]?.date ?? null;
  const statusCfg = STATUS_CONFIG[patient.status] ?? STATUS_CONFIG.completed;

  return (
    <div className="min-h-screen bg-[#f6f7f8]">

      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-6 py-3.5 flex items-center gap-2 text-sm text-slate-500">
        <button
          onClick={() => navigate("/doctor/patients")}
          className="flex items-center gap-1.5 hover:text-slate-800 transition-colors hover:cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Patients
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-400">Directory</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="font-medium text-slate-800">{patient.name}</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── Patient Header Card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold flex-shrink-0 select-none"
              style={{
                background: `hsl(${hue},55%,88%)`,
                color: `hsl(${hue},45%,35%)`,
              }}
            >
              {getInitials(patient.name)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  {patient.name}
                </h1>
                <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-semibold">
                  #{id?.slice(-6)}
                </span>
              </div>

              <p className="text-sm text-slate-500 mt-1">
                {patient.gender} • {patient.age} yrs
                {patient.phone && (
                  <span className="ml-3 text-slate-400">{patient.phone}</span>
                )}
              </p>

              <p className="text-sm text-slate-400 mt-0.5">
                {lastVisit
                  ? `Last Visit: ${fmtDate(lastVisit)}`
                  : "No visits yet"}
              </p>

              {/* Status + visit count */}
              <div className="flex items-center gap-3 mt-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      patient.status === "review"
                        ? "bg-amber-500"
                        : patient.status === "billing"
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  {statusCfg.label}
                </span>
                <span className="text-xs text-slate-400">
                  {visits.length} visit{visits.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Visit History Card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <h2 className="font-semibold text-slate-800">Visit History</h2>
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              {visits.length} total
            </span>
          </div>

          {visits.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No visits recorded yet
            </div>
          ) : (
            <div className="px-6 py-4">
              {visits.map((visit, idx) => {
                const isFirst = idx === visits.length - 1;
                const isLatest = idx === 0;
                const visitType = isFirst
                  ? "Initial Consultation"
                  : "Follow-up Visit";
                const visitStatus =
                  isLatest ? patient.status : "completed";
                const vCfg =
                  STATUS_CONFIG[visitStatus] ?? STATUS_CONFIG.completed;
                const isLast = idx === visits.length - 1;

                return (
                  <div key={visit.id} className="flex gap-4">
                    {/* Timeline column */}
                    <div className="flex flex-col items-center w-16 flex-shrink-0 pt-5">
                      <span className="text-[10px] text-slate-400 font-medium text-right leading-tight w-full text-center">
                        {fmtDate(visit.date).split(",")[0]}
                      </span>
                      <div className="mt-2 relative flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full border-2 flex-shrink-0 z-10 ${
                            isLatest
                              ? "bg-blue-500 border-blue-500"
                              : "bg-white border-slate-300"
                          }`}
                        />
                        {!isLast && (
                          <div className="w-px flex-1 bg-slate-200 mt-1 min-h-[60px]" />
                        )}
                      </div>
                    </div>

                    {/* Visit card */}
                    <div className={`flex-1 min-w-0 mb-4 ${isLast ? "" : ""}`}>
                      <div className="bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl border border-slate-100 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-semibold text-slate-800 text-sm">
                                {visitType}
                              </span>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${vCfg.bg} ${vCfg.text}`}
                              >
                                {vCfg.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              {fmtDate(visit.date)} • {fmtTime(visit.date)}
                            </p>
                          </div>

                          {/* View Full Note */}
                          <button
                            onClick={() =>
                              navigate(
                                `/doctor/patients/${id}/visit/${visit.id}`,
                              )
                            }
                            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0 hover:cursor-pointer"
                          >
                            View Full Note
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
