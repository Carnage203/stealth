import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Pause,
  Play,
  Square,
  Lock,
  Mic,
  AlertCircle,
  RefreshCcw,
  CircleCheckBig,
  Volume2,
  Upload,
  FileAudio,
  X,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

type RecordingStatus =
  | "idle"
  | "recording"
  | "paused"
  | "stopped"
  | "uploading"
  | "success"
  | "error";

type Mode = "record" | "upload";

interface PatientState {
  isNew: boolean;
  name: string;
  age: number;
  gender: string;
  phone: string;
  patientId?: string;
}

function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

function capitalizeFirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default function RecordingConsultationCard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const patient = location.state as PatientState | null;

  const [mode, setMode] = useState<Mode>("record");

  /* ── Record state ── */
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /* ── Upload state ── */
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Timer ── */
  const startTimer = () => {
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sc = (s % 60).toString().padStart(2, "0");
    return `${m}:${sc}`;
  };

  /* ── Recording controls ── */
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { noiseSuppression: true, echoCancellation: true, autoGainControl: true, channelCount: 1, sampleRate: 44100 },
      });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
        audioBitsPerSecond: 128000,
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.start();
      startTimer();
      setStatus("recording");
    } catch {
      setError("Microphone access denied or unavailable.");
      setStatus("error");
    }
  };

  const pauseRecording = () => { mediaRecorderRef.current?.pause(); stopTimer(); setStatus("paused"); };
  const resumeRecording = () => { mediaRecorderRef.current?.resume(); startTimer(); setStatus("recording"); };
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    stopTimer();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setStatus("stopped");
  };
  const reRecord = () => {
    audioChunksRef.current = [];
    setSeconds(0);
    setStatus("idle");
    setError(null);
    setIsPlaying(false);
    if (audioPlayerRef.current) { audioPlayerRef.current.pause(); audioPlayerRef.current.src = ""; audioPlayerRef.current = null; }
  };

  /* ── Playback ── */
  const togglePlayback = () => {
    if (!audioPlayerRef.current) {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const audio = new Audio(URL.createObjectURL(blob));
      audio.onended = () => setIsPlaying(false);
      audioPlayerRef.current = audio;
    }
    if (isPlaying) { audioPlayerRef.current.pause(); setIsPlaying(false); }
    else { audioPlayerRef.current.play(); setIsPlaying(true); }
  };

  /* ── Cloudinary upload (shared) ── */
  const uploadToCloudinary = async (blob: Blob, filename: string): Promise<string> => {
    const sigRes = await fetch(`${SERVER_URL}/cloudinary/signature`, { credentials: "include" });
    if (!sigRes.ok) throw new Error("Failed to get upload signature");
    const { timestamp, signature, api_key, cloud_name } = await sigRes.json();

    const form = new FormData();
    form.append("file", blob, filename);
    form.append("timestamp", timestamp.toString());
    form.append("upload_preset", "audio_signed_preset");
    form.append("signature", signature);
    form.append("api_key", api_key);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`, { method: "POST", body: form });
    if (!res.ok) throw new Error("Failed to upload to Cloudinary");
    const data = await res.json();
    return data.secure_url;
  };

  const [processingMsg, setProcessingMsg] = useState("");

  const submitConsultation = async (audioUrl: string) => {
    if (!patient) throw new Error("No patient data");

    const gender = capitalizeFirst(patient.gender);
    const validGender = ["Male", "Female", "Other"].includes(gender)
      ? (gender as "Male" | "Female" | "Other")
      : "Other";

    const res = await fetch(`${SERVER_URL}/visits/create-consultation`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": getCsrfToken(),
      },
      body: JSON.stringify({
        patientId: patient.isNew ? null : patient.patientId,
        name: patient.name,
        age: patient.age,
        gender: validGender,
        phone: patient.phone || "0000000000",
        audioUrl,
        doctorEmail: user?.email ?? "",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "AI processing failed");
    }
    return res.json() as Promise<{ patientMongoId: string; visitId: string }>;
  };

  const finalizeRecording = async () => {
    try {
      setStatus("uploading");
      setProcessingMsg("Uploading audio…");
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const audioUrl = await uploadToCloudinary(blob, "consultation.webm");
      setProcessingMsg("Transcribing & generating SOAP notes — this may take a minute…");
      const result = await submitConsultation(audioUrl);
      setStatus("success");
      toast.success("Consultation processed successfully!");
      navigate(`/doctor/patients/${result.patientMongoId}/visit/${result.visitId}`);
    } catch (err: any) {
      setError(err.message || "Failed to process consultation.");
      setStatus("error");
    } finally {
      setProcessingMsg("");
    }
  };

  const finalizeUpload = async () => {
    if (!uploadFile) return;
    try {
      setStatus("uploading");
      setProcessingMsg("Uploading audio file…");
      const audioUrl = await uploadToCloudinary(uploadFile, uploadFile.name);
      setProcessingMsg("Transcribing & generating SOAP notes — this may take a minute…");
      const result = await submitConsultation(audioUrl);
      setStatus("success");
      toast.success("Consultation processed successfully!");
      navigate(`/doctor/patients/${result.patientMongoId}/visit/${result.visitId}`);
    } catch (err: any) {
      setError(err.message || "Failed to process consultation.");
      setStatus("error");
    } finally {
      setProcessingMsg("");
    }
  };

  /* ── File drag & drop ── */
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) setUploadFile(file);
    else toast.error("Please drop an audio file");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadFile(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      stopTimer();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioPlayerRef.current) { audioPlayerRef.current.pause(); URL.revokeObjectURL(audioPlayerRef.current.src); }
    };
  }, []);

  const switchMode = (m: Mode) => {
    if (status === "recording" || status === "paused") stopRecording();
    reRecord();
    setUploadFile(null);
    setError(null);
    setMode(m);
    setStatus("idle");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#f6f7f8]">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 shadow-xl bg-white overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <button onClick={() => navigate(-1)} className="p-1 text-slate-400 hover:text-slate-600 hover:cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${status === "recording" ? "bg-red-500 animate-pulse" : "bg-slate-300"}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 leading-tight">Consultation Recording</p>
            <p className="text-xs text-slate-400 truncate">
              {patient?.name ? `Patient: ${patient.name}` : "No patient selected"}
            </p>
          </div>
        </div>

        {/* Mode switcher */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => switchMode("record")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors hover:cursor-pointer
              ${mode === "record" ? "text-blue-600 border-b-2 border-blue-600 -mb-px" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Mic className="w-4 h-4" /> Record Live
          </button>
          <button
            onClick={() => switchMode("upload")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors hover:cursor-pointer
              ${mode === "upload" ? "text-blue-600 border-b-2 border-blue-600 -mb-px" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Upload className="w-4 h-4" /> Upload Audio
          </button>
        </div>

        {/* ══ RECORD MODE ══ */}
        {mode === "record" && (
          <>
            <div className="flex flex-col items-center py-10 space-y-4">
              <h1 className="text-5xl font-mono font-bold text-slate-900">{formatTime(seconds)}</h1>
              <span className={`rounded-full px-4 py-1 text-xs font-semibold ${
                status === "recording" ? "bg-red-100 text-red-600" :
                status === "paused" ? "bg-amber-100 text-amber-600" :
                "bg-blue-100 text-blue-600"
              }`}>
                {status === "recording" ? "● RECORDING" : status === "paused" ? "⏸ PAUSED" : "LIVE AUDIO CAPTURE"}
              </span>
            </div>

            <div className="flex gap-3 px-6 pb-4">
              {status === "idle" && (
                <button onClick={startRecording} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-white font-semibold hover:cursor-pointer transition-colors">
                  <Mic className="h-4 w-4" /> Start Recording
                </button>
              )}
              {status === "recording" && (
                <button onClick={pauseRecording} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 py-3 text-white font-semibold hover:cursor-pointer transition-colors">
                  <Pause className="h-4 w-4" /> Pause
                </button>
              )}
              {status === "paused" && (
                <button onClick={resumeRecording} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 py-3 text-white font-semibold hover:cursor-pointer transition-colors">
                  <Play className="h-4 w-4" /> Resume
                </button>
              )}
              {(status === "recording" || status === "paused") && (
                <button onClick={stopRecording} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 py-3 text-white font-semibold hover:cursor-pointer transition-colors">
                  <Square className="h-4 w-4" /> Stop
                </button>
              )}
            </div>

            {status === "stopped" && (
              <div className="px-6 space-y-3 pb-4">
                <button onClick={togglePlayback} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 py-3 text-white font-semibold hover:cursor-pointer transition-colors">
                  {isPlaying ? <><Pause className="h-4 w-4" /> Pause Playback</> : <><Volume2 className="h-4 w-4" /> Play Recording</>}
                </button>
                <div className="flex gap-3">
                  <button onClick={reRecord} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-slate-600 border border-slate-200 hover:bg-slate-50 hover:cursor-pointer font-semibold transition-colors">
                    <RefreshCcw className="h-4 w-4" /> Re-record
                  </button>
                  <button onClick={finalizeRecording} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-white font-semibold hover:cursor-pointer transition-colors">
                    <CircleCheckBig className="h-4 w-4" /> Submit
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ══ UPLOAD MODE ══ */}
        {mode === "upload" && (
          <div className="px-6 py-6 space-y-4">
            {!uploadFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors
                  ${isDragging ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">Drop audio file here</p>
                  <p className="text-xs text-slate-400 mt-0.5">or click to browse</p>
                </div>
                <p className="text-xs text-slate-400">MP3, WAV, M4A, WebM, OGG</p>
                <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleFileSelect} />
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl p-4 flex items-center gap-3 bg-slate-50">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FileAudio className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{uploadFile.name}</p>
                  <p className="text-xs text-slate-400">{formatFileSize(uploadFile.size)}</p>
                </div>
                <button onClick={() => setUploadFile(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors hover:cursor-pointer flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={finalizeUpload}
              disabled={!uploadFile || status === "uploading"}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed py-3 text-white font-semibold hover:cursor-pointer transition-colors"
            >
              <CircleCheckBig className="h-4 w-4" />
              {status === "uploading" ? "Uploading…" : "Submit Audio"}
            </button>
          </div>
        )}

        {/* Uploading spinner */}
        {status === "uploading" && (
          <p className="text-center text-sm py-3 px-6 text-slate-500 animate-pulse">
            {processingMsg || "Processing…"}
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center justify-center gap-2 px-6 pb-4 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 py-3 border-t border-slate-100 text-xs text-slate-400">
          <Lock className="h-3 w-3 text-emerald-500" />
          HIPAA Compliant • Encrypted End-to-End
        </div>
      </div>
    </div>
  );
}
