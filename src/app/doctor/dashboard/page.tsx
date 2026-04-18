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
const [loading,setLoading] = useState(true)

useEffect(()=>{

const fetchData = async()=>{
try{
const [aRes,pRes] = await Promise.all([
fetch("/api/appointments",{ credentials:"include" }),
fetch("/api/prescriptions",{ credentials:"include" })
])

const aData = await aRes.json()
const pData = await pRes.json()

setAppointments(aData || [])
setPrescriptions(pData || [])

}catch(err){
console.log(err)
}finally{
setLoading(false)
}
}

fetchData()

},[])

if(loading){
return <div className="p-6 text-sm">Loading...</div>
}

/* 🔥 COUNTS */
const pending = appointments.filter(a=>a.status==="pending").length
const completed = appointments.filter(a=>a.status==="completed").length

const today = appointments.filter(a=>
new Date(a.date).toDateString() === new Date().toDateString()
)

/* 🔥 WEEKLY */
const weekAppointments = appointments.filter(a=>{
const d = new Date(a.date)
const now = new Date()
const diff = (now.getTime() - d.getTime())/(1000*60*60*24)
return diff <= 7
})

/* 🔥 UPCOMING */
const upcoming = appointments
.filter(a=> new Date(a.date) >= new Date())
.slice(0,5)

/* 🔥 NOTIFICATIONS */
const notifications = [
...appointments.slice(0,2).map(a=>({
type:"new",
text:`New appointment from ${a.patient?.name}`
})),
...appointments
.filter(a=>a.status==="cancelled")
.slice(0,2)
.map(a=>({
type:"cancel",
text:`Cancelled by ${a.patient?.name}`
}))
]

const chartData = [
{ name:"Pending", value: pending },
{ name:"Completed", value: completed }
]

return(

<div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-10 bg-gray-50 min-h-screen">

<h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
Doctor Dashboard
</h1>

{/* 🔥 NOTIFICATIONS */}
<div className="bg-white p-4 rounded-xl shadow">
<h2 className="font-semibold mb-2 text-sm">Notifications</h2>

{notifications.length === 0 && (
<p className="text-gray-500 text-sm">No notifications</p>
)}

<div className="space-y-2 text-sm">
{notifications.map((n,i)=>(
<p key={i}>
{n.type==="cancel" ? "❌" : "🟢"} {n.text}
</p>
))}
</div>

</div>

{/* 🔥 STATS */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

<div className="bg-blue-100 p-4 rounded-xl shadow">
<p className="text-xs text-gray-600">Total</p>
<h2 className="text-2xl font-bold">{appointments.length}</h2>
</div>

<div className="bg-yellow-100 p-4 rounded-xl shadow">
<p className="text-xs text-gray-600">Pending</p>
<h2 className="text-2xl font-bold">{pending}</h2>
</div>

<div className="bg-green-100 p-4 rounded-xl shadow">
<p className="text-xs text-gray-600">Completed</p>
<h2 className="text-2xl font-bold">{completed}</h2>
</div>

<div className="bg-purple-100 p-4 rounded-xl shadow">
<p className="text-xs text-gray-600">This Week</p>
<h2 className="text-2xl font-bold">{weekAppointments.length}</h2>
</div>

</div>

{/* 📊 CHART */}
<div className="bg-white p-6 rounded-xl shadow">
<h2 className="font-semibold mb-4">Appointments Overview</h2>

<div className="h-[260px]">
<ResponsiveContainer width="100%" height="100%">
<BarChart data={chartData}>
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Bar dataKey="value" radius={[6,6,0,0]} />
</BarChart>
</ResponsiveContainer>
</div>

</div>

{/* 🔥 UPCOMING */}
<div className="bg-white p-6 rounded-xl shadow">

<h2 className="font-semibold mb-4">
Upcoming Appointments
</h2>

{upcoming.length === 0 && (
<p className="text-gray-500 text-sm">
No upcoming appointments
</p>
)}

<div className="space-y-2 text-sm">

{upcoming.map((a:any)=>(
<div key={a.id} className="flex justify-between border-b pb-1">

<span>{a.patient?.name}</span>

<span className="text-gray-500">
{new Date(a.date).toLocaleDateString()}
</span>

</div>
))}

</div>

</div>

{/* 🧑 TODAY */}
<div className="bg-white p-6 rounded-xl shadow">

<h2 className="font-semibold mb-4">
Today's Patients
</h2>

{today.length === 0 && (
<p className="text-gray-500 text-sm">
No patients today
</p>
)}

<div className="space-y-2 text-sm">

{today.map((a:any)=>(
<div key={a.id} className="flex justify-between border-b pb-1">

<span>{a.patient?.name}</span>

<span className="text-gray-500">{a.time}</span>

</div>
))}

</div>

</div>

{/* 💊 RECENT PRESCRIPTIONS */}
<div className="bg-white p-6 rounded-xl shadow">

<h2 className="font-semibold mb-4">
Recent Prescriptions
</h2>

<div className="space-y-2 text-sm">

{prescriptions.slice(0,5).map((p:any)=>(
<div key={p.id} className="flex justify-between border-b pb-1">

<span>{p.patient?.name}</span>

<span className="text-gray-500">
{new Date(p.createdAt).toLocaleDateString()}
</span>

</div>
))}

</div>

</div>

</div>

)
}