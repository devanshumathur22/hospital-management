"use client"

import { useEffect, useState } from "react"
import {
  User,
  Stethoscope,
  Clock,
  Activity,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { motion } from "framer-motion"

export default function NurseAppointments(){

  const [appointments,setAppointments] = useState<any[]>([])
  const [loading,setLoading] = useState(true)
  const [filter,setFilter] = useState("all")

  /* ================= LOAD ================= */

  const loadAppointments = async () => {
    try{
      const res = await fetch("/api/appointments",{
        credentials:"include"
      })

      const data = await res.json()

      const now = new Date()

      const filtered = data.filter((a:any)=>{
        const d = new Date(a.date)
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        )
      })

      setAppointments(filtered)

    }catch(err){
      console.log(err)
    }

    setLoading(false)
  }

  /* ================= AUTO REFRESH ================= */

  useEffect(()=>{
    loadAppointments()

    const interval = setInterval(()=>{
      loadAppointments()
    },5000)

    return ()=> clearInterval(interval)
  },[])

  /* ================= ACTION ================= */

  const markReady = async(id:string)=>{
    await fetch(`/api/appointments/${id}`,{
      method:"PATCH",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ status:"ready" })
    })

    loadAppointments()
  }

  /* ================= ALERT ================= */

  const isCritical = (a:any)=>{
    const v = a.vitals
    if(!v) return false

    return (
      v.bp > 140 ||
      v.temperature > 100 ||
      v.oxygen < 92
    )
  }

  /* ================= FILTER ================= */

  const filteredData = appointments.filter(a=>{
    if(filter === "pending") return a.status === "pending"
    if(filter === "ready") return a.status === "ready"
    return true
  })

  if(loading){
    return <div className="p-10 text-center">Loading...</div>
  }

  return(

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

        <h1 className="text-xl sm:text-2xl font-semibold">
          Today's Appointments
        </h1>

        <div className="flex gap-2 flex-wrap">

          <FilterBtn label="All" value="all" filter={filter} setFilter={setFilter}/>
          <FilterBtn label="Pending" value="pending" filter={filter} setFilter={setFilter}/>
          <FilterBtn label="Ready" value="ready" filter={filter} setFilter={setFilter}/>

        </div>

      </div>

      {/* COUNT */}
      <p className="text-sm text-gray-500 mb-4">
        {filteredData.length} appointments
      </p>

      {/* EMPTY */}
      {filteredData.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          🏥 No appointments
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

        {filteredData.map((a:any)=>(

          <motion.div
            key={a.id}
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            whileHover={{y:-4}}
            className={`bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between
            ${isCritical(a) ? "border-red-500" : ""}
            `}
          >

            {/* ALERT */}
            {isCritical(a) && (
              <div className="flex items-center gap-2 text-red-600 text-xs mb-2">
                <AlertTriangle size={14}/>
                Critical
              </div>
            )}

            {/* PATIENT */}
            <div className="flex items-center gap-3 mb-3">

              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={16}/>
              </div>

              <div className="truncate">
                <p className="font-medium text-sm">
                  {a.patient?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {a.patient?.phone}
                </p>
              </div>

            </div>

            {/* INFO */}
            <div className="space-y-1 text-xs text-gray-600">

              <div className="flex items-center gap-2">
                <Stethoscope size={14}/>
                {a.doctor?.name}
              </div>

              <div className="flex items-center gap-2">
                <Clock size={14}/>
                {a.time}
              </div>

            </div>

            {/* STATUS */}
            <div className="mt-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                a.status === "ready"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-600"
              }`}>
                {a.status}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="mt-4 space-y-2">

              <a
                href={`/nurse/vitals?patient=${a.patientId}&appointment=${a.id}`}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
              >
                <Activity size={14}/>
                Add Vitals
              </a>

              {a.status !== "ready" && (
                <button
                  onClick={()=>markReady(a.id)}
                  className="w-full flex items-center justify-center gap-2 border border-green-600 text-green-600 hover:bg-green-50 py-2 rounded-lg text-sm"
                >
                  <CheckCircle size={14}/>
                  Mark Ready
                </button>
              )}

            </div>

          </motion.div>

        ))}

      </div>

    </div>

  )
}

/* FILTER BTN */
function FilterBtn({label,value,filter,setFilter}:any){
  return(
    <button
      onClick={()=>setFilter(value)}
      className={`px-3 py-1 rounded-lg text-sm border
      ${filter === value
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  )
}