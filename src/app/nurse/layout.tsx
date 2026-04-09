"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NurseLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()

  /* 🔥 LOGOUT */
  const handleLogout = async (e:any) => {
    e.preventDefault()

    await fetch("/api/auth/logout", {
      method: "POST"
    })

    router.push("/login")
  }

  return (
    <div className="flex min-h-screen">

      <aside className="w-64 bg-green-700 text-white p-6">

        <h2 className="text-xl font-bold mb-6">
          Nurse Panel
        </h2>

        <nav className="flex flex-col gap-4">

          <Link href="/nurse/dashboard">Dashboard</Link>
          <Link href="/nurse/vitals">Patient Vitals</Link>
          <Link href="/nurse/appointments">Appointments</Link>
          <Link href="/nurse/patients">Patients</Link>

          {/* 🔥 LOGOUT SAME STYLE */}
          <Link
            href="#"
            onClick={handleLogout}
            className="text-red-300 hover:text-red-400"
          >
            Logout
          </Link>

        </nav>

      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>

    </div>
  )
}