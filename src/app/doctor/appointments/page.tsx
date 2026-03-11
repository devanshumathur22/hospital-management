"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorAppointments(){

const router = useRouter()

const [appointments,setAppointments] = useState<any[]>([])
const [filtered,setFiltered] = useState<any[]>([])
const [loading,setLoading] = useState(true)
const [search,setSearch] = useState("")

const fetchAppointments = async ()=>{

try{

const res = await fetch("/api/appointments")
const data = await res.json()

setAppointments(data || [])
setFiltered(data || [])

}catch(err){
console.log("APPOINTMENT ERROR",err)
}

setLoading(false)

}

useEffect(()=>{
fetchAppointments()
},[])



useEffect(()=>{

const f = appointments.filter((a:any)=>
a.patient?.name?.toLowerCase().includes(search.toLowerCase())
)

setFiltered(f)

},[search,appointments])



const updateStatus = async(id:string,status:string)=>{

await fetch(`/api/appointments/${id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({status})
})

await fetchAppointments()

if(status==="completed"){
router.push(`/doctor/prescription/${id}`)
}

}



const openPrescription = (id:string)=>{
router.push(`/doctor/prescription/${id}`)
}



if(loading){

return(
<div className="p-8">
Loading appointments...
</div>
)

}



return(

<div className="p-8 space-y-6">

{/* TITLE */}

<h1 className="text-3xl font-bold text-gray-800">
Doctor Appointments
</h1>



{/* SEARCH */}

<input
type="text"
placeholder="Search patient..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border px-4 py-2 rounded-lg w-full md:w-80"
/>



{/* TABLE */}

<div className="bg-white shadow rounded-xl overflow-hidden">

{filtered.length === 0 && (

<div className="p-10 text-center text-gray-500">
No appointments found
</div>

)}



{filtered.length > 0 && (

<div className="overflow-x-auto">

<table className="w-full">

<thead className="bg-gray-100 text-sm text-gray-600">

<tr>

<th className="p-4 text-left">Patient</th>
<th className="p-4 text-left">Date</th>
<th className="p-4 text-left">Time</th>
<th className="p-4 text-left">Status</th>
<th className="p-4 text-left">Actions</th>

</tr>

</thead>



<tbody>

{filtered.map((a:any)=>(

<tr key={a.id} className="border-t hover:bg-gray-50">

<td className="p-4 font-medium">
{a.patient?.name || "Unknown"}
</td>

<td className="p-4">
{new Date(a.date).toLocaleDateString()}
</td>

<td className="p-4">
{a.time || "-"}
</td>



<td className="p-4">

<span className={`px-3 py-1 rounded-full text-xs capitalize font-medium

${a.status==="pending" && "bg-yellow-100 text-yellow-700"}
${a.status==="completed" && "bg-green-100 text-green-700"}
${a.status==="cancelled" && "bg-red-100 text-red-700"}

`}>

{a.status}

</span>

</td>



<td className="p-4 flex gap-2">

{a.status !== "completed" && (

<button
onClick={()=>updateStatus(a.id,"completed")}
className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
>

Complete

</button>

)}



<button
onClick={()=>openPrescription(a.id)}
className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded"
>

Prescription

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

)}

</div>

</div>

)

}