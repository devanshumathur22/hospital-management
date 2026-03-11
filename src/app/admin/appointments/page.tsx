"use client";

import { useEffect, useState } from "react";

export default function AdminAppointments(){

const [appointments,setAppointments] = useState<any[]>([])
const [loading,setLoading] = useState(true)



const fetchAppointments = async()=>{

try{

const res = await fetch("/api/appointments")
const data = await res.json()

setAppointments(data)

}catch(err){

console.log("APPOINTMENT ERROR:",err)

}

setLoading(false)

}



useEffect(()=>{
fetchAppointments()
},[])



/* UPDATE STATUS */

const updateStatus = async(id:string,status:string)=>{

await fetch(`/api/appointments/${id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({status})

})

fetchAppointments()

}



if(loading){

return(
<div className="p-8">
Loading appointments...
</div>
)

}



return(

<div className="p-8 w-full space-y-8">

{/* TITLE */}

<h1 className="text-3xl font-bold">
Appointments
</h1>



{/* TABLE */}

<div className="bg-white shadow-xl rounded-xl overflow-hidden border">

<table className="w-full">

<thead className="bg-gray-100">

<tr>

<th className="p-4 text-left">Doctor</th>
<th className="p-4 text-left">Patient</th>
<th className="p-4 text-left">Date</th>
<th className="p-4 text-left">Status</th>
<th className="p-4 text-left">Actions</th>

</tr>

</thead>



<tbody>

{appointments.length === 0 && (

<tr>
<td colSpan={5} className="p-10 text-center text-gray-500">
No appointments found
</td>
</tr>

)}



{appointments.map((a:any)=>(

<tr key={a.id} className="border-t hover:bg-gray-50 transition">

<td className="p-4 font-medium">
{a.doctor?.name || "N/A"}
</td>

<td className="p-4">
{a.patient?.name || "N/A"}
</td>

<td className="p-4">
{new Date(a.date).toLocaleDateString()}
</td>



{/* STATUS */}

<td className="p-4">

<span
className={`px-3 py-1 rounded-full text-sm capitalize

${a.status==="pending" && "bg-yellow-100 text-yellow-700"}

${a.status==="completed" && "bg-green-100 text-green-700"}

${a.status==="cancelled" && "bg-red-100 text-red-700"}

`}
>

{a.status}

</span>

</td>



{/* ACTIONS */}

<td className="p-4 flex gap-2">

{a.status !== "completed" && (

<button
onClick={()=>updateStatus(a.id,"completed")}
className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
>
Complete
</button>

)}

{a.status !== "cancelled" && (

<button
onClick={()=>updateStatus(a.id,"cancelled")}
className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
>
Cancel
</button>

)}

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}