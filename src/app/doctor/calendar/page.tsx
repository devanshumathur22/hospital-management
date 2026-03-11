"use client"

import { useEffect,useState } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import "react-big-calendar/lib/css/react-big-calendar.css"

const locales = {
"en-US": require("date-fns/locale/en-US")
}

const localizer = dateFnsLocalizer({
format,
parse,
startOfWeek,
getDay,
locales
})

export default function DoctorCalendar(){

const [events,setEvents] = useState<any[]>([])

useEffect(()=>{

fetch("/api/appointments")
.then(res=>res.json())
.then(data=>{

const mapped = data.map((a:any)=>({

title: a.patient?.name || "Patient",

start: new Date(`${a.date}T${a.time}`),

end: new Date(`${a.date}T${a.time}`)

}))

setEvents(mapped)

})

},[])



return(

<div className="p-8">

<h1 className="text-3xl font-bold mb-6">
Appointment Calendar
</h1>

<div className="bg-white p-6 rounded-xl shadow h-[600px]">

<Calendar
localizer={localizer}
events={events}
startAccessor="start"
endAccessor="end"
/>

</div>

</div>

)

}