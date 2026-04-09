"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {

const router = useRouter()

const handleLogout = async()=>{

await fetch("/api/auth/logout",{
method:"POST"
})

localStorage.removeItem("patient")

router.push("/login")
}

return (
<div className="flex min-h-screen">

{/* Sidebar */}

<aside className="w-64 bg-blue-600 text-white p-6">

<h1 className="text-2xl font-bold mb-8">
Patient Panel
</h1>

<nav className="flex flex-col gap-4">

<Link href="/patient/dashboard">Dashboard</Link>
<Link href="/patient/doctors">Doctors</Link>
<Link href="/patient/appointments">Appointments</Link>
<Link href="/patient/prescriptions">Prescriptions</Link>
<Link href="/patient/appointment-history">Appointment History</Link>
<Link href="/patient/profile">Profile</Link>

{/* 🔥 LOGOUT SAME STYLE */}

<button
onClick={handleLogout}
className="text-left hover:opacity-80 transition"
>
Logout
</button>

</nav>

</aside>

{/* Page content */}

<main className="flex-1 p-10 bg-gray-100">
{children}
</main>

</div>
)
}