"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
User,
Calendar,
Clock,
CheckCircle,
FileText,
Search,
Activity
} from "lucide-react";

export default function DoctorAppointments(){

const router = useRouter()

const [appointments,setAppointments] = useState<any[]>([])
const [loading,setLoading] = useState(true)
const [search,setSearch] = useState("")


const fetchAppointments = async ()=>{

const res = await fetch("/api/appointments")
const data = await res.json()

setAppointments(data || [])
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



const filtered = appointments.filter((a:any)=>
a.patient?.name?.toLowerCase().includes(search.toLowerCase())
)



if(loading){
return <div className="p-10">Loading appointments...</div>
}



return(

<div className="max-w-7xl mx-auto px-4 py-10">

<h1 className="text-3xl font-bold mb-8">
Appointments
</h1>



{/* SEARCH */}

<div className="relative w-full md:w-96 mb-10">

<Search size={18} className="absolute left-3 top-3 text-gray-400"/>

<input
placeholder="Search patient..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="pl-10 pr-4 py-2 border rounded-lg w-full"
/>

</div>



{/* CARDS */}

<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

{filtered.map((a:any)=>(

<motion.div
key={a.id}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
whileHover={{y:-4}}
className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
>

{/* PATIENT */}

<div className="flex items-center gap-3 mb-4">

<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
<User size={18}/>
</div>

<div>

<p className="font-semibold">
{a.patient?.name || "Unknown"}
</p>

<p className="text-xs text-gray-500">
Patient
</p>

</div>

</div>



{/* DATE */}

<div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
<Calendar size={15}/>
{new Date(a.date).toDateString()}
</div>



{/* TIME */}

<div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
<Clock size={15}/>
{a.time}
</div>



{/* STATUS */}

<div className="mb-4">

<span className={`text-xs px-3 py-1 rounded-full

${a.status==="pending" && "bg-yellow-100 text-yellow-700"}

${a.status==="completed" && "bg-green-100 text-green-700"}

${a.status==="cancelled" && "bg-red-100 text-red-700"}

`}>

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

<button
onClick={()=>router.push(`/doctor/vitals/${a.id}`)}
className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
>

<Activity size={14}/>
Vitals

</button>

<button
onClick={()=>openPrescription(a.id)}
className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm"
>

<FileText size={14}/>
Prescription

</button>


</div>

</motion.div>

))}

</div>

</div>

)

}