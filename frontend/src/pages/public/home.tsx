import { Benefits } from "@/components/home/benefits";
import { Hero } from "@/components/home/hero";
import { Process } from "@/components/home/process";
import { WorkflowDemo } from "@/components/home/workFlowDemo";

export default function Home() {
  return (
    // <div className="min-h-screen flex items-center justify-center">
    //   <div className="text-7xl font-bold">Welcome to the Home Page</div>
    // </div>
    <div className="min-h-screen">
      <Hero />
      <Process />
      <WorkflowDemo />
      <Benefits />
    </div>
  );
}
