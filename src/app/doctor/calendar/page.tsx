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
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    fetch("/api/appointments")
    .then(res=>res.json())
    .then(data=>{

      const mapped = (data || []).map((a:any)=>({

        title: a.patient?.name || "Patient",

        start: new Date(`${a.date}T${a.time}`),

        end: new Date(`${a.date}T${a.time}`),

        resource:a

      }))

      setEvents(mapped)
    })
    .catch(()=>setEvents([]))
    .finally(()=>setLoading(false))

  },[])


  /* 🔥 custom event */
  const EventCard = ({event}:any)=>{

    return(
      <div className="flex items-center gap-1 text-[10px] sm:text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded truncate">
        <User size={10}/>
        <span className="truncate">{event.title}</span>
      </div>
    )
  }

  // 🔥 Loading
  if(loading){
    return <div className="p-6 text-sm">Loading calendar...</div>
  }

  return(

    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">

      {/* 🔥 TITLE */}
      <h1 className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold">

        <CalendarDays size={20} className="sm:w-6 sm:h-6"/>

        Appointment Calendar

      </h1>


      {/* ❌ Empty */}
      {events.length === 0 && (
        <p className="text-gray-500 text-sm">
          No appointments available
        </p>
      )}


      {/* 📅 CALENDAR */}
      <div className="bg-white border shadow rounded-2xl p-3 sm:p-4 md:p-6">

        {/* 🔥 Responsive height */}
        <div className="h-[400px] sm:h-[500px] md:h-[650px]">

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            components={{ event:EventCard }}
            style={{height:"100%"}}
          />

        </div>

      </div>

    </div>

  )

}