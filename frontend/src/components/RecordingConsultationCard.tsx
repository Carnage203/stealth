import { useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  Square,
  FileText,
  Lock,
  Mic,
  AlertCircle,
  RefreshCcw,
  CircleCheckBig,
  Volume2,
} from "lucide-react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

type RecordingStatus =
  | "idle"
  | "recording"
  | "paused"
  | "stopped"
  | "uploading"
  | "success"
  | "error";

export default function RecordingConsultationCard() {
  const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- TIMER ---------------- */
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  /* ---------------- RECORDING ---------------- */
  const startRecording = async () => {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        // mimeType: "audio/webm",
        mimeType: "audio/webm; codecs=opus",
        audioBitsPerSecond: 128000, // 🔥 important
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      startTimer();
      setStatus("recording");
    } catch (err) {
      setError("Microphone access denied or unavailable.");
      setStatus("error");
    }
  };

  const pauseRecording = () => {
    mediaRecorderRef.current?.pause();
    stopTimer();
    setStatus("paused");
  };

  const resumeRecording = () => {
    mediaRecorderRef.current?.resume();
    startTimer();
    setStatus("recording");
  };

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
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = "";
    }
  };

  /* ---------------- PLAYBACK ---------------- */
  const togglePlayback = () => {
    if (!audioPlayerRef.current) {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };
    }

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  /* ---------------- UPLOAD ---------------- */
  // const finalizeAndUpload = async () => {
  //   try {
  //     setStatus("uploading");

  //     const audioBlob = new Blob(audioChunksRef.current, {
  //       type: "audio/webm",
  //     });

  //     const formData = new FormData();
  //     formData.append("audio", audioBlob, "consultation.webm");

  //     const res = await fetch("/api/transcribe", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!res.ok) throw new Error("Upload failed");

  //     setStatus("success");
  //   } catch {
  //     setError("Failed to upload or transcribe audio.");
  //     setStatus("error");
  //   }
  // };
  // ...existing code...

  /* ---------------- UPLOAD ---------------- */
  const finalizeAndUpload = async () => {
    try {
      setStatus("uploading");

      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      // Step 1: Get Cloudinary signature from backend
      const signatureRes = await fetch(`${SERVER_URL}/cloudinary/signature`, {
        method: "GET",
        credentials: "include",
      });

      if (!signatureRes.ok) throw new Error("Failed to get upload signature");

      const { timestamp, signature, api_key, cloud_name } =
        await signatureRes.json();

      // Step 2: Upload to Cloudinary
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", audioBlob, "consultation.webm");
      cloudinaryFormData.append("timestamp", timestamp.toString());
      cloudinaryFormData.append("upload_preset", "audio_signed_preset");
      cloudinaryFormData.append("signature", signature);
      cloudinaryFormData.append("api_key", api_key);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        },
      );

      if (!cloudinaryRes.ok) throw new Error("Failed to upload to Cloudinary");

      const cloudinaryData = await cloudinaryRes.json();
      const audioUrl = cloudinaryData.secure_url;

      // Step 3: Send audio URL with user details to backend for transcription
      // const transcribeRes = await fetch("/api/transcribe", {
        // method: "POST",
        // headers: {
          // "Content-Type": "application/json",
        // },
        // credentials: "include",
        // body: JSON.stringify({
          // audioUrl: audioUrl,
          // Add user details here when available
          // patientId: "...",
          // patientName: "...",
          // etc.
        // }),
      // });

      // if (!transcribeRes.ok) throw new Error("Transcription failed");

      setStatus("success");
      toast.success("For Details, check Browser Network Tab." , {duration: 10000} );

    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload or transcribe audio.");
      setStatus("error");
    }
  };

  /* ---------------- CLEANUP ---------------- */
  useEffect(() => {
    return () => {
      stopTimer();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        URL.revokeObjectURL(audioPlayerRef.current.src);
      }
    };
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-6 py-4">
          <span
            className={`h-3 w-3 rounded-full ${
              status === "recording"
                ? "bg-red-500 animate-pulse"
                : "bg-slate-300"
            }`}
          />
          <div>
            <p className="text-sm font-semibold">Recording Consultation</p>
            <p className="text-xs text-slate-500">Patient: Sarah Jenkins</p>
          </div>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center py-10 space-y-4">
          <h1 className="text-5xl font-mono font-bold">
            {formatTime(seconds)}
          </h1>

          <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-600">
            LIVE AUDIO CAPTURE
          </span>
        </div>

        {/* Controls */}
        <div className="flex gap-4 px-6 font-semibold">
          {status === "idle" && (
            <button
              onClick={startRecording}
              className="hover:cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 py-3 text-white"
            >
              <Mic className="h-4 w-4" />
              Start
            </button>
          )}

          {status === "recording" && (
            <button
              onClick={pauseRecording}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-300 hover:bg-blue-500 py-3 hover:cursor-pointer"
            >
              <Pause className="h-4 w-4" />
              Pause
            </button>
          )}

          {status === "paused" && (
            <button
              onClick={resumeRecording}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-400 py-3 hover:cursor-pointer"
            >
              <Play className="h-4 w-4" />
              Resume
            </button>
          )}

          {(status === "recording" || status === "paused") && (
            <button
              onClick={stopRecording}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-400 hover:bg-red-500 py-3 text-white font-semibold hover:cursor-pointer"
            >
              <Square className="h-4 w-4" />
              Stop
            </button>
          )}
        </div>

        {/* Play Audio Preview */}
        {status === "stopped" && (
          <div className="px-6 py-4">
            <button
              onClick={togglePlayback}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 hover:bg-green-600 py-3 text-white font-semibold hover:cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-5 w-5" />
                  Pause Audio
                </>
              ) : (
                <>
                  <Volume2 className="h-5 w-5" />
                  Play Recording
                </>
              )}
            </button>
          </div>
        )}

        {/* Finalize */}
        {status === "stopped" && (
          <div className="flex gap-4 px-6 font-semibold">
            <button
              onClick={reRecord}
              className="flex w-full items-center justify-center gap-2 hover:cursor-pointer rounded-xl py-3 text-black border border-slate-300 hover:bg-slate-100"
            >
              <RefreshCcw className="h-5 w-5" />
              Re-record
            </button>

            <button
              onClick={finalizeAndUpload}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-400 hover:bg-blue-500 hover:cursor-pointer py-3 text-white"
            >
              <CircleCheckBig className="h-5 w-5" />
              Submit
            </button>
          </div>
        )}

        {/* Status */}
        {status === "uploading" && (
          <p className="text-center text-sm py-4 text-slate-500">
            Uploading & transcribing audio…
          </p>
        )}

        {error && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400">
          <Lock className="h-3 w-3 text-green-500" />
          HIPAA Compliant • Encrypted End-to-End
        </div>
      </div>
    </div>
  );
}
