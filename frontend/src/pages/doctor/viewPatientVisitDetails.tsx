import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Save,
  Search,
  CheckCircle2,
  Sparkles,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

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
  const { id: patientId, visitId } = useParams<{
    id: string;
    visitId: string;
  }>();
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

  const [visit, setVisit] = useState<VisitData | null>(null);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAiBanner, setShowAiBanner] = useState(true);

  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState({
  subjective: false,
  objective: false,
  assessment: false,
  plan: false,
});

const [draft, setDraft] = useState<SoapNotes | null>(null);
const [saving] = useState(false);
const editButtonClass =
  "absolute right-5 top-3 inline-flex size-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-blue-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-blue-400";
const editTextareaClass =
  "min-h-44 w-full resize-y rounded-lg border border-gray-200 p-3 text-sm leading-relaxed text-gray-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-950";
const editActionsClass = "flex justify-end gap-2 pt-3";
const cancelEditButtonClass =
  "h-9 rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800";
const doneEditButtonClass =
  "h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60";

  const updateNotes = (changes: Partial<SoapNotes>) => {
    setVisit((prev) =>
      prev ? { ...prev, notes: { ...prev.notes, ...changes } } : prev,
    );
    setDraft((prev) =>
      prev ? { ...prev, ...changes } : prev,
    );
    toast.success("Note updated");
  };

  const escapeRegExp = (text: string) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const handleCopyNote = async () => {
    if (!visit) return;

    const soapJson = {
      patientId: visit.patientId,
      visitId: visit.id,
      date: visit.date,
      notes: visit.notes,
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(soapJson, null, 2));
      setCopied(true);
      toast.success("Note copied to clipboard!");
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
      toast.error("Failed to copy note.");
    }
  };

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
        setDraft(visitData.notes);

        // Use patientId from the visit response — not the URL param (which may be mock data)
        const patientRes = await fetch(
          `${SERVER_URL}/patients/${visitData.patientId}`,
          { credentials: "include" },
        );
        if (patientRes.ok) {
          const patientData = await patientRes.json();
          setPatient(patientData.patient);
        }
      } catch {
        setError("Failed to load visit details.");
        toast.error("Failed to load visit details.");
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
    
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Patient Header ── */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-3 sm:px-4 md:px-6 py-3 md:py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0">
      
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
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
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-8"
            onClick={handleCopyNote}
          >
            <Copy className="size-3.5" /> {copied ? "Copied" : "Copy Note"}
          </Button>
          <Button
            size="sm"
            className="gap-1.5 text-xs h-8 bg-blue-600 hover:bg-blue-700"
            onClick={() =>
              toast("Submitted for billing! (not really, this is a demo)")
            }
          >
            <Save className="size-3.5" /> Submit for Billing
          </Button>
        </div>
      </div>

      {/* ── Two-panel body ── */}
      <div className="flex flex-1 min-h-0">
        {/* ════ LEFT: TRANSCRIPT ════ */}
        <div className="w-1/2 border-r border-gray-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-3 border-b dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
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
                      {search.trim()
                        ? seg.sentence
                            .split(
                              new RegExp(
                                "(" + escapeRegExp(search.trim()) + ")",
                                "gi",
                              ),
                            )
                            .map((part, i) =>
                              part.toLowerCase() ===
                              search.trim().toLowerCase() ? (
                                <span
                                  key={i}
                                  className="bg-blue-200 text-blue-900 px-1 rounded"
                                >
                                  {part}
                                </span>
                              ) : (
                                part
                              ),
                            )
                        : seg.sentence}
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
            <div className="space-y-4 p-4">
              {/* ── SUBJECTIVE ── */}
              <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
                <button
                  type="button"
                  className={editButtonClass}
                  aria-label="Edit subjective note"
                  onClick={() => setEditing({ ...editing, subjective: true })}
                >
                  <Pencil className="size-4" />
                </button>
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 px-5 py-5 pr-14">
                  <div className="size-6 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      S
                    </span>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-gray-600 dark:text-slate-400 uppercase">
                    Subjective
                  </span>
                </div>
                <div className="p-5">
                    {editing.subjective ? (
                      <>
                        <textarea
                          className={editTextareaClass}
                          value={draft?.subjective || ""}
                          onChange={(e) =>
                            setDraft((p) => p && { ...p, subjective: e.target.value })
                          }
                        />
                        <div className={editActionsClass}>
                          <button
                            type="button"
                            className={cancelEditButtonClass}
                            onClick={() => {
                              setDraft((p) =>
                                p ? { ...p, subjective: visit.notes.subjective } : p
                              );
                              setEditing({ ...editing, subjective: false });
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className={doneEditButtonClass}
                            disabled={saving}
                            onClick={() => {
                              if (draft?.subjective?.trim()) {
                                  updateNotes({ subjective: draft.subjective });
                              }
                              setEditing({ ...editing, subjective: false });
                            }}
                          >
                            Done
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                        {visit.notes.subjective}
                      </p>
                    )}
                </div>

              </div>

              {/* ── OBJECTIVE ── */}
              <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
                <button
                  type="button"
                  className={editButtonClass}
                  aria-label="Edit objective note"
                  onClick={() => setEditing({ ...editing, objective: true })}
                >
                  <Pencil className="size-4" />
                </button>
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 px-5 py-5 pr-14">
                  <div className="size-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      O
                    </span>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-gray-600 dark:text-slate-400 uppercase">
                    Objective
                  </span>
                </div>
                <div className="p-5">
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
                  
                      {editing.objective ? (
                        <>
                          <textarea
                            className={editTextareaClass}
                            value={draft?.objective || ""}
                            onChange={(e) =>
                              setDraft((p) => p && { ...p, objective: e.target.value })
                            }
                          />

                          <div className={editActionsClass}>
                            <button
                              type="button"
                              className={cancelEditButtonClass}
                              onClick={() => {
                                setDraft((p) =>
                                  p ? { ...p, objective: visit.notes.objective } : p
                                );
                                setEditing({ ...editing, objective: false });
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className={doneEditButtonClass}
                              disabled={saving}
                              onClick={() => {
                                if (draft?.objective?.trim()) {
                                  updateNotes({
                                    objective: draft.objective
                                  });
                                }
                                setEditing({ ...editing, objective: false });
                              }}
                            >
                              Done
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                        {visit.notes.objective}
                      </p>
                    )}
                </div>

              </div>

              {/* ── ASSESSMENT ── */}
              <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
                <button
                  type="button"
                  className={editButtonClass}
                  aria-label="Edit assessment note"
                  onClick={() => setEditing({ ...editing, assessment: true })}
                >
                  <Pencil className="size-4" />
                </button>
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 px-5 py-5 pr-14">
                  <div className="size-6 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      A
                    </span>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-gray-600 dark:text-slate-400 uppercase">
                    Assessment
                  </span>
                </div>
                <div className="p-5">
                        {editing.assessment ? (
                          <>
                            <textarea
                              className={editTextareaClass}
                              value={draft?.assessment?.join("\n") || ""}
                              onChange={(e) =>
                                setDraft((p) =>
                                  p && { ...p, assessment: e.target.value.split("\n") }
                                )
                              }
                            />

                            <div className={editActionsClass}>
                              <button
                                type="button"
                                className={cancelEditButtonClass}
                                onClick={() => {
                                  setDraft((p) =>
                                    p ? { ...p, assessment: visit.notes.assessment } : p
                                  );
                                  setEditing({ ...editing, assessment: false });
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className={doneEditButtonClass}
                                disabled={saving}
                                onClick={() => {
                                  const filtered = draft?.assessment?.filter((x) => x.trim() !== "");
                                  if (filtered && filtered.length > 0) {
                                    updateNotes({ assessment: filtered });
                                  }
                                  setEditing({ ...editing, assessment: false });
                                }}
                              >
                                Done
                              </button>
                            </div>
                          </>
                        ) : (
                          <ul className="space-y-2">
                            {visit.notes.assessment.map((item, idx) => {
                              const { diagnosis, status } = parseAssessmentStatus(item);
                              return (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="mt-1.5 size-1.5 rounded-full bg-amber-400 shrink-0" />
                                  <span className="text-sm text-gray-700 dark:text-slate-300">
                                    {diagnosis}
                                    {status && (
                                      <span className={`ml-2 text-xs font-medium ${getStatusColor(status)}`}>
                                        {status}
                                      </span>
                                    )}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                </div>

              </div>

              {/* ── PLAN ── */}
              <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
                <button
                  type="button"
                  className={editButtonClass}
                  aria-label="Edit plan note"
                  onClick={() => setEditing({ ...editing, plan: true })}
                >
                  <Pencil className="size-4" />
                </button>
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 px-5 py-5 pr-14">
                  <div className="size-6 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">
                      P
                    </span>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-gray-600 dark:text-slate-400 uppercase">
                    Plan
                  </span>
                </div>
                <div className="p-5">
                            {editing.plan ? (
                              <>
                                <textarea
                                  className={editTextareaClass}
                                  value={draft?.plan?.join("\n") || ""}
                                  onChange={(e) =>
                                    setDraft((p) =>
                                      p && { ...p, plan: e.target.value.split("\n") }
                                    )
                                  }
                                />

                                <div className={editActionsClass}>
                                  <button
                                    type="button"
                                    className={cancelEditButtonClass}
                                    onClick={() => {
                                      setDraft((p) =>
                                        p ? { ...p, plan: visit.notes.plan } : p
                                      );
                                      setEditing({ ...editing, plan: false });
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    className={doneEditButtonClass}
                                    disabled={saving}
                                    onClick={() => {
                                      const filtered = draft?.plan?.filter((x) => x.trim() !== "");
                                      if (filtered && filtered.length > 0) {
                                        updateNotes({ plan: filtered });
                                      }
                                      setEditing({ ...editing, plan: false });
                                    }}
                                  >
                                    Done
                                  </button>
                                </div>
                              </>
                            ) : (
                              <ul className="space-y-2 list-disc list-inside">
                                {visit.notes.plan.map((item, idx) => (
                                  <li key={idx} className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">{item}</li>
                                ))}
                              </ul>
                            )}
                </div>
                        
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
