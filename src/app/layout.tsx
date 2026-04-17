"use client";

import "./globals.css";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CursorGlow from "../components/layout/CursorGlow";
import FloatingCTA from "../components/layout/FloatingCTA";

import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  const isDashboard =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/doctor") ||
    pathname.startsWith("/patient") ||
    pathname.startsWith("/receptionist") ||
    pathname.startsWith("/nurse") ||
    pathname.startsWith("/pharmacy");

  return (
    <html lang="en">
      <body className="bg-gray-50">

        {/* 🔥 CURSOR EFFECT */}
        <CursorGlow />

        {/* 🔥 PRO TOASTER */}
      <Toaster
  position="top-right"
  gutter={12}
  toastOptions={{
    duration: 3000,
    className: "animate-toast-in",
    style: {
      borderRadius: "14px",
      padding: "12px 16px",
      fontSize: "14px",
      background: "#111827",
      color: "#fff",
      boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
    },
    success: {
      className: "animate-toast-in",
      style: {
        background: "linear-gradient(135deg,#22c55e,#16a34a)",
        color: "#fff",
      },
    },
    error: {
      className: "animate-toast-in",
      style: {
        background: "linear-gradient(135deg,#ef4444,#dc2626)",
        color: "#fff",
      },
    },
  }}
/>

        {/* 🔥 PUBLIC NAVBAR */}
        {!isDashboard && <Navbar />}

        {/* 🔥 MAIN CONTENT */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* 🔥 CTA + FOOTER (ONLY PUBLIC) */}
        {!isDashboard && <FloatingCTA />}
        {!isDashboard && <Footer />}

      </body>
    </html>
  );
}