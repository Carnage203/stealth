import { Mic, Upload, FileAudio } from "lucide-react";

export default function NewConsultationCard() {
  return (
    <div className="w-full max-w-sm rounded-2xl bg-white shadow-lg overflow-hidden">
      {/* Header Image */}
      <div className="relative h-40">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Wave background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <h2 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
          New Consultation
        </h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        <p className="text-slate-600 text-sm leading-relaxed">
          Start a new session to generate AI SOAP notes immediately.
        </p>

        {/* Primary Button */}
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 transition">
          <Mic className="h-5 w-5" />
          Record Live Visit
        </button>

        {/* Secondary Actions */}
        <div className="flex gap-3">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition">
            <Upload className="h-4 w-4" />
            Upload
          </button>

          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition">
            <FileAudio className="h-4 w-4" />
            Dictate
          </button>
        </div>
      </div>
    </div>
  );
}
