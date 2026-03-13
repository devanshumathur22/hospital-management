"use client"

import { useEffect,useState } from "react"
import {
Users,
UserPlus,
Calendar,
Activity
} from "lucide-react"
import { motion } from "framer-motion"

export default function AdminReports(){

const [stats,setStats] = useState<any>(null)

useEffect(()=>{

fetch("/api/stats")
.then(res=>res.json())
.then(data=>{
setStats(data)
})

},[])



if(!stats){
return <div className="p-10 text-center">Loading reports...</div>
}



return(

<div className="max-w-7xl mx-auto px-4 py-10 space-y-10">

{/* TITLE */}

<h1 className="text-3xl font-bold">
Reports & Analytics
</h1>



{/* STATS GRID */}

<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

{/* DOCTORS */}

<motion.div
whileHover={{y:-4}}
className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
>

<div className="flex items-center gap-3 mb-3">

<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
<Users size={18}/>
</div>

<span className="text-sm text-gray-500">
Doctors
</span>

</div>

<p className="text-3xl font-bold">
{stats.doctors}
</p>

</motion.div>



{/* PATIENTS */}

<motion.div
whileHover={{y:-4}}
className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
>

<div className="flex items-center gap-3 mb-3">

<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
<UserPlus size={18}/>
</div>

<span className="text-sm text-gray-500">
Patients
</span>

</div>

<p className="text-3xl font-bold">
{stats.patients}
</p>

</motion.div>



{/* APPOINTMENTS */}

<motion.div
whileHover={{y:-4}}
className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
>

<div className="flex items-center gap-3 mb-3">

<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
<Calendar size={18}/>
</div>

<span className="text-sm text-gray-500">
Appointments
</span>

</div>

<p className="text-3xl font-bold">
{stats.appointments}
</p>

</motion.div>



{/* TODAY */}

<motion.div
whileHover={{y:-4}}
className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
>

<div className="flex items-center gap-3 mb-3">

<div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
<Activity size={18}/>
</div>

<span className="text-sm text-gray-500">
Today
</span>

</div>

<p className="text-3xl font-bold">
{stats.today}
</p>

</motion.div>

</div>

</div>

)

}