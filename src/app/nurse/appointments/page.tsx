"use client"

import { useEffect, useState } from "react"
import {
  User,
  Stethoscope,
  Clock,
  Activity
} from "lucide-react"
import { motion } from "framer-motion"

export default function NurseAppointments(){

  const [appointments,setAppointments] = useState<any[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    loadAppointments()
  },[])

  /* ================= LOAD ================= */

  const loadAppointments = async () => {

    try{

      const res = await fetch("/api/appointments",{
        credentials:"include" // 🔥 IMPORTANT
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
      console.log("LOAD ERROR:",err)
    }

    setLoading(false)
  }

  /* ================= UI ================= */

  if(loading){
    return <div className="p-10 text-center">Loading appointments...</div>
  }

  return(

    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">
          Today's Appointments
        </h1>

        <span className="text-sm text-gray-500">
          {appointments.length} total
        </span>
      </div>

      {/* EMPTY */}
      {appointments.length === 0 && (
        <p className="text-gray-500 text-center">
          No appointments for today
        </p>
      )}

      {/* GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {appointments.map((a:any)=>(

          <motion.div
            key={a.id}
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            whileHover={{y:-4}}
            className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
          >

            {/* PATIENT */}
            <div className="flex items-center gap-3 mb-3">

              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={18}/>
              </div>

              <div>
                <p className="font-medium">
                  {a.patient?.name || "Patient"}
                </p>
                <p className="text-xs text-gray-500">
                  {a.patient?.phone || "No phone"}
                </p>
              </div>

            </div>

            {/* DOCTOR */}
            <div className="flex items-center gap-2 text-sm mb-2">
              <Stethoscope size={15}/>
              {a.doctor?.name || "Doctor"}
            </div>

            {/* TIME */}
            <div className="flex items-center gap-2 text-sm mb-3">
              <Clock size={15}/>
              {a.time}
            </div>

            {/* STATUS BADGE */}
            <span className={`text-xs px-2 py-1 rounded-full ${
              a.status === "ready"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-600"
            }`}>
              {a.status}
            </span>

            {/* BUTTON */}
            <a
              href={`/nurse/vitals?patient=${a.patientId}&appointment=${a.id}`}
              className="mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
            >
              <Activity size={16}/>
              Add Vitals
            </a>

          </motion.div>

        ))}

      </div>

    </div>

  )
}