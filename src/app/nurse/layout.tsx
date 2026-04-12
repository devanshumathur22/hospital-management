"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

export default function NurseLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()
  const pathname = usePathname()

  /* ====================== */
  /* LOGOUT */
  /* ====================== */

  const handleLogout = async (e:any) => {
    e.preventDefault()

    await fetch("/api/auth/logout", {
      method: "POST"
    })

    router.push("/login")
  }

  /* ====================== */
  /* ACTIVE LINK STYLE */
  /* ====================== */

  const linkClass = (path:string) =>
    `hover:text-gray-200 ${
      pathname === path ? "font-semibold text-white" : "text-gray-200"
    }`

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 bg-green-700 text-white p-6">

        <h2 className="text-xl font-bold mb-6">
          Nurse Panel
        </h2>

        <nav className="flex flex-col gap-4">

          <Link href="/nurse/dashboard" className={linkClass("/nurse/dashboard")}>
            Dashboard
          </Link>

          {/* ❌ direct vitals remove */}
          {/* <Link href="/nurse/vitals">Patient Vitals</Link> */}

          <Link href="/nurse/appointments" className={linkClass("/nurse/appointments")}>
            Appointments
          </Link>

          <Link href="/nurse/patients" className={linkClass("/nurse/patients")}>
            Patients
          </Link>

          <Link href="/nurse/profile" className={linkClass("/nurse/profile")}>
            Profile
          </Link>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="text-red-300 hover:text-red-400 text-left"
          >
            Logout
          </button>

        </nav>

      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>

    </div>
  )
}