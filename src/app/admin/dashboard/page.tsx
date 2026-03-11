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
className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
>
<UserPlus size={18}/>
Add Doctor
</Link>

<Link
href="/admin/appointments"
className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
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
className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition border"
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



{/* RECENT APPOINTMENTS */}

<div className="bg-white rounded-xl shadow p-6">

<h2 className="text-xl font-semibold mb-4">
Recent Appointments
</h2>

{recentAppointments.length === 0 && (
<p className="text-gray-500">
No appointments yet
</p>
)}

<div className="space-y-3">

{recentAppointments.map((a:any)=>(

<div
key={a.id}
className="flex justify-between border-b pb-2 text-sm"
>

<span>
{a.patient?.name || "Patient"}
</span>

<span className="text-gray-500">
{new Date(a.date).toLocaleDateString()}
</span>

</div>

))}

</div>

</div>



{/* RECENT DOCTORS */}

<div className="bg-white rounded-xl shadow p-6">

<h2 className="text-xl font-semibold mb-4">
New Doctors
</h2>

{recentDoctors.length === 0 && (
<p className="text-gray-500">
No doctors found
</p>
)}

<div className="space-y-3">

{recentDoctors.map((d:any)=>(

<div
key={d.id}
className="flex justify-between border-b pb-2 text-sm"
>

<span>
{d.name}
</span>

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

<Link
href="/admin/doctors"
className="p-4 border rounded-lg hover:bg-gray-50"
>
Manage Doctors
</Link>

<Link
href="/admin/patients"
className="p-4 border rounded-lg hover:bg-gray-50"
>
View Patients
</Link>

<Link
href="/admin/appointments"
className="p-4 border rounded-lg hover:bg-gray-50"
>
Appointments
</Link>

<Link
href="/admin/calendar"
className="p-4 border rounded-lg hover:bg-gray-50"
>
Calendar
</Link>

<Link
href="/admin/reports"
className="p-4 border rounded-lg hover:bg-gray-50"
>
Reports
</Link>

<Link
href="/admin/add-doctor"
className="p-4 border rounded-lg hover:bg-gray-50"
>
Add Doctor
</Link>

</div>

</div>

</div>

)

}