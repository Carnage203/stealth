import { Shield, FileCheck, Mic, Zap } from "lucide-react";
import { useState } from "react";

export function WorkflowDemo() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  // Simulate loading
  setTimeout(() => setIsLoading(false), 2000);

  const features = [
    {
      icon: Mic,
      title: "Ambient Capture",
      description:
        "The AI listens in the background, filtering out noise and focusing on clinical dialogue.",
      color: "text-orange-500",
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description:
        "Notes are generated in seconds, mapped to ICD-10 codes, and ready for your review.",
      color: "text-blue-500",
    },
  ];

  return (
  <section id="workflow-demo" className="relative py-24 px-6 bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white mb-2">
                Workflow Demo
              </h2>
              <p className="text-text-sub text-slate-500 dark:text-slate-400">
                See how DocuFlow AI works in real-time, from audio to billing.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium">
                <Shield className="w-4 h-4" />
                HIPAA Compliant
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm font-medium">
                <FileCheck className="w-4 h-4" />
                SOC2 Type II
              </span>
            </div>
          </div>
        </div>

        {/* Video/Demo Container */}
        <div className="relative border-2 dark:bg-background-dark rounded-2xl shadow-card overflow-hidden mb-8">
          {/* Demo Preview Area */}
          <div className="aspect-video dark:bg-surface-dark flex items-center justify-center relative">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-text-sub dark:text-gray-400 text-sm">
                  Loading Demo Preview...
                </p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {/* Placeholder for video/demo content */}
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mic className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-text-sub dark:text-gray-400">
                    Demo content would play here
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Video Controls */}
          <div className="bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-gray-300 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </button>
              <span className="text-white text-sm font-medium">0:00</span>
              <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all"
                  style={{ width: `${(currentTime / 100) * 100}%` }}
                ></div>
              </div>
              <button className="text-white hover:text-gray-300 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              </button>
              <button className="text-white hover:text-gray-300 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex gap-4 p-6 border-2 dark:bg-background-dark rounded-xl shadow-card hover:shadow-soft transition-shadow"
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 dark:bg-surface-dark flex items-center justify-center ${feature.color}`}
              >
                <feature.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-main dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
