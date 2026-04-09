"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect,useState } from "react"

import {
LayoutDashboard,
CalendarDays,
FileText,
User,
Calendar,
LogOut
} from "lucide-react"

export default function DoctorLayout({ children }: { children: React.ReactNode }){

const pathname = usePathname()
const router = useRouter()

const [doctor,setDoctor] = useState<any>(null)

useEffect(()=>{
const loadDoctor = async()=>{
try{
const res = await fetch("/api/doctors/me")
const data = await res.json()
setDoctor(data)
}catch(err){
console.log("DOCTOR LOAD ERROR",err)
}
}
loadDoctor()
},[])

/* 🔥 LOGOUT FUNCTION */
const handleLogout = async()=>{
await fetch("/api/auth/logout",{ method:"POST" })
router.push("/login")
}

const menu = [

{ name:"Dashboard", href:"/doctor/dashboard", icon:LayoutDashboard },
{ name:"Appointments", href:"/doctor/appointments", icon:CalendarDays },
{ name:"Calendar", href:"/doctor/calendar", icon:Calendar },
{ name:"Prescriptions", href:"/doctor/prescriptions", icon:FileText },
{ name:"Profile", href:"/doctor/profile", icon:User },
{ name:"Admitted Patients", href:"/doctor/admitted-patients", icon:CalendarDays },

/* 🔥 LOGOUT ITEM */
{ name:"Logout", href:"#logout", icon:LogOut }

]

return(

<div className="flex min-h-screen bg-gray-100">

<aside className="w-64 bg-green-700 text-white p-6">

<h1 className="text-2xl font-bold mb-10">
Doctor Panel
</h1>

<nav className="space-y-2">

{menu.map((item)=>{

const Icon = item.icon

/* 🔥 LOGOUT SPECIAL CASE */
if(item.name === "Logout"){
return(
<button
key="logout"
onClick={handleLogout}
className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left"
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
className={`flex items-center gap-3 px-4 py-3 rounded-lg transition

${pathname === item.href
? "bg-white text-green-700 font-semibold"
: "hover:bg-green-600"}

`}
>

<Icon size={18}/>
{item.name}

</Link>

)

})}

</nav>

</aside>

{/* MAIN */}

<div className="flex-1 flex flex-col">

<header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">

<h2 className="text-xl font-semibold text-gray-700">
Doctor Dashboard
</h2>

<div className="flex items-center gap-4">

<div className="text-sm text-gray-600">
{doctor ? `Dr. ${doctor.name}` : "Loading..."}
</div>

<div className="w-8 h-8 bg-green-600 text-white flex items-center justify-center rounded-full text-sm font-semibold">
{doctor?.name?.charAt(0) || "D"}
</div>

</div>

</header>

<main className="p-8">
{children}
</main>

</div>

</div>

)
}