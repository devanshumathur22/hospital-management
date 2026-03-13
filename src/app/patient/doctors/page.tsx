"use client"

import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { X, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function PatientDoctors(){

const [doctors,setDoctors] = useState<any[]>([])
const [groupedDoctors,setGroupedDoctors] = useState<any>({})
const [selectedDoctor,setSelectedDoctor] = useState<any>(null)

const [date,setDate] = useState<Date | null>(null)
const [time,setTime] = useState("")

const [filter,setFilter] = useState("all")

function generateSlots(){

const slots:string[] = []

let hour = 9
let minute = 0

while(hour < 17){

const h = hour.toString().padStart(2,"0")
const m = minute.toString().padStart(2,"0")

slots.push(`${h}:${m}`)

minute += 15

if(minute === 60){
minute = 0
hour++
}

}

return slots

}

const timeSlots = generateSlots()



useEffect(()=>{

fetch("/api/doctors")
.then(res=>res.json())
.then(data=>{

setDoctors(data)

const grouped = data.reduce((acc:any,doc:any)=>{

if(!acc[doc.specialization]){
acc[doc.specialization] = []
}

acc[doc.specialization].push(doc)

return acc

},{});

setGroupedDoctors(grouped)

})

},[])



const handleBook = async()=>{

if(!date || !time){
alert("Select date and time")
return
}

await fetch("/api/appointments",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

doctorId:selectedDoctor.id,
date,
time

})

})

alert("Appointment Booked")

setSelectedDoctor(null)

}



const specializations = ["all", ...Object.keys(groupedDoctors)]



return(

<div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

{/* HEADER */}

<h1 className="text-3xl md:text-4xl font-bold mb-10 text-gray-800">
Find Doctors
</h1>



{/* FILTER */}

<div className="flex flex-wrap gap-3 mb-12">

{specializations.map((sp)=>(
<button
key={sp}
onClick={()=>setFilter(sp)}
className={`px-4 py-2 rounded-full border text-sm transition cursor-pointer ${
filter === sp
? "bg-blue-600 text-white border-blue-600"
: "bg-white hover:bg-gray-100"
}`}
>
{sp}
</button>
))}

</div>



{/* DOCTOR GRID */}

{Object.entries(groupedDoctors)
.filter(([category])=>filter==="all" || filter===category)
.map(([category,docs]:any)=>(

<div key={category} className="mb-14">

<h2 className="text-xl font-semibold mb-6 text-gray-700">
🏥 {category}
</h2>


<motion.div
layout
className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
>

{docs.map((doc:any)=>(

<motion.div
layout
initial={{opacity:0,y:30}}
animate={{opacity:1,y:0}}
whileHover={{scale:1.05}}
transition={{duration:0.3}}
key={doc.id}
className="cursor-pointer backdrop-blur-xl bg-white/70 border border-white/40 p-6 rounded-2xl shadow-lg hover:shadow-2xl"
>

<div className="flex items-center gap-3 mb-4">

<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
{doc.name.charAt(0)}
</div>

<div>
<h3 className="font-semibold text-gray-800">
{doc.name}
</h3>
<p className="text-xs text-gray-500">
{doc.experience} yrs experience
</p>
</div>

</div>

<button
onClick={()=>setSelectedDoctor(doc)}
className="mt-3 w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition cursor-pointer"
>
Book Appointment
</button>

</motion.div>

))}

</motion.div>

</div>

))}



{/* MODAL */}

<AnimatePresence>

{selectedDoctor && (

<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
exit={{opacity:0}}
className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
>

<motion.div
initial={{scale:0.8,opacity:0}}
animate={{scale:1,opacity:1}}
exit={{scale:0.8,opacity:0}}
transition={{duration:0.25}}
className="bg-white/80 backdrop-blur-xl border border-white/30 p-8 rounded-3xl shadow-2xl w-full max-w-md relative"
>

<button
onClick={()=>setSelectedDoctor(null)}
className="absolute right-4 top-4 text-gray-500 hover:text-black cursor-pointer"
>
<X/>
</button>


<h2 className="text-2xl font-bold mb-4">
Book Appointment
</h2>

<p className="mb-6 text-gray-600">
Doctor: <b>{selectedDoctor.name}</b>
</p>



<DatePicker
selected={date}
onChange={(d)=>setDate(d)}
placeholderText="Select Date"
className="w-full border border-gray-200 p-3 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>



<div className="flex flex-wrap gap-3 mb-6">

{timeSlots.map(slot=>(

<button
key={slot}
onClick={()=>setTime(slot)}
className={`px-3 py-2 rounded-lg border transition cursor-pointer ${
time === slot
? "bg-blue-600 text-white border-blue-600"
: "bg-white hover:bg-gray-100"
}`}
>

{slot}

</button>

))}

</div>



<button
onClick={handleBook}
className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
>

Confirm Appointment

</button>

</motion.div>

</motion.div>

)}

</AnimatePresence>

</div>

)

}