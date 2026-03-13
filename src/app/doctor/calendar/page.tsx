"use client"

import { useEffect,useState } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { CalendarDays, User } from "lucide-react"
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

end: new Date(`${a.date}T${a.time}`),

resource:a

}))

setEvents(mapped)

})

},[])



/* custom event */

const EventCard = ({event}:any)=>{

return(

<div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">

<User size={12}/>

{event.title}

</div>

)

}



return(

<div className="max-w-7xl mx-auto px-4 py-10">

{/* TITLE */}

<h1 className="flex items-center gap-2 text-3xl font-bold mb-8">

<CalendarDays size={26}/>

Appointment Calendar

</h1>



{/* CALENDAR */}

<div className="backdrop-blur-xl bg-white/90 border border-gray-200 shadow-xl rounded-2xl p-6">

<div className="h-[650px]">

<Calendar
localizer={localizer}
events={events}
startAccessor="start"
endAccessor="end"
components={{
event:EventCard
}}
style={{height:"100%"}}
/>

</div>

</div>

</div>

)

}