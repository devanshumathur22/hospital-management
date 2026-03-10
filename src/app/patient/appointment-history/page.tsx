"use client"

import { useEffect, useState } from "react"

export default function AppointmentHistory(){

const [appointments,setAppointments] = useState<any[]>([])
const [loading,setLoading] = useState(true)

useEffect(()=>{

fetch("/api/appointments")
.then(res=>res.json())
.then(data=>{

/* HISTORY ONLY */

const history = data.filter(
(a:any)=>a.status === "completed" || a.status === "cancelled"
)

setAppointments(history)

setLoading(false)

})

},[])

if(loading){

return(
<div className="p-8">
Loading history...
</div>
)

}

return(

<div className="max-w-6xl mx-auto px-8 py-10">

<h1 className="text-3xl font-bold mb-8">
Appointment History
</h1>

<div className="grid md:grid-cols-2 gap-6">

{appointments.length === 0 && (

<p className="text-gray-500">
No appointment history
</p>

)}

{appointments.map((a:any)=>(

<div
key={a.id}
className="bg-white p-6 rounded-xl shadow"
>

<h2 className="text-xl font-bold">
👨‍⚕️ {a.doctor?.name}
</h2>

<p className="text-gray-600">
Date: {new Date(a.date).toDateString()}
</p>

<p className="text-gray-600">
Time: {a.time}
</p>

<p className="mt-3">

<span className={`px-3 py-1 text-sm rounded-full

${a.status==="completed" && "bg-green-100 text-green-700"}

${a.status==="cancelled" && "bg-red-100 text-red-700"}

`}>

{a.status}

</span>

</p>

</div>

))}

</div>

</div>

)

}