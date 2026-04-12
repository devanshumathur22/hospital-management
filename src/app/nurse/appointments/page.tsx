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

  useEffect(()=>{
    loadAppointments()
  },[])

  const loadAppointments = async () => {

    const res = await fetch("/api/appointments")
    const data = await res.json()

    /* ✅ SAFE TODAY FILTER */

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
  }

  return(

    <div className="max-w-6xl mx-auto px-6 py-10">

      <h1 className="text-2xl font-semibold mb-8">
        Today's Appointments
      </h1>

      {appointments.length === 0 && (
        <p className="text-gray-500 text-center">
          No appointments for today
        </p>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {appointments.map((a:any)=>(

          <motion.div
            key={a.id}
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            whileHover={{y:-4}}
            className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >

            {/* PATIENT */}
            <div className="flex items-center gap-2 text-sm mb-2">
              <User size={15}/>
              <span className="font-medium">
                {a.patient?.name}
              </span>
            </div>

            {/* PHONE */}
            <p className="text-xs text-gray-500">
              {a.patient?.phone || "-"}
            </p>

            {/* DOCTOR */}
            <div className="flex items-center gap-2 text-sm mt-2 mb-2">
              <Stethoscope size={15}/>
              {a.doctor?.name || "Doctor"}
            </div>

            {/* TIME */}
            <div className="flex items-center gap-2 text-sm mb-3">
              <Clock size={15}/>
              {a.time}
            </div>

            {/* STATUS */}
            <p className="text-xs mb-3">
              Status:{" "}
              <span className={
                a.status === "ready"
                  ? "text-green-600"
                  : "text-orange-500"
              }>
                {a.status}
              </span>
            </p>

            {/* BUTTON */}
            <a
              href={`/nurse/vitals?patient=${a.patientId}&appointment=${a.id}`}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
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