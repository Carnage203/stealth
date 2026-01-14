import { Mic, Users, FileText, Receipt } from "lucide-react";

export function Process() {
  const steps = [
    {
      icon: Mic,
      title: "Audio Capture",
      description: "Secure, ambient recording",
    },
    {
      icon: Users,
      title: "Smart Transcription",
      description: "Speaker diarization",
    },
    {
      icon: FileText,
      title: "SOAP Generation",
      description: "Structured clinical notes",
    },
    {
      icon: Receipt,
      title: "Automated Billing",
      description: "ICD-10 & CPT Mapping",
    },
  ];

  return (
    <section className="py-16 px-6 dark:bg-background-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            THE PROCESS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white">
            Streamlined Clinical Documentation
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connecting Line - visible on lg screens (4 columns) */}
          <div className="hidden lg:block absolute top-8 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          {/* Connecting Lines - For md screens (2 columns) - Top Row */}
          <div className="hidden md:block lg:hidden absolute top-8 left-[calc(25%+2rem)] right-[calc(25%+2rem)] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          {/* Connecting Lines - For md screens (2 columns) - Bottom Row */}
          <div className="hidden md:block lg:hidden absolute top-58 left-[calc(25%+2rem)] right-[calc(25%+2rem)] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          {/* Vertical Connecting Line - Mobile only */}
          <div className="md:hidden absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-primary/20 via-primary to-primary/20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center group relative"
              >
                {/* Icon Circle */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-white dark:bg-surface-dark border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                  {/* Step number badge */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <step.icon className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-text-main dark:text-white mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}