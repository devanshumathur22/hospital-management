"use client";

import "./globals.css";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CursorGlow from "../components/layout/CursorGlow";
import FloatingCTA from "../components/layout/FloatingCTA";

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
      <body>

        <CursorGlow />

        {!isDashboard && <Navbar />}

        {children}

        {!isDashboard && <FloatingCTA />}

        {!isDashboard && <Footer />}

      </body>
    </html>
  );
}