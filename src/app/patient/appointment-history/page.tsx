"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Stethoscope, Calendar, Clock, CheckCircle, XCircle } from "lucide-react"

export default function AppointmentHistory(){

const [appointments,setAppointments] = useState<any[]>([])
const [loading,setLoading] = useState(true)

const [search,setSearch] = useState("")
const [dateFilter,setDateFilter] = useState("")

useEffect(()=>{

fetch("/api/appointments?type=history", {
  credentials:"include"
})
.then(res=>res.json())
.then(data=>{

setAppointments(Array.isArray(data) ? data : [])
setLoading(false)

})

},[])


/* ============================= */
/* FILTER */
/* ============================= */

const filtered = appointments.filter((a)=>{

const doctor = a.doctor?.name?.toLowerCase() || ""

const searchMatch = doctor.includes(search.toLowerCase())

const dateMatch = dateFilter
? new Date(a.date).toLocaleDateString() ===
new Date(dateFilter).toLocaleDateString()
: true

return searchMatch && dateMatch

})


/* ============================= */
/* LOADING */
/* ============================= */

if(loading){
return(
<div className="p-10 text-center text-gray-500">
Loading history...
</div>
)
}


/* ============================= */
/* UI */
/* ============================= */

return(

<div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

<h1 className="text-3xl font-bold mb-8">
Appointment History
</h1>


{/* SEARCH + FILTER */}

<div className="flex flex-col md:flex-row gap-4 mb-10">

<input
placeholder="Search doctor..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border px-4 py-2 rounded-lg w-full md:w-64"
/>

<input
type="date"
value={dateFilter}
onChange={(e)=>setDateFilter(e.target.value)}
className="border px-4 py-2 rounded-lg"
/>

</div>


{/* HISTORY CARDS */}

<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

{filtered.length === 0 && (

<p className="text-gray-500">
No appointment history
</p>

)}

{filtered.map((a:any)=>(

<motion.div
key={a.id}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
whileHover={{scale:1.03}}
className="backdrop-blur-xl bg-white/80 border border-white/30 p-6 rounded-2xl shadow-lg"
>

{/* Doctor */}

<h2 className="flex items-center gap-2 text-lg font-bold">
<Stethoscope size={18}/>
Dr. {a.doctor?.name}
</h2>


{/* Date */}

<p className="flex items-center gap-2 text-gray-600 text-sm mt-2">
<Calendar size={16}/>
{new Date(a.date).toDateString()}
</p>


{/* Time */}

<p className="flex items-center gap-2 text-gray-600 text-sm">
<Clock size={16}/>
{a.time}
</p>


{/* STATUS */}

<div className="mt-4">

<span className={`flex items-center gap-1 w-fit px-3 py-1 text-xs rounded-full

${a.status==="completed" && "bg-green-100 text-green-700"}

${a.status==="cancelled" && "bg-red-100 text-red-700"}

`}>

{a.status==="completed" && <CheckCircle size={14}/>}
{a.status==="cancelled" && <XCircle size={14}/>}

{a.status}

</span>

</div>

</motion.div>

))}

</div>

</div>

)

}