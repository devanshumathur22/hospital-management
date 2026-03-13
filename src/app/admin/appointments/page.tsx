"use client";

import { useEffect,useState } from "react";
import { User, Stethoscope, Calendar, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminAppointments(){

const [appointments,setAppointments] = useState<any[]>([])
const [loading,setLoading] = useState(true)

const fetchAppointments = async()=>{

try{

const res = await fetch("/api/appointments")
const data = await res.json()

setAppointments(data || [])

}catch(err){
console.log("APPOINTMENT ERROR:",err)
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

fetchAppointments()

}



if(loading){
return(
<div className="p-10 text-center">
Loading appointments...
</div>
)
}



return(

<div className="max-w-7xl mx-auto px-4 py-10">

<h1 className="flex items-center gap-2 text-3xl font-bold mb-10">

<Calendar size={26}/>

Appointments

</h1>



{/* GRID */}

<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

{appointments.map((a:any)=>(

<motion.div
key={a.id}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
whileHover={{y:-4}}
className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
>

{/* DOCTOR */}

<div className="flex items-center gap-3 mb-3">

<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
<Stethoscope size={18}/>
</div>

<div>

<p className="font-semibold text-sm">
{a.doctor?.name || "Doctor"}
</p>

<p className="text-xs text-gray-500">
Doctor
</p>

</div>

</div>



{/* PATIENT */}

<div className="flex items-center gap-3 mb-3">

<div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
<User size={18}/>
</div>

<div>

<p className="font-medium text-sm">
{a.patient?.name || "Patient"}
</p>

<p className="text-xs text-gray-500">
Patient
</p>

</div>

</div>



{/* DATE */}

<div className="flex items-center gap-2 text-sm text-gray-600 mb-4">

<Calendar size={14}/>

{new Date(a.date).toLocaleDateString()}

</div>



{/* STATUS */}

<div className="mb-4">

<span
className={`px-3 py-1 rounded-full text-xs capitalize

${a.status==="pending" && "bg-yellow-100 text-yellow-700"}

${a.status==="completed" && "bg-green-100 text-green-700"}

${a.status==="cancelled" && "bg-red-100 text-red-700"}

`}
>

{a.status}

</span>

</div>



{/* ACTIONS */}

<div className="flex gap-2">

{a.status !== "completed" && (

<button
onClick={()=>updateStatus(a.id,"completed")}
className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm"
>

<CheckCircle size={14}/>

Complete

</button>

)}



{a.status !== "cancelled" && (

<button
onClick={()=>updateStatus(a.id,"cancelled")}
className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm"
>

<XCircle size={14}/>

Cancel

</button>

)}

</div>

</motion.div>

))}

</div>

</div>

)

}