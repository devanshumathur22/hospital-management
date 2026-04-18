"use client"

import { useEffect, useState } from "react"
import {
  User,
  Stethoscope,
  Clock,
  Activity,
  CheckCircle,
  AlertTriangle,
  Search,
  Calendar
} from "lucide-react"
import { motion } from "framer-motion"

export default function NurseAppointments(){

  const [appointments,setAppointments] = useState<any[]>([])
  const [filtered,setFiltered] = useState<any[]>([])
  const [loading,setLoading] = useState(true)
  const [search,setSearch] = useState("")

  /* LOAD */
  const loadAppointments = async () => {
    try{
      const res = await fetch("/api/appointments",{ credentials:"include" })
      const data = await res.json()

      const now = new Date()

      const today = data.filter((a:any)=>{
        const d = new Date(a.date)
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        )
      })

      setAppointments(today)
      setFiltered(today)

    }catch(err){
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(()=>{
    loadAppointments()
    const i = setInterval(loadAppointments,5000)
    return ()=>clearInterval(i)
  },[])

  /* 🔥 SMART SEARCH */
  useEffect(()=>{

    const s = search.toLowerCase()

    const f = appointments.filter((a:any)=>{

      const patient = a.patient?.name?.toLowerCase() || ""
      const doctor = a.doctor?.name?.toLowerCase() || ""

      const d = new Date(a.date)

      const date = d.toLocaleDateString().toLowerCase()
      const time = (a.time || "").toLowerCase()
      const day = d.toLocaleDateString(undefined,{ weekday:"long" }).toLowerCase()

      return (
        patient.includes(s) ||
        doctor.includes(s) ||
        date.includes(s) ||
        time.includes(s) ||
        day.includes(s)
      )

    })

    setFiltered(f)

  },[search,appointments])

  /* ACTION */
  const markReady = async(id:string)=>{
    await fetch(`/api/appointments/${id}`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ status:"ready" })
      ,credentials:"include"
    })
    loadAppointments()
  }

  /* CRITICAL */
  const isCritical = (a:any)=>{
    const v = a.vitals
    if(!v) return false
    return v.bp > 140 || v.temperature > 100 || v.oxygen < 92
  }

  /* FORMAT */
  const formatDate = (d:string)=>{
    const date = new Date(d)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
      day: date.toLocaleDateString(undefined,{ weekday:"short" })
    }
  }

  if(loading){
    return <div className="p-10 text-center">Loading...</div>
  }

  return(

    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">
        Today's Appointments
      </h1>

      {/* SEARCH */}
      <div className="relative w-full sm:w-96">

        <Search className="absolute left-3 top-3 text-gray-400" size={16}/>

        <input
          placeholder="Search patient, doctor, date, time..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="pl-9 pr-3 py-2 border rounded-lg w-full"
        />

      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <p className="text-gray-500 text-sm">
          No appointments found
        </p>
      )}

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {filtered.map((a:any)=>{

          const { date, time, day } = formatDate(a.date)

          return(

            <motion.div
              key={a.id}
              initial={{opacity:0,y:20}}
              animate={{opacity:1,y:0}}
              whileHover={{y:-4}}
              className={`bg-white rounded-2xl shadow p-5 space-y-3
              ${isCritical(a) ? "border-red-500 border" : ""}
              `}
            >

              {/* ALERT */}
              {isCritical(a) && (
                <div className="text-red-600 text-xs flex gap-2">
                  <AlertTriangle size={14}/> Critical
                </div>
              )}

              {/* TOP */}
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={16}/>
                </div>

                <div>
                  <p className="font-semibold">{a.patient?.name}</p>
                  <p className="text-xs text-gray-500">
                    Dr. {a.doctor?.name}
                  </p>
                </div>

              </div>

              {/* DATE */}
              <div className="flex justify-between text-xs text-gray-500">

                <div className="flex items-center gap-1">
                  <Calendar size={14}/> {date} ({day})
                </div>

                <div className="flex items-center gap-1">
                  <Clock size={14}/> {a.time}
                </div>

              </div>

              {/* STATUS */}
              <span className={`text-xs px-2 py-1 rounded ${
                a.status === "ready"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-600"
              }`}>
                {a.status}
              </span>

              {/* ACTIONS */}
              <div className="space-y-2">

                <a
                  href={`/nurse/vitals?patient=${a.patientId}&appointment=${a.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded text-sm"
                >
                  <Activity size={14}/>
                  Add Vitals
                </a>

                {a.status === "pending" && (
                  <button
                    onClick={()=>markReady(a.id)}
                    className="w-full border border-green-600 text-green-600 py-2 rounded text-sm"
                  >
                    <CheckCircle size={14}/> Mark Ready
                  </button>
                )}

              </div>

            </motion.div>

          )

        })}

      </div>

    </div>

  )
}