"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
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

      {/* Sidebar */}

      <aside className="w-64 bg-blue-700 text-white p-6">

        <h1 className="text-2xl font-bold mb-8">
          Admin Panel
        </h1>

        <nav className="flex flex-col gap-4">

          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/add-doctor">Add Doctor</Link>
          <Link href="/admin/doctors">Doctors</Link>
          <Link href="/admin/assign-nurse">Assign Nurse</Link>
          <Link href="/admin/nurses">Nurses</Link>
          <Link href="/admin/appointments">Appointments</Link>
          <Link href="/admin/patients">Patients</Link>
          <Link href="/admin/calendar">Calendar</Link>         
          <Link href="/admin/reports">Reports</Link>

          {/* 🔥 LOGOUT SAME LINK STYLE */}
          <Link href="#" onClick={handleLogout} className="text-red-300">
            Logout
          </Link>

        </nav>

      </aside>

      {/* Content */}

      <main className="flex-1 p-10 bg-gray-100">
        {children}
      </main>

    </div>
  );
}