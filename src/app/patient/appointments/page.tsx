"use client"

import { useEffect,useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function PatientAppointments(){

const [appointments,setAppointments] = useState<any[]>([])
const [selected,setSelected] = useState<any>(null)

const [date,setDate] = useState<Date | null>(null)
const [time,setTime] = useState("")

/* slots */

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


/* fetch appointments */

useEffect(()=>{

fetch("/api/appointments")

.then(res=>res.json())

.then(data=>{

/* ACTIVE ONLY */

const active = data.filter(
(a:any)=>a.status !== "completed" && a.status !== "cancelled"
)

setAppointments(active)

})

},[])


/* cancel */

const cancelAppointment = async(id:string)=>{

await fetch(`/api/appointments/cancel/${id}`,{
method:"DELETE"
})

setAppointments(prev => prev.filter(a=>a.id!==id))

}


/* reschedule */

const reschedule = async()=>{

await fetch(`/api/appointments/reschedule/${selected.id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
date,
time
})

})

alert("Appointment Updated")

setSelected(null)

location.reload()

}


return(

<div className="max-w-6xl mx-auto px-8 py-10">

<h1 className="text-3xl font-bold mb-8">
My Appointments
</h1>


{/* LIST */}

<div className="grid md:grid-cols-2 gap-6">

{appointments.length === 0 && (

<p className="text-gray-500">
No active appointments
</p>

)}

{appointments.map((a:any)=>(

<div
key={a.id}
className="bg-white p-6 rounded-xl shadow"
>

<h2 className="text-xl font-bold">
👨‍⚕️ {a.doctor?.name}
</h2>

<p className="text-gray-600">
Date: {new Date(a.date).toDateString()}
</p>

<p className="text-gray-600">
Time: {a.time}
</p>

<div className="flex gap-3 mt-4">

<button
onClick={()=>setSelected(a)}
className="bg-blue-600 text-white px-3 py-2 rounded"
>
Reschedule
</button>

<button
onClick={()=>cancelAppointment(a.id)}
className="bg-red-500 text-white px-3 py-2 rounded"
>
Cancel
</button>

</div>

</div>

))}

</div>



{/* RESCHEDULE MODAL */}

{selected && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-8 rounded-xl w-[400px]">

<h2 className="text-xl font-bold mb-4">
Reschedule Appointment
</h2>

<DatePicker
selected={date}
onChange={(d)=>setDate(d)}
className="w-full border p-2 rounded mb-4"
/>

<div className="grid grid-cols-4 gap-2 mb-4">

{timeSlots.map(slot=>(

<button
key={slot}
onClick={()=>setTime(slot)}
className={`p-2 border rounded
${time===slot ? "bg-blue-600 text-white" : "bg-white"}
`}
>
{slot}
</button>

))}

</div>

<button
onClick={reschedule}
className="w-full bg-blue-600 text-white py-2 rounded"
>
Update Appointment
</button>

</div>

</div>

)}

</div>

)

}