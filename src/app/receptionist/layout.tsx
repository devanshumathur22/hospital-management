"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  List,
  LogOut
} from "lucide-react"

export default function ReceptionistLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()
  const pathname = usePathname()
  const [open,setOpen] = useState(false)

  /* 🔥 LOGOUT */
  const handleLogout = async()=>{
    await fetch("/api/auth/logout",{ method:"POST" })
    router.push("/login")
  }

  const links = [
    { name:"Dashboard", href:"/receptionist/dashboard", icon:LayoutDashboard },
    { name:"Patients", href:"/receptionist/patients", icon:Users },
    { name:"Appointments", href:"/receptionist/book", icon:Calendar },
    { name:"Doctors", href:"/receptionist/doctors", icon:Stethoscope },
    { name:"Queue", href:"/receptionist/queue", icon:List },
  ]

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* 🔥 SIDEBAR */}
      <aside
        className={`
        bg-gradient-to-b from-blue-600 to-purple-600 text-white p-6 w-64 min-h-screen
        fixed md:static top-0 left-0 z-50 transform transition duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-2xl font-bold">
            Reception Panel
          </h1>

          <button onClick={()=>setOpen(false)} className="md:hidden">
            <X size={22}/>
          </button>

        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-2">

          {links.map(link=>{

            const Icon = link.icon
            const active = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={()=>setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${active
                    ? "bg-white text-blue-600 font-semibold"
                    : "hover:bg-white/20"
                  }`}
              >
                <Icon size={18}/>
                {link.name}
              </Link>
            )
          })}

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
          >
            <LogOut size={18}/>
            Logout
          </button>

        </nav>

      </aside>

      {/* 🔥 OVERLAY */}
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
            Reception Panel
          </h2>

        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 md:p-10">
          {children}
        </main>

      </div>

    </div>

  )
}