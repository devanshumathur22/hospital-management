"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorAppointments(){

const router = useRouter()

const [appointments,setAppointments] = useState<any[]>([])
const [loading,setLoading] = useState(true)

const fetchAppointments = async ()=>{

try{

const res = await fetch("/api/appointments")
const data = await res.json()

setAppointments(data)

}catch(err){
console.log("APPOINTMENT ERROR",err)
}

setLoading(false)

}

useEffect(()=>{
fetchAppointments()
},[])

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

<div className="p-8">

<h1 className="text-3xl font-bold mb-8">
Doctor Appointments
</h1>

<div className="bg-white shadow rounded-xl overflow-hidden">

{appointments.length === 0 && (

<div className="p-10 text-center text-gray-500">
No appointments yet
</div>

)}

{appointments.length > 0 && (

<table className="w-full">

<thead className="bg-gray-100">

<tr>

<th className="p-4 text-left">Patient</th>
<th className="p-4 text-left">Date</th>
<th className="p-4 text-left">Time</th>
<th className="p-4 text-left">Status</th>
<th className="p-4 text-left">Action</th>

</tr>

</thead>

<tbody>

{appointments.map((a:any)=>(

<tr key={a.id} className="border-t">

<td className="p-4 font-medium">
{a.patient?.name || "Unknown Patient"}
</td>

<td className="p-4">
{new Date(a.date).toLocaleDateString()}
</td>

<td className="p-4">
{a.time || "-"}
</td>

<td className="p-4">

<span className={`px-3 py-1 rounded-full text-sm capitalize

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
className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
>
Complete
</button>

)}

<button
onClick={()=>openPrescription(a.id)}
className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded"
>
Prescription
</button>

</td>

</tr>

))}

</tbody>

</table>

)}

</div>

</div>

)

}