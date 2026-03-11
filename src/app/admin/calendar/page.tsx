"use client"

import { useEffect, useState } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"

const locales = {
  "en-US": enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

export default function AdminCalendar(){

const [events,setEvents] = useState<any[]>([])

useEffect(()=>{

fetch("/api/appointments")
.then(res=>res.json())
.then(data=>{

const mapped = data.map((a:any)=>{

const start = new Date(`${a.date}T${a.time || "09:00"}`)
const end = new Date(start.getTime() + 30 * 60000)

return{
title: `${a.patient?.name || "Patient"} - ${a.doctor?.name || "Doctor"}`,
start,
end
}

})

setEvents(mapped)

})

},[])



return(

<div className="p-8 space-y-6">

<h1 className="text-3xl font-bold">
Appointments Calendar
</h1>

<div className="bg-white rounded-xl shadow p-6 h-[650px]">

<Calendar
localizer={localizer}
events={events}
startAccessor="start"
endAccessor="end"
style={{ height:"100%" }}
/>

</div>

</div>

)

}