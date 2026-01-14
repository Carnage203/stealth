import { PlayCircle, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 px-6">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500 px-4 py-2 text-sm font-medium text-blue-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          New: Automatic ICD-10 Code Mapping
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-main dark:text-white tracking-tight leading-[1.1]">
          Practise Medicine,
          <br />
          <span className="text-transparent bg-clip-text bg-blue-600 dark:bg-blue-400">
            Not Data Entry.
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-text-sub dark:text-gray-400 max-w-2xl leading-relaxed">
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
            className="hover:cursor-pointer text-white h-12 px-8 rounded-lg bg-[#137fec] hover:bg-[#0b5cb3] font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <PlayCircle className="h-5 w-5" />
            Watch Workflow Demo
          </Button>
          {/* </Link> */}
          <Button
            variant="outline"
            className="h-12 px-8 rounded-lg  dark:bg-surface-dark border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-text-main dark:text-white font-medium transition-all flex items-center justify-center gap-2"
          >
            <FileText className="h-5 w-5" />
            View Sample Output
          </Button>
        </div>
      </div>

      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-primary/5 rounded-[100%] blur-3xl pointer-events-none"></div>
    </section>
  );
}
