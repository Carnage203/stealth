import { Clock, TrendingUp, Smile } from "lucide-react";

export function Benefits() {
  const benefits = [
    {
      icon: Clock,
      title: "Save 2 Hours Daily",
      description:
        "Stop charting after hours. Finish your notes before the patient leaves the exam room.",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Maximize Revenue",
      description:
        "Our AI suggests the most specific ICD-10 codes to reduce claim denials and ensure proper reimbursement.",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Smile,
      title: "Focus on Care",
      description:
        "Restore the patient-provider connection. Maintain eye contact instead of staring at a screen.",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <section className="py-16 px-6 dark:bg-background-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="
                bg-white dark:bg-slate-800
                rounded-2xl
                p-8
                border border-slate-200 dark:border-slate-700
                shadow-sm
                transition-all
                hover:shadow-md
              "
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${benefit.iconBg}`}
              >
                <benefit.icon
                  className={`w-6 h-6 ${benefit.iconColor}`}
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
