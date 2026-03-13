"use client"

import { useEffect, useState } from "react"
import {
User,
Stethoscope,
Clock,
Activity
} from "lucide-react"
import { motion } from "framer-motion"

export default function NurseAppointments(){

const [appointments,setAppointments] = useState<any[]>([])

useEffect(()=>{

fetch("/api/appointments")
.then(res=>res.json())
.then(data=>{

/* TODAY ONLY */

const today = new Date().toLocaleDateString()

const filtered = data.filter((a:any)=>
new Date(a.date).toLocaleDateString() === today
)

setAppointments(filtered)

})

},[])



return(

<div className="max-w-6xl mx-auto px-6 py-10">

<h1 className="text-2xl font-semibold mb-8">
Today's Appointments
</h1>



<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

{appointments.map((a:any)=>(

<motion.div
key={a.id}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
whileHover={{y:-4}}
className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
>

{/* PATIENT */}

<div className="flex items-center gap-2 text-sm mb-2">

<User size={15}/>

{a.patient?.name || "Patient"}

</div>



{/* DOCTOR */}

<div className="flex items-center gap-2 text-sm mb-2">

<Stethoscope size={15}/>

{a.doctor?.name || "Doctor"}

</div>



{/* TIME */}

<div className="flex items-center gap-2 text-sm mb-4">

<Clock size={15}/>

{a.time}

</div>



{/* VITALS BUTTON */}

<a
href={`/nurse/vitals/${a.id}`}
className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
>

<Activity size={16}/>

Add Vitals

</a>

</motion.div>

))}

</div>

</div>

)

}