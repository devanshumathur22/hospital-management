"use client"

import { useEffect, useState } from "react"
import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"

export default function DoctorDashboard(){

const [appointments,setAppointments] = useState<any[]>([])
const [prescriptions,setPrescriptions] = useState<any[]>([])

useEffect(()=>{

fetch("/api/appointments")
.then(res=>res.json())
.then(data=>setAppointments(data || []))

fetch("/api/prescriptions")
.then(res=>res.json())
.then(data=>setPrescriptions(data || []))

},[])

const pending = appointments.filter(a=>a.status === "pending").length
const completed = appointments.filter(a=>a.status === "completed").length

const today = appointments.filter(a=>
new Date(a.date).toDateString() === new Date().toDateString()
)

const chartData = [
{ name:"Pending", value: pending },
{ name:"Completed", value: completed }
]

return(

<div className="p-8 space-y-10 bg-gray-50 min-h-screen">

{/* TITLE */}

<h1 className="text-3xl font-bold text-gray-800">
Doctor Dashboard
</h1>



{/* STATS */}

<div className="grid md:grid-cols-4 gap-6">

<div className="bg-blue-100 p-6 rounded-xl shadow">

<p className="text-gray-600 text-sm">
Appointments
</p>

<h2 className="text-3xl font-bold text-blue-700">
{appointments.length}
</h2>

</div>

<div className="bg-yellow-100 p-6 rounded-xl shadow">

<p className="text-gray-600 text-sm">
Pending
</p>

<h2 className="text-3xl font-bold text-yellow-700">
{pending}
</h2>

</div>

<div className="bg-green-100 p-6 rounded-xl shadow">

<p className="text-gray-600 text-sm">
Completed
</p>

<h2 className="text-3xl font-bold text-green-700">
{completed}
</h2>

</div>

<div className="bg-purple-100 p-6 rounded-xl shadow">

<p className="text-gray-600 text-sm">
Today
</p>

<h2 className="text-3xl font-bold text-purple-700">
{today.length}
</h2>

</div>

</div>



{/* CHART */}

<div className="bg-white shadow rounded-xl p-6">

<h2 className="text-lg font-semibold mb-4 text-gray-700">
Appointments Overview
</h2>

<div className="h-[260px]">

<ResponsiveContainer width="100%" height="100%">

<BarChart data={chartData}>

<XAxis dataKey="name" />
<YAxis />
<Tooltip />

<Bar
dataKey="value"
fill="#2563eb"
radius={[6,6,0,0]}
/>

</BarChart>

</ResponsiveContainer>

</div>

</div>



{/* TODAY PATIENTS */}

<div className="bg-white shadow rounded-xl p-6">

<h2 className="text-lg font-semibold mb-4">
Today's Patients
</h2>

{today.length === 0 && (
<p className="text-gray-500">
No patients today
</p>
)}

<div className="space-y-3">

{today.map((a:any)=>(
<div
key={a.id}
className="flex justify-between border-b pb-2 text-sm"
>

<span className="font-medium">
{a.patient?.name}
</span>

<span className="text-gray-500">
{a.time}
</span>

</div>
))}

</div>

</div>



{/* RECENT PRESCRIPTIONS */}

<div className="bg-white shadow rounded-xl p-6">

<h2 className="text-lg font-semibold mb-4">
Recent Prescriptions
</h2>

<div className="space-y-3">

{prescriptions.slice(0,5).map((p:any)=>(
<div
key={p.id}
className="flex justify-between border-b pb-2 text-sm"
>

<span className="font-medium">
{p.patient?.name}
</span>

<span className="text-gray-500">
{new Date(p.createdAt).toLocaleDateString()}
</span>

</div>
))}

</div>

</div>



{/* PROFILE */}

<div className="bg-white shadow rounded-xl p-6">

<h2 className="text-lg font-semibold mb-4">
Doctor Profile
</h2>

<div className="space-y-2 text-sm">

<p>
<b>Name:</b> Dr. Example
</p>

<p>
<b>Department:</b> Cardiology
</p>

<p>
<b>Experience:</b> 8 Years
</p>

</div>

</div>

</div>

)

}