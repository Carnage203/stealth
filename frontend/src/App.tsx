import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./components/theme-provider";

import { Toaster } from "react-hot-toast";


export default function App() {
  return (
    <>
      {/* <ThemeProvider defaultTheme="system" storageKey="docuflow-theme"> */}
      <Toaster position="top-right" />
      <AppRoutes />
      {/* </ThemeProvider> */}
    </>
  );
}
