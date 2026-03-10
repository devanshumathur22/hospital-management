"use client"

import { useEffect, useState } from "react"
import { CalendarPlus, UserRound, UserRoundCheck } from "lucide-react"
import { motion } from "framer-motion"

import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"

export default function Doctors(){

const [doctors,setDoctors] = useState<any[]>([])

useEffect(()=>{

const fetchDoctors = async()=>{

const res = await fetch("/api/doctors")
const data = await res.json()

setDoctors(data)

}

fetchDoctors()

},[])



return(

<>
<Navbar/>

<div className="py-20 px-6 bg-gradient-to-b from-white to-blue-50 min-h-screen">

<h1 className="text-4xl font-bold text-center mb-16">
Our Doctors
</h1>


<div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">


{doctors.map((doc:any)=>(
<motion.div

key={doc._id || doc.id}

whileHover={{y:-10,scale:1.03}}

className="bg-white/60 backdrop-blur-lg border border-white/30 rounded-3xl shadow-xl overflow-hidden cursor-pointer"

>


{/* ICON */}

<div className="h-28 bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">

{doc.gender === "female" ? (

<UserRoundCheck size={42} className="text-white"/>

) : (

<UserRound size={42} className="text-white"/>

)}

</div>



{/* INFO */}

<div className="p-6 text-center">

<h3 className="text-lg font-semibold">

{doc.name}

</h3>


<p className="text-gray-500 text-sm">

{doc.specialization}

</p>


<span className="inline-block mt-3 text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">

{doc.experience} Years Experience

</span>


<button

className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm transition"

>

<CalendarPlus size={16}/>

Book Appointment

</button>

</div>


</motion.div>

))}


</div>

</div>

<Footer/>

</>

)

}