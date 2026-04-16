"use client"

import { useEffect, useState } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import { CalendarDays, User } from "lucide-react"
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

export default function DoctorCalendar(){

  const [events,setEvents] = useState<any[]>([])
  const [loading,setLoading] = useState(true)

  /* 🔥 FETCH APPOINTMENTS */
  useEffect(()=>{

    fetch("/api/appointments",{
      credentials:"include"
    })
    .then(res=>res.json())
    .then(data=>{

      const mapped = (data || []).map((a:any)=>{

        const date = new Date(a.date)

        const [h,m] = a.time.split(":").map(Number)

        const start = new Date(date)
        start.setHours(h, m, 0)

        const end = new Date(start)
        end.setMinutes(end.getMinutes() + 15)

        return{
          title: a.patient?.name || "Patient",
          start,
          end,
          resource:a
        }
      })

      setEvents(mapped)

    })
    .catch(()=>{
      setEvents([])
    })
    .finally(()=>{
      setLoading(false)
    })

  },[])


  /* 🔥 CUSTOM EVENT UI */
  const EventCard = ({event}:any)=>{

    return(
      <div className="flex items-center gap-1 text-[10px] sm:text-xs px-1.5 py-0.5 rounded truncate">
        <User size={10}/>
        <span className="truncate">{event.title}</span>
      </div>
    )
  }


  /* 🔥 COLOR BASED ON STATUS */
  const eventStyle = (event:any)=>{

    let bg = "#60a5fa" // pending blue

    if(event.resource.status === "completed"){
      bg = "#22c55e"
    }

    if(event.resource.status === "cancelled"){
      bg = "#ef4444"
    }

    return{
      style:{
        backgroundColor:bg,
        borderRadius:"6px",
        border:"none",
        color:"white"
      }
    }
  }


  /* 🔥 LOADING */
  if(loading){
    return <div className="p-6 text-sm">Loading calendar...</div>
  }


  /* 🔥 UI */
  return(

    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">

      {/* TITLE */}
      <h1 className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold">
        <CalendarDays size={20}/>
        Appointment Calendar
      </h1>


      {/* EMPTY */}
      {events.length === 0 && (
        <p className="text-gray-500 text-sm">
          No appointments available
        </p>
      )}


      {/* CALENDAR */}
      <div className="bg-white border shadow rounded-2xl p-3 sm:p-4 md:p-6">

        <div className="h-[400px] sm:h-[500px] md:h-[650px]">

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            components={{ event:EventCard }}
            eventPropGetter={eventStyle}

            /* 🔥 IMPORTANT CONFIG */
            defaultView="day"
            views={["day","week"]}
            step={15}
            timeslots={1}

            style={{height:"100%"}}
          />

        </div>

      </div>

    </div>

  )
}