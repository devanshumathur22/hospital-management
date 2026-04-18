"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Activity, User } from "lucide-react"

export default function DoctorVitals(){

const params = useParams()
const patientId = params.id

const [vitals,setVitals] = useState<any[]>([])
const [loading,setLoading] = useState(true)

/* LOAD */
useEffect(()=>{
if(!patientId) return

fetch(`/api/vitals?patient=${patientId}`)
.then(res=>res.json())
.then(data=>setVitals(data || []))
.catch(()=>setVitals([]))
.finally(()=>setLoading(false))
,{ credentials: "include" }

},[patientId])

/* FORMAT */
const formatDate = (date:string)=>{
const d = new Date(date)

return {
date: d.toLocaleDateString(),
time: d.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
day: d.toLocaleDateString(undefined,{ weekday:"long" })
}
}

/* LOADING */
if(loading){
return <div className="p-6">Loading vitals...</div>
}

return(

<div className="min-h-screen bg-gray-100 p-6 space-y-6">

{/* HEADER */}
<h1 className="text-2xl font-bold flex items-center gap-2">
<Activity size={22}/> Patient Vitals History
</h1>

{/* EMPTY */}
{vitals.length === 0 && (
<p className="text-gray-500 text-sm">
No vitals recorded yet
</p>
)}

{/* LIST */}
<div className="space-y-4">

{vitals.map((v:any)=>{

const { date, time, day } = formatDate(v.createdAt)

return(

<div
key={v.id}
className="bg-white rounded-2xl shadow p-5 space-y-3"
>

{/* TOP */}
<div className="flex justify-between items-center">

<div className="flex items-center gap-2 text-sm font-medium">
<User size={16}/>
{v.nurse?.name || v.doctor?.name || "Staff"}
</div>

<div className="text-xs text-gray-500 text-right">
<p>{day}</p>
<p>{date} • {time}</p>
</div>

</div>

{/* VITALS */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">

<div>
<p className="text-gray-500">Blood Pressure</p>
<p className="font-semibold">{v.bp}</p>
</div>

<div>
<p className="text-gray-500">Temperature</p>
<p className="font-semibold">{v.temperature}°C</p>
</div>

<div>
<p className="text-gray-500">Pulse</p>
<p className="font-semibold">{v.pulse}</p>
</div>

<div>
<p className="text-gray-500">Recorded By</p>
<p className="font-semibold">
{v.nurse?.name || v.doctor?.name || "-"}
</p>
</div>

</div>

{/* NOTES */}
{v.notes && (
<div className="border-t pt-2 text-sm text-gray-600">
<b>Notes:</b> {v.notes}
</div>
)}

</div>

)

})}

</div>

</div>

)
}