"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ReceptionistLayout({
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

      <aside className="w-64 bg-blue-600 text-white p-6">

        <h2 className="text-xl font-bold mb-6">
          Reception Panel
        </h2>

        <nav className="flex flex-col gap-3">

          <Link href="/receptionist/dashboard">Dashboard</Link>
          <Link href="/receptionist/patients">Patients</Link>
          <Link href="/receptionist/appointments">Appointments</Link>
          <Link href="/receptionist/doctors">Doctors</Link>
          <Link href="/receptionist/queue">Queue</Link>

          {/* 🔥 LOGOUT */}
          <Link
            href="#"
            onClick={handleLogout}
            className=" "
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