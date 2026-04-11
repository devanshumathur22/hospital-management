"use client"

import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function PatientDoctors(){

const [doctors,setDoctors] = useState<any[]>([])
const [groupedDoctors,setGroupedDoctors] = useState<any>({})
const [selectedDoctor,setSelectedDoctor] = useState<any>(null)

const [date,setDate] = useState<Date | null>(null)
const [time,setTime] = useState("")

const [appointments,setAppointments] = useState<any[]>([])
const [loading,setLoading] = useState(false)

const [filter,setFilter] = useState("all")

/* ============================= */
/* GENERATE SLOTS */
/* ============================= */

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

/* ============================= */
/* FETCH DATA */
/* ============================= */

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
    },{})

    setGroupedDoctors(grouped)

  })

  fetch("/api/appointments",{ credentials:"include" })
  .then(res=>res.json())
  .then(setAppointments)

},[])

/* ============================= */
/* HELPERS */
/* ============================= */

// 🔥 slot booked check
const isSlotBooked = (slot:string) => {
  if(!date || !selectedDoctor) return false

  return appointments.some((a:any)=>
    new Date(a.date).toDateString() === date.toDateString() &&
    a.time === slot &&
    a.doctorId === selectedDoctor.id
  )
}

// 🔥 FIXED same day (doctor-wise)
const hasTodayAppointment = () => {
  if (!selectedDoctor) return false

  return appointments.some((a:any)=>
    new Date(a.date).toDateString() === new Date().toDateString() &&
    a.doctorId === selectedDoctor.id
  )
}

/* ============================= */
/* BOOK */
/* ============================= */

const handleBook = async()=>{

  if(!date || !time){
    alert("Select date and time")
    return
  }

  // ✅ FIXED
  if(hasTodayAppointment()){
    alert("You already have an appointment with this doctor today")
    return
  }

  setLoading(true)

  const res = await fetch("/api/appointments",{
    method:"POST",
    credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      doctorId:selectedDoctor.id,
      date,
      time
    })
  })

  const data = await res.json()

  setLoading(false)

  if(res.ok){
    alert("Appointment Booked ✅")
    setSelectedDoctor(null)
  }else{
    alert(data.error || "Booking failed")
  }

}

/* ============================= */
/* UI */
/* ============================= */

const specializations = ["all", ...Object.keys(groupedDoctors)]

return(

<div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

<h1 className="text-3xl md:text-4xl font-bold mb-10">
Find Doctors
</h1>

{/* WARNING */}
{hasTodayAppointment() && selectedDoctor && (
  <p className="text-red-500 mb-6">
    You already have an appointment with this doctor today
  </p>
)}

{/* FILTER */}
<div className="flex flex-wrap gap-3 mb-12">

{specializations.map((sp)=>(
<button
key={sp}
onClick={()=>setFilter(sp)}
className={`px-4 py-2 rounded-full border text-sm ${
filter === sp
? "bg-blue-600 text-white"
: "bg-white"
}`}
>
{sp}
</button>
))}

</div>

{/* DOCTORS */}

{Object.entries(groupedDoctors)
.filter(([category])=>filter==="all" || filter===category)
.map(([category,docs]:any)=>(

<div key={category} className="mb-14">

<h2 className="text-xl font-semibold mb-6">
🏥 {category}
</h2>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

{docs.map((doc:any)=>(

<div key={doc.id} className="p-6 rounded-2xl shadow-lg bg-white">

<h3 className="font-bold">{doc.name}</h3>
<p className="text-sm text-gray-500">{doc.experience} yrs</p>

<button
onClick={()=>setSelectedDoctor(doc)}
className="mt-3 w-full bg-blue-600 text-white py-2 rounded-xl"
>
Book
</button>

</div>

))}

</div>

</div>

))}

{/* MODAL */}

<AnimatePresence>

{selectedDoctor && (

<motion.div
className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
>

<motion.div className="bg-white p-6 rounded-2xl w-[350px]">

<button onClick={()=>setSelectedDoctor(null)}>
<X/>
</button>

<h2 className="text-xl font-bold mb-4">
Book Appointment
</h2>

<DatePicker
selected={date}
onChange={(d)=>setDate(d)}
className="w-full border p-3 rounded mb-4"
/>

<div className="flex flex-wrap gap-2 mb-4">

{timeSlots.map(slot=>{

  const booked = isSlotBooked(slot)

  return (
    <button
      key={slot}
      disabled={booked}
      onClick={()=>setTime(slot)}
      className={`px-3 py-2 rounded border ${
        booked
        ? "bg-gray-300 cursor-not-allowed"
        : time === slot
        ? "bg-blue-600 text-white"
        : "bg-white"
      }`}
    >
      {booked ? "❌" : slot}
    </button>
  )

})}

</div>

<button
onClick={handleBook}
disabled={loading}
className="w-full bg-blue-600 text-white py-3 rounded"
>
{loading ? "Booking..." : "Confirm"}
</button>

</motion.div>

</motion.div>

)}

</AnimatePresence>

</div>

)
}