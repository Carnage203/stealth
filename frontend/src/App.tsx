import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./components/theme-provider";
import { ReactLenis } from "lenis/react";
import { Toaster } from "react-hot-toast";


export default function App() {
  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="docuflow-theme">
        <Toaster position="top-right" />
        {/* <ReactLenis root /> */}
        <AppRoutes />
      </ThemeProvider>
    </>
  );
}
