"use client"

import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function PatientAdvancedAppointments(){

const [appointments,setAppointments] = useState<any[]>([])
const [selected,setSelected] = useState<any>(null)
const [newDate,setNewDate] = useState<Date | null>(null)
const [newTime,setNewTime] = useState("")

/* ============================= */
/* GENERATE 15 MIN SLOTS */
/* ============================= */

function generateTimeSlots(){
  const slots = []
  let start = 9 * 60
  let end = 17 * 60

  for(let i = start; i < end; i += 15){

    if(i >= 13*60 && i < 14*60) continue

    let hours = Math.floor(i / 60)
    let minutes = i % 60

    let ampm = hours >= 12 ? "PM" : "AM"

    if(hours > 12) hours -= 12
    if(hours === 0) hours = 12

    const time = `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")} ${ampm}`

    slots.push(time)
  }

  return slots
}

const timeSlots = generateTimeSlots()

/* ============================= */
/* FETCH FUNCTION */
/* ============================= */

const fetchAppointments = async()=>{
  const res = await fetch("/api/appointments",{ credentials:"include" })
  const data = await res.json()

  if(Array.isArray(data)){
    setAppointments(data)
  }
}

/* ============================= */
/* INITIAL LOAD */
/* ============================= */

useEffect(()=>{
  fetchAppointments()
},[])

/* ============================= */
/* ❌ DELETE FROM DB */
/* ============================= */

const cancelAppointment = async(id:string)=>{

  const res = await fetch("/api/appointments",{
    method:"DELETE",
    credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ id })
  })

  const data = await res.json()

  if(data.success){
    await fetchAppointments() // 🔥 IMPORTANT
  }else{
    alert("Delete failed")
  }
}

/* ============================= */
/* OPEN RESCHEDULE */
/* ============================= */

const openReschedule = (a:any)=>{
  setSelected(a)
  setNewDate(new Date(a.date))
  setNewTime(a.time)
}

/* ============================= */
/* SAVE RESCHEDULE */
/* ============================= */

const saveReschedule = async()=>{

  if(!selected) return

  await fetch(`/api/appointments/${selected.id}`,{
    method:"PUT",
    credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      date:newDate,
      time:newTime
    })
  })

  setSelected(null)
  await fetchAppointments() // 🔥 no reload needed
}

/* ============================= */
/* UI */
/* ============================= */

return(

<div className="max-w-7xl mx-auto px-6 py-10">

<h1 className="text-3xl font-bold mb-10">
Appointments Dashboard
</h1>

{/* GRID */}

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{appointments.length === 0 && (
<p className="text-gray-500">No appointments found</p>
)}

{appointments.map((a:any)=>(

<div
key={a.id}
className="backdrop-blur-xl bg-white/60 border border-white/40 p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
>

<h2 className="text-lg font-bold text-gray-800">
👨‍⚕️ Dr. {a.doctor?.name}
</h2>

<p className="text-gray-600 text-sm mt-1">
📅 {new Date(a.date).toDateString()}
</p>

<p className="text-gray-600 text-sm">
⏰ {a.time}
</p>

{/* BUTTONS */}

<div className="flex gap-3 mt-5">

<button
onClick={()=>openReschedule(a)}
className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
>
Reschedule
</button>

<button
onClick={()=>cancelAppointment(a.id)}
className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
>
Cancel
</button>

</div>

</div>

))}

</div>

{/* ============================= */
/* MODAL */
/* ============================= */}

{selected && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white p-6 rounded-2xl w-[350px]">

<h2 className="text-xl font-bold mb-4">
Reschedule Appointment
</h2>

{/* DATE */}

<DatePicker
selected={newDate}
onChange={(d)=>setNewDate(d)}
className="w-full border p-3 rounded-lg mb-4"
/>

{/* TIME */}

<select
value={newTime}
onChange={(e)=>setNewTime(e.target.value)}
className="w-full border p-3 rounded-lg mb-4"
>
<option value="">Select Time</option>

{timeSlots.map((slot)=>(
<option key={slot} value={slot}>
⏰ {slot}
</option>
))}

</select>

{/* BUTTONS */}

<div className="flex gap-3">

<button
onClick={saveReschedule}
className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
>
Save
</button>

<button
onClick={()=>setSelected(null)}
className="flex-1 bg-gray-300 py-2 rounded-lg"
>
Cancel
</button>

</div>

</div>

</div>

)}

</div>

)
}