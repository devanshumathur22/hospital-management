"use client"

import { useEffect, useState } from "react"
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import {
  CalendarDays,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import "react-big-calendar/lib/css/react-big-calendar.css"

const locales = { "en-US": enUS }

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
  const [date,setDate] = useState(new Date())
  const [view,setView] = useState(Views.DAY)
  const [selected,setSelected] = useState<any>(null)

  /* 🔥 FETCH */
  useEffect(()=>{
    fetch("/api/appointments",{ credentials:"include" })
    .then(res=>res.json())
    .then(data=>{

      const mapped = (data || []).map((a:any)=>{

        const d = new Date(a.date)
        const [h,m] = a.time.split(":").map(Number)

        const start = new Date(d)
        start.setHours(h, m)

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
    .finally(()=>setLoading(false))

  },[])

  /* 🔥 NAVIGATION */
  const goNext = ()=>{
    const newDate = new Date(date)
    view === "day"
      ? newDate.setDate(newDate.getDate()+1)
      : newDate.setDate(newDate.getDate()+7)

    setDate(newDate)
  }

  const goPrev = ()=>{
    const newDate = new Date(date)
    view === "day"
      ? newDate.setDate(newDate.getDate()-1)
      : newDate.setDate(newDate.getDate()-7)

    setDate(newDate)
  }

  const goToday = ()=> setDate(new Date())

  /* 🔥 EVENT UI */
  const EventCard = ({event}:any)=>{

    const status = event.resource.status

    return(
      <div className="flex flex-col text-[10px] sm:text-xs px-1 py-0.5 truncate">

        <div className="flex items-center gap-1">
          <User size={10}/>
          <span className="truncate">{event.title}</span>
        </div>

        <span className="text-[9px] opacity-80">
          {status}
        </span>

      </div>
    )
  }

  /* 🔥 COLOR */
  const eventStyle = (event:any)=>{

    let bg = "#3b82f6" // pending

    if(event.resource.status === "completed") bg = "#22c55e"
    if(event.resource.status === "cancelled") bg = "#ef4444"
    if(event.resource.status === "no-show") bg = "#6b7280"

    return{
      style:{
        backgroundColor:bg,
        borderRadius:"8px",
        border:"none",
        color:"white",
        padding:"2px"
      }
    }
  }

  if(loading){
    return <div className="p-6">Loading calendar...</div>
  }

  return(

    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
          <CalendarDays size={20}/>
          Appointment Calendar
        </h1>

        {/* CONTROLS */}
        <div className="flex items-center gap-2">

          <button onClick={goPrev} className="p-2 bg-gray-200 rounded">
            <ChevronLeft size={16}/>
          </button>

          <button onClick={goToday} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
            Today
          </button>

          <button onClick={goNext} className="p-2 bg-gray-200 rounded">
            <ChevronRight size={16}/>
          </button>

          <select
            value={view}
            onChange={(e)=>setView(e.target.value as any)}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
          </select>

        </div>

      </div>

      {/* EMPTY */}
      {events.length === 0 && (
        <p className="text-gray-500 text-sm">No appointments</p>
      )}

      {/* CALENDAR */}
      <div className="bg-white rounded-2xl shadow p-4">

        <div className="h-[500px] md:h-[650px]">

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"

            view={view}
            date={date}
            onNavigate={setDate}
            onView={setView}

            components={{ event:EventCard }}
            eventPropGetter={eventStyle}

            onSelectEvent={(e)=>setSelected(e.resource)}

            step={15}
            timeslots={1}
            style={{height:"100%"}}
          />

        </div>

      </div>

      {/* 🔥 MODAL */}
      {selected && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">

            <h2 className="text-lg font-bold">
              {selected.patient?.name}
            </h2>

            <p className="text-sm">
              {selected.patient?.gender} • {selected.patient?.phone}
            </p>

            <p className="text-sm">
              Date: {new Date(selected.date).toDateString()}
            </p>

            <p className="text-sm">
              Time: {selected.time}
            </p>

            <p className="text-sm capitalize">
              Status: {selected.status}
            </p>

            <button
              onClick={()=>setSelected(null)}
              className="w-full bg-gray-700 text-white py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  )
}