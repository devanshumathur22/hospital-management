"use client"

import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function PatientAdvancedAppointments(){

const [appointments,setAppointments] = useState<any[]>([])
const [selected,setSelected] = useState<any>(null)
const [newDate,setNewDate] = useState<Date | null>(null)
const [newTime,setNewTime] = useState("")
const [availability,setAvailability] = useState<any>(null)
const [loading,setLoading] = useState(true)

/* 🔥 GENERATE SLOTS */
function generateTimeSlots(start:string,end:string){
  if(!start || !end) return []

  const slots:any[] = []

  const [sh,sm] = start.split(":").map(Number)
  const [eh,em] = end.split(":").map(Number)

  let startMin = sh * 60 + sm
  let endMin = eh * 60 + em

  for(let i = startMin; i < endMin; i += 15){
    const h = Math.floor(i / 60)
    const m = i % 60

    const value = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`

    const label = new Date(`1970-01-01T${value}`).toLocaleTimeString([],{
      hour:"2-digit",
      minute:"2-digit"
    })

    slots.push({ value,label })
  }

  return slots
}

/* 🔥 LOAD */
const loadData = async()=>{
  const res = await fetch("/api/appointments",{ credentials:"include" })
  const data = await res.json()

  setAppointments(Array.isArray(data) ? data : [])
}

/* 🔥 INIT */
useEffect(()=>{
  const load = async()=>{
    await loadData()
    setLoading(false)
  }
  load()
},[])

/* 🔥 RESCHEDULE */
const openReschedule = async(a:any)=>{
  setSelected(a)
  setNewDate(new Date(a.date))
  setNewTime(a.time)

  const res = await fetch(`/api/doctors/availability?doctorId=${a.doctorId}`)
  const data = await res.json()
  setAvailability(data)
}

const timeSlots = availability
  ? generateTimeSlots(availability.start, availability.end)
  : []

const isSlotBooked = (date: Date, time: string) => {
  return appointments.some((a) =>
    new Date(a.date).toDateString() === date.toDateString() &&
    a.time === time &&
    a.id !== selected?.id
  )
}

const isDoctorAvailable = (date:Date)=>{
  if(!availability?.days) return true
  const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][date.getDay()]
  return availability.days.includes(day)
}

/* 🔥 SAVE */
const saveReschedule = async()=>{
  if(!selected || !newDate || !newTime){
    alert("Select date & time")
    return
  }

  const res = await fetch(`/api/appointments/${selected.id}`,{
    method:"PUT",
    credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      date:newDate,
      time:newTime
    })
  })

  if(res.ok){
    alert("Rescheduled ✅")
    setSelected(null)
    loadData()
  }else{
    const err = await res.json()
    alert(err.error || "Failed")
  }
}

/* 🔥 CANCEL */
const cancelAppointment = async(id:string)=>{
  await fetch(`/api/appointments/${id}`,{
    method:"DELETE",
    credentials:"include"
  })
  loadData()
}

/* 🔥 LOADING */
if(loading){
  return <div className="p-6 text-sm">Loading appointments...</div>
}

/* 🔥 UI */
return(

<div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

<h1 className="text-2xl font-bold">Appointments</h1>

<div className="grid md:grid-cols-3 gap-4">

{appointments.map((a:any)=>(

<div
key={a.id}
className={`p-4 rounded-xl shadow space-y-2

${a.status === "cancelled"
  ? "bg-red-50 border border-red-300"
  : "bg-white"
}
`}
>

<h2 className="font-semibold">Dr. {a.doctor?.name}</h2>

<p className="text-sm">{new Date(a.date).toDateString()}</p>
<p className="text-sm">{a.time}</p>

{/* 🔥 STATUS */}
<p className={`text-xs font-semibold
  ${a.status === "cancelled"
    ? "text-red-500"
    : a.status === "completed"
      ? "text-green-600"
      : "text-yellow-600"
  }
`}>
{a.status === "cancelled"
  ? "❌ Cancelled by Doctor"
  : a.status}
</p>

{/* 🔥 ACTIONS */}
{a.status !== "cancelled" && (

<div className="flex gap-2">

<button
onClick={()=>openReschedule(a)}
className="flex-1 bg-blue-600 text-white py-2 rounded text-sm"
>
Reschedule
</button>

<button
onClick={()=>cancelAppointment(a.id)}
className="flex-1 bg-red-500 text-white py-2 rounded text-sm"
>
Cancel
</button>

</div>

)}

</div>

))}

</div>

{/* MODAL SAME AS BEFORE */}
{selected && (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center">
<div className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4">

<h2 className="font-bold">Reschedule</h2>

<DatePicker
selected={newDate}
onChange={(d)=>setNewDate(d)}
filterDate={(d)=>isDoctorAvailable(d)}
className="w-full border p-2 rounded"
/>

<select
value={newTime}
onChange={(e)=>setNewTime(e.target.value)}
className="w-full border p-2 rounded"
>
<option value="">Select Time</option>

{timeSlots.map((slot:any)=>{
const booked = newDate ? isSlotBooked(newDate, slot.value) : false

return(
<option key={slot.value} value={slot.value} disabled={booked}>
{booked ? "❌ Booked" : slot.label}
</option>
)
})}

</select>

<button onClick={saveReschedule} className="w-full bg-blue-600 text-white py-2 rounded">
Save
</button>

<button onClick={()=>setSelected(null)} className="w-full bg-gray-300 py-2 rounded">
Cancel
</button>

</div>
</div>
)}

</div>
)
}