"use client"

import { useEffect, useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

export default function PatientAdvancedAppointments(){

const [appointments,setAppointments] = useState<any[]>([])
const [rating,setRating] = useState(0)

useEffect(()=>{

fetch("/api/appointments")
.then(res=>res.json())
.then(data=>{
setAppointments(data)
})

Notification.requestPermission()

},[])



/* calendar events */

const events = appointments.map((a:any)=>({

title:`Dr. ${a.doctor?.name}`,

start:new Date(a.date),

end:new Date(a.date)

}))



/* reminder */

function sendReminder(){

if(Notification.permission === "granted"){

new Notification("Appointment Reminder",{
body:"Your doctor appointment is coming soon"
})

}

}



/* whatsapp */

function sendWhatsapp(a:any){

const phone = "919999999999"

const message = encodeURIComponent(
`Appointment confirmed with Dr. ${a.doctor?.name} on ${new Date(a.date).toDateString()} at ${a.time}`
)

window.open(`https://wa.me/${phone}?text=${message}`)

}



return(

<div className="max-w-7xl mx-auto px-6 py-10">

<h1 className="text-3xl font-bold mb-10">
Appointments Dashboard
</h1>



{/* CALENDAR */}

<div className="bg-white rounded-xl shadow p-6 mb-10">

<h2 className="text-xl font-semibold mb-4">
Appointment Calendar
</h2>

<div className="h-[500px]">

<Calendar
localizer={localizer}
events={events}
startAccessor="start"
endAccessor="end"
/>

</div>

</div>



{/* APPOINTMENT LIST */}

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{appointments.map((a:any)=>(

<div
key={a.id}
className="bg-white rounded-xl shadow p-6"
>

<h2 className="text-lg font-bold">
👨‍⚕️ Dr. {a.doctor?.name}
</h2>

<p className="text-gray-600 text-sm mt-1">
📅 {new Date(a.date).toDateString()}
</p>

<p className="text-gray-600 text-sm">
⏰ {a.time}
</p>



{/* RATING */}

<div className="flex gap-1 mt-3">

{[1,2,3,4,5].map((r)=>(
<button
key={r}
onClick={()=>setRating(r)}
className={`text-xl ${
r <= rating ? "text-yellow-400" : "text-gray-300"
}`}
>
★
</button>
))}

</div>



{/* ACTION BUTTONS */}

<div className="flex gap-3 mt-4">

<button
onClick={sendReminder}
className="bg-blue-600 text-white px-3 py-2 rounded-lg"
>
Reminder
</button>

<button
onClick={()=>sendWhatsapp(a)}
className="bg-green-500 text-white px-3 py-2 rounded-lg"
>
WhatsApp
</button>

</div>

</div>

))}

</div>



{/* CLINIC MAP */}

<div className="bg-white rounded-xl shadow p-6 mt-12">

<h2 className="text-xl font-semibold mb-4">
Clinic Location
</h2>

<iframe
className="w-full h-[350px] rounded-xl"
src="https://www.google.com/maps?q=Jaipur+Hospital&output=embed"
/>

</div>

</div>

)

}