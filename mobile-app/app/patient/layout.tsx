"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Home, Calendar, User, FileText } from "lucide-react"

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()
  const path = usePathname()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    })
    localStorage.removeItem("patient")
    router.push("/login")
  }

  const nav = [
    { name: "Home", icon: <Home size={20} />, link: "/patient/dashboard" },
    { name: "Appt", icon: <Calendar size={20} />, link: "/patient/appointments" },
    { name: "Rx", icon: <FileText size={20} />, link: "/patient/prescriptions" },
    { name: "Bills", icon: <FileText size={20} />, link: "/patient/bills" },
    { name: "Profile", icon: <User size={20} />, link: "/patient/profile" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* 🔥 HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-4 flex justify-between items-center shadow-md">

        <h1 className="text-lg font-semibold tracking-wide">
          Medicare
        </h1>

        <button
          onClick={handleLogout}
          className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition"
        >
          Logout
        </button>

      </header>

      {/* 🔥 CONTENT */}
      <main className="flex-1 px-3 py-4 pb-20">
        <div className="bg-white rounded-2xl shadow-sm p-4 min-h-full">
          {children}
        </div>
      </main>

      {/* 🔥 FLOATING BOTTOM NAV */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-white shadow-lg rounded-2xl flex justify-between px-4 py-2 border">

        {nav.map((item) => {

          const active = path.startsWith(item.link)

          return (
            <Link
              key={item.name}
              href={item.link}
              className={`flex flex-col items-center text-[11px] px-3 py-1 rounded-xl transition ${
                active
                  ? "text-blue-600 bg-blue-50 scale-105"
                  : "text-gray-400"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          )
        })}

      </nav>

    </div>
  )
}