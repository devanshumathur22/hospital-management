"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import {
  Menu,
  X,
  LayoutDashboard,
  UserPlus,
  Stethoscope,
  Users,
  Calendar,
  ClipboardList,
  BarChart3,
  LogOut,
  Search
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()
  const pathname = usePathname()

  const [open,setOpen] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/auth/logout",{ method:"POST", credentials:"include" })
    router.push("/login")
  }

  const menu = [
    { name:"Dashboard", href:"/admin/dashboard", icon:LayoutDashboard },
    { name:"Add Doctor", href:"/admin/add-doctor", icon:UserPlus },
    { name:"Doctors", href:"/admin/doctors", icon:Stethoscope },
    { name:"Assign Nurse", href:"/admin/assign-nurse", icon:Users },
    { name:"Nurses", href:"/admin/nurses", icon:Users },
    { name:"Appointments", href:"/admin/appointments", icon:ClipboardList },
    { name:"Patients", href:"/admin/patients", icon:Users },
    { name:"Calendar", href:"/admin/calendar", icon:Calendar },
    { name:"Reports", href:"/admin/reports", icon:BarChart3 },
    { name:"Search", href:"/admin/search", icon:Search },
    { name:"Logout", href:"#logout", icon:LogOut }
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* 🔥 SIDEBAR */}
      <aside className={`
        bg-blue-700 text-white p-6 w-64 min-h-screen
        fixed md:static top-0 left-0 z-50 transform transition duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">Admin Panel</h1>

          <button onClick={()=>setOpen(false)} className="md:hidden">
            <X size={20}/>
          </button>
        </div>

        <nav className="space-y-2">

          {menu.map((item)=>{

            const Icon = item.icon

            if(item.name === "Logout"){
              return(
                <button
                  key="logout"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-blue-600"
                >
                  <Icon size={18}/>
                  Logout
                </button>
              )
            }

            return(
              <Link
                key={item.href}
                href={item.href}
                onClick={()=>setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${pathname === item.href
                  ? "bg-white text-blue-700 font-semibold"
                  : "hover:bg-blue-600"}
                `}
              >
                <Icon size={18}/>
                {item.name}
              </Link>
            )
          })}

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

        {/* 🔥 HEADER */}
        <header className="bg-white shadow-sm px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">

            <button onClick={()=>setOpen(true)} className="md:hidden">
              <Menu size={22}/>
            </button>

            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700">
              Admin Dashboard
            </h2>

          </div>

          {/* PROFILE */}
          <div className="flex items-center gap-3">

            <div className="text-sm text-gray-600 hidden sm:block">
              Admin
            </div>

            <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm font-semibold">
              A
            </div>

          </div>

        </header>

        {/* 🔥 CONTENT */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>

      </div>

    </div>
  )
}