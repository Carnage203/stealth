import { PlayCircle, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section
  className="relative overflow-hidden bg-slate-50 pt-16 pb-24 md:pt-24 md:pb-32 px-6"
>
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          New: Automatic ICD-10 Code Mapping
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-main dark:text-white tracking-tight leading-[1.1]">
          Practise Medicine,
          <br />
         <span className="text-transparent bg-clip-text from-[#2B6DF6] to-[#60A5FA] bg-linear-to-r">
  Not Data Entry.
</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Watch our AI transform patient dialogue into accurate SOAP notes and
          billing codes with clinical precision. Save 2+ hours per day on
          documentation.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {/* <Link to="/#workflow-demo"> */}
          <Button
            onClick={() =>
              document
                .getElementById("workflow-demo")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="hover:cursor-pointer text-white h-12 px-8 rounded-lg bg-linear-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] font-semibold shadow-[0_10px_25px_rgba(37,99,235,0.35)] transition-all flex items-center justify-center gap-2"
          >
            <PlayCircle className="h-5 w-5" />
            Watch Workflow Demo
          </Button>
          {/* </Link> */}
          <Button
            variant="outline"
            className="h-12 px-8 rounded-lg border-2 border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600 text-slate-900 dark:text-white font-medium transition-all flex items-center justify-center gap-2"
          >
            <FileText className="h-5 w-5" />
            View Sample Output
          </Button>
        </div>
      </div>

      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[1000px] h-[600px] bg-linear-to-b from-blue-100/60 to-transparent rounded-[100%] blur-3xl pointer-events-none"></div>
    </section>
  );
}
