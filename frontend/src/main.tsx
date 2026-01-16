import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import "./style.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
