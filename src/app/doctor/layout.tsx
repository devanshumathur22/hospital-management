"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  User,
  Calendar,
  LogOut,
  Menu,
  X
} from "lucide-react"

export default function DoctorLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname()
  const router = useRouter()

  const [doctor, setDoctor] = useState<any>(null)
  const [open, setOpen] = useState(false)

  /* 🔥 FIXED FETCH */
  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const res = await fetch("/api/doctors/me", {
          credentials: "include"
        })

        const data = await res.json()

        // 🔥 MAIN FIX (important)
        setDoctor(data.user || data)

      } catch (err) {
        console.log(err)
      }
    }

    loadDoctor()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  const menu = [
    { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/doctor/appointments", icon: CalendarDays },
    { name: "Availability", href: "/doctor/availability", icon: CalendarDays },
    { name: "Calendar", href: "/doctor/calendar", icon: Calendar },
    { name: "Prescriptions", href: "/doctor/prescriptions", icon: FileText },
    { name: "Profile", href: "/doctor/profile", icon: User },
    { name: "Admitted Patients", href: "/doctor/admitted-patients", icon: CalendarDays },
    { name: "Logout", href: "#logout", icon: LogOut }
  ]

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className={`
        bg-green-700 text-white p-6 w-64 min-h-screen
        fixed md:static top-0 left-0 z-50 transform transition duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">Doctor Panel</h1>

          <button onClick={() => setOpen(false)} className="md:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2">

          {menu.map((item) => {

            const Icon = item.icon

            if (item.name === "Logout") {
              return (
                <button
                  key="logout"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-green-600"
                >
                  <Icon size={18} />
                  Logout
                </button>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${pathname === item.href
                    ? "bg-white text-green-700 font-semibold"
                    : "hover:bg-green-600"}
                `}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            )
          })}

        </nav>

      </aside>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white shadow-sm px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">

            <button onClick={() => setOpen(true)} className="md:hidden">
              <Menu size={22} />
            </button>

            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700">
              Doctor Dashboard
            </h2>

          </div>

          {/* 🔥 FIXED DOCTOR DISPLAY */}
          <div className="flex items-center gap-3 sm:gap-4">

            <div className="text-xs sm:text-sm text-gray-600 hidden sm:block">
              {doctor?.name ? `Dr. ${doctor.name}` : "Doctor"}
            </div>

            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 text-white flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold">
              {doctor?.name?.charAt(0)?.toUpperCase() || "D"}
            </div>

          </div>

        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>

      </div>

    </div>
  )
}