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

<div className="p-8 space-y-10">

<h1 className="text-3xl font-bold">
Doctor Dashboard
</h1>

{/* Stats */}

<div className="grid md:grid-cols-4 gap-6">

<div className="bg-blue-100 p-6 rounded-xl">
<p>Appointments</p>
<h2 className="text-2xl font-bold">{appointments.length}</h2>
</div>

<div className="bg-yellow-100 p-6 rounded-xl">
<p>Pending</p>
<h2 className="text-2xl font-bold">{pending}</h2>
</div>

<div className="bg-green-100 p-6 rounded-xl">
<p>Completed</p>
<h2 className="text-2xl font-bold">{completed}</h2>
</div>

<div className="bg-purple-100 p-6 rounded-xl">
<p>Today</p>
<h2 className="text-2xl font-bold">{today.length}</h2>
</div>

</div>



{/* Chart */}

<div className="bg-white shadow rounded-xl p-6">

<h2 className="text-xl font-semibold mb-4">
Appointments Overview
</h2>

<div className="h-[250px]">

<ResponsiveContainer width="100%" height="100%">

<BarChart data={chartData}>

<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Bar dataKey="value" fill="#3b82f6" />

</BarChart>

</ResponsiveContainer>

</div>

</div>



{/* Today's Patients */}

<div className="bg-white shadow rounded-xl p-6">

<h2 className="text-xl font-semibold mb-4">
Today's Patients
</h2>

{today.length === 0 && (
<p className="text-gray-500">No patients today</p>
)}

{today.map((a:any)=>(
<div key={a.id} className="border-b py-2 flex justify-between">

<span>{a.patient?.name}</span>
<span>{a.time}</span>

</div>
))}

</div>



{/* Recent Prescriptions */}

<div className="bg-white shadow rounded-xl p-6">

<h2 className="text-xl font-semibold mb-4">
Recent Prescriptions
</h2>

{prescriptions.slice(0,5).map((p:any)=>(
<div key={p.id} className="border-b py-2">

<span className="font-medium">
{p.patient?.name}
</span>

<span className="text-gray-500 ml-2">
{new Date(p.createdAt).toLocaleDateString()}
</span>

</div>
))}

</div>



{/* Doctor Profile */}

<div className="bg-white shadow rounded-xl p-6">

<h2 className="text-xl font-semibold mb-4">
Doctor Profile
</h2>

<p><b>Name:</b> Dr. Example</p>
<p><b>Department:</b> Cardiology</p>
<p><b>Experience:</b> 8 Years</p>

</div>

</div>

)

}