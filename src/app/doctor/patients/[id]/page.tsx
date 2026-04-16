"use client"

import { useEffect,useState } from "react"
import { useParams } from "next/navigation"
import { Calendar, Clock, FileText, User } from "lucide-react"

export default function PatientHistory(){

const params = useParams()

const [data,setData] = useState<any>(null)
const [loading,setLoading] = useState(true)

useEffect(()=>{

fetch(`/api/patients/${params.id}`)
.then(res=>res.json())
.then(setData)
.catch(()=>setData(null))
.finally(()=>setLoading(false))

},[])

if(loading){
return <div className="p-6 text-sm">Loading history...</div>
}

if(!data){
return <div className="p-6 text-sm">Patient not found</div>
}

return(

<div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

{/* HEADER */}
<div className="flex items-center gap-3">

<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
<User size={20}/>
</div>

<div>
<h1 className="text-xl sm:text-2xl font-bold">
{data.name}
</h1>
<p className="text-sm text-gray-500">
{data.phone} • {data.gender}
</p>
</div>

</div>

{/* 🔥 APPOINTMENTS */}
<div>

<h2 className="font-semibold text-lg mb-3">
Appointments
</h2>

{data.appointments.length === 0 && (
<p className="text-sm text-gray-500">
No appointments
</p>
)}

<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

{data.appointments.map((a:any)=>(

<div key={a.id} className="border p-3 rounded-xl bg-white shadow-sm space-y-2">

<p className="flex items-center gap-2 text-sm">
<Calendar size={14}/>
{new Date(a.date).toDateString()}
</p>

<p className="flex items-center gap-2 text-sm">
<Clock size={14}/>
{a.time}
</p>

<span className={`text-xs px-2 py-1 rounded-full

${a.status==="completed" && "bg-green-100 text-green-700"}
${a.status==="pending" && "bg-yellow-100 text-yellow-700"}
${a.status==="cancelled" && "bg-red-100 text-red-700"}

`}>
{a.status}
</span>

</div>

))}

</div>

</div>

{/* 🔥 PRESCRIPTIONS */}
<div>

<h2 className="font-semibold text-lg mb-3">
Prescriptions
</h2>

{data.prescriptions.length === 0 && (
<p className="text-sm text-gray-500">
No prescriptions
</p>
)}

<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

{data.prescriptions.map((p:any)=>(

<div key={p.id} className="border p-3 rounded-xl bg-white shadow-sm space-y-2">

<p className="flex items-center gap-2 text-sm">
<FileText size={14}/>
{new Date(p.createdAt).toDateString()}
</p>

<p className="text-sm">
{p.medicine?.length} medicines
</p>

</div>

))}

</div>

</div>

</div>

)
}