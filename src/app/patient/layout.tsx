"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {

const router = useRouter()
const [open,setOpen] = useState(false)

const handleLogout = async()=>{
  await fetch("/api/auth/logout",{ method:"POST" })
  localStorage.removeItem("patient")
  router.push("/login")
}

return (

<div className="flex min-h-screen bg-gray-100">

{/* 🔥 SIDEBAR */}
<aside
className={`
bg-blue-600 text-white p-6 w-64 min-h-screen
fixed md:static top-0 left-0 z-50 transform transition duration-300
${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
`}
>

<div className="flex justify-between items-center mb-8">

<h1 className="text-2xl font-bold">
Patient Panel
</h1>

<button onClick={()=>setOpen(false)} className="md:hidden">
<X size={22}/>
</button>

</div>

<nav className="flex flex-col gap-4">

<Link href="/patient/dashboard" onClick={()=>setOpen(false)}>Dashboard</Link>
<Link href="/patient/doctors" onClick={()=>setOpen(false)}>Doctors</Link>
<Link href="/patient/appointments" onClick={()=>setOpen(false)}>Appointments</Link>
<Link href="/patient/prescriptions" onClick={()=>setOpen(false)}>Prescriptions</Link>
<Link href="/patient/appointment-history" onClick={()=>setOpen(false)}>Appointment History</Link>
<Link href="/patient/profile" onClick={()=>setOpen(false)}>Profile</Link>

<button
onClick={handleLogout}
className="text-left hover:opacity-80 transition"
>
Logout
</button>

</nav>

</aside>

{/* 🔥 OVERLAY (mobile only) */}
{open && (
<div
onClick={()=>setOpen(false)}
className="fixed inset-0 bg-black/40 z-40 md:hidden"
/>
)}

{/* 🔥 MAIN */}
<div className="flex-1 flex flex-col">

{/* 🔥 MOBILE HEADER */}
<header className="md:hidden bg-white px-4 py-3 shadow flex items-center">

<button onClick={()=>setOpen(true)}>
<Menu size={24}/>
</button>

<h2 className="ml-4 font-semibold">
Patient Panel
</h2>

</header>

{/* 🔥 CONTENT */}
<main className="flex-1 p-6 md:p-10 bg-gray-100">
{children}
</main>

</div>

</div>

)
}