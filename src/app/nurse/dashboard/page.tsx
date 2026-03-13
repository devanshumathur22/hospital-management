"use client"

import { useEffect, useState } from "react"
import {
Calendar,
Activity,
CheckCircle,
User,
Stethoscope,
Clock
} from "lucide-react"
import { motion } from "framer-motion"

export default function NurseDashboard(){

const [appointments,setAppointments] = useState<any[]>([])

useEffect(()=>{

fetch("/api/appointments")
.then(res=>res.json())
.then(setAppointments)

},[])

const vitalsPending = appointments.length
const readyForDoctor = 0



return(

<div className="max-w-7xl mx-auto px-6 py-10 space-y-10">


{/* TITLE */}

<h1 className="text-2xl font-semibold">
Nurse Dashboard
</h1>



{/* ================== */}
{/* STATS */}
{/* ================== */}

<div className="grid md:grid-cols-3 gap-6">


{/* APPOINTMENTS */}

<div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">

<Calendar size={26} className="text-blue-600"/>

<div>

<p className="text-gray-500 text-sm">
Appointments Today
</p>

<p className="text-2xl font-bold">
{appointments.length}
</p>

</div>

</div>



{/* VITALS */}

<div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">

<Activity size={26} className="text-orange-500"/>

<div>

<p className="text-gray-500 text-sm">
Vitals Pending
</p>

<p className="text-2xl font-bold">
{vitalsPending}
</p>

</div>

</div>



{/* READY */}

<div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">

<CheckCircle size={26} className="text-green-600"/>

<div>

<p className="text-gray-500 text-sm">
Ready For Doctor
</p>

<p className="text-2xl font-bold">
{readyForDoctor}
</p>

</div>

</div>

</div>



{/* ================== */}
{/* PATIENT LIST */}
{/* ================== */}

<div>

<h2 className="text-xl font-semibold mb-6">
Today's Patients
</h2>



<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

{appointments.map((a:any)=>(

<motion.div
key={a.id}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
whileHover={{y:-4}}
className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
>

{/* PATIENT */}

<div className="flex items-center gap-2 text-sm mb-2">

<User size={15}/>

<span className="font-medium">
{a.patient?.name}
</span>

</div>



{/* DOCTOR */}

<div className="flex items-center gap-2 text-sm mb-2">

<Stethoscope size={15}/>

{a.doctor?.name}

</div>



{/* TIME */}

<div className="flex items-center gap-2 text-sm mb-4">

<Clock size={15}/>

{a.time}

</div>



{/* BUTTON */}

<a
href={`/nurse/vitals?patient=${a.patientId}`}
className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm"
>

<Activity size={16}/>

Add Vitals

</a>

</motion.div>

))}

</div>

</div>

</div>

)

}