// src/layouts/PublicLayout.tsx
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ReactLenis } from "lenis/react";

export const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-120px)]">
        <ReactLenis root />
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
