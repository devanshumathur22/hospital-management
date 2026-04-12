"use client"

import { useEffect, useState } from "react"
import {
  Calendar,
  Activity,
  CheckCircle,
  User,
  Stethoscope,
  Clock
} from "lucide-react"
import { motion } from "framer-motion"

export default function NurseDashboard(){

  const [appointments,setAppointments] = useState<any[]>([])
  const [nurse,setNurse] = useState<any>(null)

  useEffect(()=>{

    loadData()

  },[])

  const loadData = async () => {

    const a = await fetch("/api/appointments")
    const n = await fetch("/api/auth/me")

    const appt = await a.json()
    const nurseData = await n.json()

    setAppointments(appt)
    setNurse(nurseData)

  }

  /* ====================== */
  /* STATS */
  /* ====================== */

  const vitalsPending = appointments.filter(a => a.status === "pending").length

  const readyForDoctor = appointments.filter(a => a.status === "ready").length

  return(

    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* TITLE */}
      <h1 className="text-2xl font-semibold">
        Nurse Dashboard
      </h1>

      {/* 🔥 ASSIGNED DOCTOR */}
      <p className="text-gray-500">
        Assigned Doctor: {nurse?.doctor?.name || "Not Assigned"}
      </p>

      {/* ================== */}
      {/* STATS */}
      {/* ================== */}

      <div className="grid md:grid-cols-3 gap-6">

        {/* APPOINTMENTS */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <Calendar size={26} className="text-blue-600"/>
          <div>
            <p className="text-gray-500 text-sm">
              Appointments Today
            </p>
            <p className="text-2xl font-bold">
              {appointments.length}
            </p>
          </div>
        </div>

        {/* VITALS */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <Activity size={26} className="text-orange-500"/>
          <div>
            <p className="text-gray-500 text-sm">
              Vitals Pending
            </p>
            <p className="text-2xl font-bold">
              {vitalsPending}
            </p>
          </div>
        </div>

        {/* READY */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <CheckCircle size={26} className="text-green-600"/>
          <div>
            <p className="text-gray-500 text-sm">
              Ready For Doctor
            </p>
            <p className="text-2xl font-bold">
              {readyForDoctor}
            </p>
          </div>
        </div>

      </div>

      {/* ================== */}
      {/* PATIENT LIST */}
      {/* ================== */}

      <div>

        <h2 className="text-xl font-semibold mb-6">
          Today's Patients
        </h2>

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
              <div className="flex items-center gap-2 text-sm mb-2">
                <User size={15}/>
                <span className="font-medium">
                  {a.patient?.name}
                </span>
              </div>

              {/* 🔥 EXTRA DETAILS */}
              <p className="text-xs text-gray-500">
                {a.patient?.email || "-"}
              </p>

              <p className="text-xs text-gray-500">
                {a.patient?.phone || "-"}
              </p>

              {/* DOCTOR */}
              <div className="flex items-center gap-2 text-sm mt-2 mb-2">
                <Stethoscope size={15}/>
                {a.doctor?.name}
              </div>

              {/* TIME */}
              <div className="flex items-center gap-2 text-sm mb-4">
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
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm"
              >
                <Activity size={16}/>
                Add Vitals
              </a>

            </motion.div>

          ))}

        </div>

      </div>

    </div>

  )
}