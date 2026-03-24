import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Save,
  Search,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface TranscriptionSegment {
  start: number;
  end: number;
  sentence: string;
  speaker: string[];
}

interface Vitals {
  bp: string;
  pulse: string;
  temp: string;
  resp: string;
}

interface SoapNotes {
  subjective: string;
  vitals: Vitals;
  objective: string;
  assessment: string[];
  plan: string[];
}

interface VisitData {
  id: string;
  patientId: string;
  date: string;
  notes: SoapNotes;
  transcription: TranscriptionSegment[];
}

interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
}

export default function ViewPatientVisitDetails() {
  const { id: patientId, visitId } = useParams<{ id: string; visitId: string }>();
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

  const [visit, setVisit] = useState<VisitData | null>(null);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAiBanner, setShowAiBanner] = useState(true);

  useEffect(() => {
    if (!visitId || !patientId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const visitRes = await fetch(`${SERVER_URL}/visits/${visitId}`, {
          credentials: "include",
        });
        if (!visitRes.ok) throw new Error("Failed to fetch visit");
        const visitData: VisitData = await visitRes.json();
        setVisit(visitData);

        // Use patientId from the visit response — not the URL param (which may be mock data)
        const patientRes = await fetch(
          `${SERVER_URL}/patients/${visitData.patientId}`,
          { credentials: "include" }
        );
        if (patientRes.ok) {
          const patientData = await patientRes.json();
          setPatient(patientData.patient);
        }
      } catch {
        setError("Failed to load visit details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visitId, patientId, SERVER_URL]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const isDoctor = (speaker: string[]) => {
    const s = (speaker[0] ?? "").toLowerCase();
    return s === "doctor" || s.includes("doctor") || s === "speaker_0";
  };

  const getSpeakerLabel = (speaker: string[]) =>
    isDoctor(speaker) ? "DR" : "PT";

  const parseAssessmentStatus = (item: string) => {
    const idx = item.lastIndexOf(" - ");
    if (idx !== -1) {
      return { diagnosis: item.slice(0, idx), status: item.slice(idx + 3) };
    }
    return { diagnosis: item, status: null };
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase().replace(/\.$/, "");
    if (s === "improving") return "text-green-500";
    if (s === "controlled" || s === "stable") return "text-blue-500";
    if (s === "acute" || s === "active") return "text-orange-500";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error ?? "Visit not found"}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="-m-6 flex flex-col" style={{ height: "100vh" }}>
      {/* ── Patient Header ── */}
      <div className="bg-white border-b dark:bg-slate-900 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="size-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {patient ? getInitials(patient.name) : "??"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <ArrowLeft className="size-4" />
              </button>
              <h1 className="text-xl font-bold dark:text-white">
                {patient?.name ?? "Patient"}
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                Active
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              {patient && (
                <>
                  <span>🗓 {patient.age}y</span>
                  <span>•</span>
                </>
              )}
              <span>🪪 ID: #{visit.patientId.slice(-6).toUpperCase()}</span>
              <span>•</span>
              <span>📋 Visit: {formatDate(visit.date)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Copy className="size-3.5" /> Copy Note
          </Button>
          <Button
            size="sm"
            className="gap-1.5 text-xs h-8 bg-blue-600 hover:bg-blue-700"
          >
            <Save className="size-3.5" /> Submit for Billing
          </Button>
        </div>
      </div>

      {/* ── Two-panel body ── */}
      <div className="flex flex-1 min-h-0">
        {/* ════ LEFT: TRANSCRIPT ════ */}
        <div className="w-1/2 border-r dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-3 border-b dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-lg leading-none">≡</span>
              <span className="text-xs font-semibold tracking-widest text-gray-500 dark:text-slate-400 uppercase">
                Transcript
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400">
              <CheckCircle2 className="size-3.5" />
              Session complete
            </span>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="px-5 py-4 space-y-4">
              {visit.transcription.map((seg, idx) => {
                const doc = isDoctor(seg.speaker);
                return (
                  <div key={idx} className="flex items-start gap-3">
                    {/* Avatar + timestamp */}
                    <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                      <span className="text-[11px] font-mono text-teal-500 dark:text-teal-400">
                        {formatTime(seg.start)}
                      </span>
                      <div
                        className={`size-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          doc
                            ? "bg-blue-100 text-blue-800"
                            : "bg-teal-100 text-teal-800"
                        }`}
                      >
                        {getSpeakerLabel(seg.speaker)}
                      </div>
                    </div>
                    {/* Bubble */}
                    <div className="flex-1 bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-slate-200 leading-relaxed border border-gray-100 dark:border-slate-700">
                      {seg.sentence}
                    </div>
                  </div>
                );
              })}

              {/* End of conversation */}
              <div className="flex items-center justify-center gap-2 pt-4 pb-2 text-xs text-gray-400 dark:text-slate-500">
                <CheckCircle2 className="size-4" />
                <span>End of conversation fetched from archive</span>
              </div>
            </div>
          </ScrollArea>

          {/* Bottom search */}
          <div className="px-5 py-3 border-t dark:border-slate-800 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
              <Input
                placeholder="Search in transcript..."
                className="pl-8 h-8 text-xs bg-gray-50 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>

        {/* ════ RIGHT: SOAP NOTES ════ */}
        <div className="w-1/2 flex flex-col bg-gray-50 dark:bg-slate-950">
          {/* AI draft banner */}
          {showAiBanner && (
            <div className="flex items-center justify-between px-5 py-2.5 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900 shrink-0">
              <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                <Sparkles className="size-3.5 text-blue-500 shrink-0" />
                AI Draft generated from clinical transcript. Review and edit as
                needed.
              </div>
              <div className="flex items-center gap-3 text-xs shrink-0 ml-3">
                <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Regenerate
                </button>
                <button
                  className="text-gray-400 hover:underline"
                  onClick={() => setShowAiBanner(false)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <ScrollArea className="flex-1 min-h-0">
            <div className="px-5 py-4 space-y-3">
              {/* ── SUBJECTIVE ── */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-6 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      S
                    </span>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-gray-600 dark:text-slate-400 uppercase">
                    Subjective
                  </span>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700 ml-1" />
                </div>
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                  {visit.notes.subjective}
                </p>
              </div>

              {/* ── OBJECTIVE ── */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      O
                    </span>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-gray-600 dark:text-slate-400 uppercase">
                    Objective
                  </span>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700 ml-1" />
                </div>
                {/* Vitals grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {(
                    [
                      { label: "BP", value: visit.notes.vitals.bp },
                      { label: "PULSE", value: visit.notes.vitals.pulse },
                      { label: "TEMP", value: visit.notes.vitals.temp },
                      { label: "RESP", value: visit.notes.vitals.resp },
                    ] as const
                  ).map(({ label, value }) => (
                    <div
                      key={label}
                      className="text-center bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg py-2.5 px-2"
                    >
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 mt-0.5">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                  {visit.notes.objective}
                </p>
              </div>

              {/* ── ASSESSMENT ── */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-6 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      A
                    </span>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-gray-600 dark:text-slate-400 uppercase">
                    Assessment
                  </span>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700 ml-1" />
                </div>
                <ul className="space-y-2">
                  {visit.notes.assessment.map((item, idx) => {
                    const { diagnosis, status } = parseAssessmentStatus(item);
                    return (
                      <li key={idx} className="text-sm">
                        <span className="font-medium text-gray-800 dark:text-slate-200">
                          {diagnosis}
                        </span>
                        {status && (
                          <>
                            <span className="text-gray-400"> - </span>
                            <span
                              className={`font-semibold ${getStatusColor(status)}`}
                            >
                              {status}
                            </span>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* ── PLAN ── */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-6 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">
                      P
                    </span>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-gray-600 dark:text-slate-400 uppercase">
                    Plan
                  </span>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700 ml-1" />
                </div>
                <ul className="space-y-2">
                  {visit.notes.plan.map((item, idx) => (
                    <li
                      key={idx}
                      className={`text-sm leading-relaxed ${
                        idx === 0
                          ? "text-blue-600 dark:text-blue-400 font-medium"
                          : "text-gray-700 dark:text-slate-300"
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}