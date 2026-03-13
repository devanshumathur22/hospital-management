"use client"

import { useEffect,useState } from "react"
import { User, Stethoscope } from "lucide-react"
import { motion } from "framer-motion"

export default function Doctors(){

const [doctors,setDoctors] = useState<any[]>([])

useEffect(()=>{

fetch("/api/doctors")
.then(res=>res.json())
.then(setDoctors)

},[])



return(

<div className="max-w-7xl mx-auto px-4 py-10">

<h1 className="flex items-center gap-2 text-3xl font-bold mb-10">

<Stethoscope size={26}/>

Doctors

</h1>



<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

{doctors.map(d=>(

<motion.div
key={d.id}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
whileHover={{y:-4}}
className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
>

{/* DOCTOR */}

<div className="flex items-center gap-3 mb-4">

<div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">

<User size={20}/>

</div>

<div>

<p className="font-semibold">
{d.name}
</p>

<p className="text-xs text-gray-500">
Doctor
</p>

</div>

</div>



{/* SPECIALIZATION */}

<div className="flex items-center gap-2 text-sm text-gray-600">

<Stethoscope size={14}/>

<span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
{d.specialization}
</span>

</div>

</motion.div>

))}

</div>

</div>

)

}