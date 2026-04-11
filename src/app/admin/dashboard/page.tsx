"use client";

import { useEffect, useState } from "react";
import {
Users,
Stethoscope,
CalendarCheck,
Activity,
UserPlus,
CalendarPlus
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard(){

const [stats,setStats] = useState({
doctors:0,
patients:0,
appointments:0,
today:0
})

const [recentAppointments,setRecentAppointments] = useState<any[]>([])
const [recentDoctors,setRecentDoctors] = useState<any[]>([])

useEffect(()=>{

fetch("/api/stats")
.then(res=>res.json())
.then(data=>{
setStats({
doctors:data.doctors || 0,
patients:data.patients || 0,
appointments:data.appointments || 0,
today:data.today || 0
})
})

fetch("/api/appointments")
.then(res=>res.json())
.then(data=>setRecentAppointments(data.slice(0,5)))

fetch("/api/doctors")
.then(res=>res.json())
.then(data=>setRecentDoctors(data.slice(0,5)))

},[])

/* ============================= */
/* STATUS UPDATE */
/* ============================= */

const updateStatus = async(id:string,status:string)=>{

await fetch(`/api/appointments/${id}`,{
method:"PUT",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ status })
})

setRecentAppointments(prev =>
prev.map(a => a.id === id ? {...a,status} : a)
)

}

/* ============================= */
/* STATUS COLOR */
/* ============================= */

const getStatusColor = (status:string)=>{

switch(status){
case "confirmed": return "bg-green-100 text-green-600"
case "cancelled": return "bg-red-100 text-red-600"
case "completed": return "bg-blue-100 text-blue-600"
default: return "bg-yellow-100 text-yellow-600"
}

}

const cards = [

{
title:"Doctors",
value:stats.doctors,
icon:Stethoscope,
color:"bg-blue-100 text-blue-600"
},

{
title:"Patients",
value:stats.patients,
icon:Users,
color:"bg-green-100 text-green-600"
},

{
title:"Appointments",
value:stats.appointments,
icon:CalendarCheck,
color:"bg-purple-100 text-purple-600"
},

{
title:"Active Today",
value:stats.today,
icon:Activity,
color:"bg-orange-100 text-orange-600"
}

]

return(

<div className="p-8 space-y-10">

{/* HEADER */}

<div className="flex justify-between items-center">

<h1 className="text-3xl font-bold">
Admin Dashboard
</h1>

<div className="flex gap-3">

<Link
href="/admin/add-doctor"
className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
>
<UserPlus size={18}/>
Add Doctor
</Link>

<Link
href="/admin/appointments"
className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
>
<CalendarPlus size={18}/>
Appointments
</Link>

</div>

</div>

{/* STATS */}

<div className="grid md:grid-cols-4 gap-6">

{cards.map((card,i)=>{

const Icon = card.icon

return(

<div
key={i}
className="p-6 bg-white rounded-xl shadow border"
>

<div className="flex justify-between items-center">

<div>

<p className="text-gray-500 text-sm">
{card.title}
</p>

<h2 className="text-2xl font-bold">
{card.value}
</h2>

</div>

<div className={`p-3 rounded-lg ${card.color}`}>
<Icon size={22}/>
</div>

</div>

</div>

)

})}

</div>

{/* MAIN GRID */}

<div className="grid md:grid-cols-2 gap-8">

{/* APPOINTMENTS */}

<div className="bg-white rounded-xl shadow p-6">

<h2 className="text-xl font-semibold mb-4">
Recent Appointments
</h2>

{recentAppointments.length === 0 && (
<p className="text-gray-500">No appointments yet</p>
)}

<div className="space-y-4">

{recentAppointments.map((a:any)=>(

<div
key={a.id}
className="flex flex-col gap-2 border-b pb-3 text-sm"
>

<div className="flex justify-between">

<span>
{a.patient?.name || "Patient"}
</span>

<span className="text-gray-500">
{new Date(a.date).toLocaleDateString()}
</span>

</div>

<div className="flex justify-between items-center">

<span className={`px-2 py-1 text-xs rounded ${getStatusColor(a.status)}`}>
{a.status}
</span>

<div className="flex gap-2">

<button
onClick={()=>updateStatus(a.id,"confirmed")}
className="text-green-600 text-xs"
>
Confirm
</button>

<button
onClick={()=>updateStatus(a.id,"cancelled")}
className="text-red-600 text-xs"
>
Cancel
</button>

</div>

</div>

</div>

))}

</div>

</div>

{/* DOCTORS */}

<div className="bg-white rounded-xl shadow p-6">

<h2 className="text-xl font-semibold mb-4">
New Doctors
</h2>

{recentDoctors.length === 0 && (
<p className="text-gray-500">No doctors found</p>
)}

<div className="space-y-3">

{recentDoctors.map((d:any)=>(

<div
key={d.id}
className="flex justify-between border-b pb-2 text-sm"
>

<span>{d.name}</span>

<span className="text-gray-500">
{d.specialization}
</span>

</div>

))}

</div>

</div>

</div>

{/* QUICK ACTIONS */}

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-semibold mb-4">
Quick Actions
</h2>

<div className="grid md:grid-cols-4 gap-4">

<Link href="/admin/doctors" className="p-4 border rounded-lg">Manage Doctors</Link>
<Link href="/admin/patients" className="p-4 border rounded-lg">View Patients</Link>
<Link href="/admin/appointments" className="p-4 border rounded-lg">Appointments</Link>
<Link href="/admin/calendar" className="p-4 border rounded-lg">Calendar</Link>
<Link href="/admin/reports" className="p-4 border rounded-lg">Reports</Link>
<Link href="/admin/add-doctor" className="p-4 border rounded-lg">Add Doctor</Link>

</div>

</div>

</div>

)

}