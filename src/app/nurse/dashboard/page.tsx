"use client"

import { useEffect, useState } from "react"
import {
  Calendar,
  Activity,
  CheckCircle,
  User,
  Stethoscope,
  Clock,
  AlertTriangle
} from "lucide-react"
import { motion } from "framer-motion"

export default function NurseDashboard(){

  const [appointments,setAppointments] = useState<any[]>([])
  const [nurse,setNurse] = useState<any>(null)
  const [loading,setLoading] = useState(true)

  /* ================= LOAD ================= */

  const loadData = async () => {
    try{
      const [a,n] = await Promise.all([
        fetch("/api/appointments",{ credentials:"include" }),
        fetch("/api/auth/me",{ cache:"no-store" })
      ])

      const appt = await a.json()
      const nurseData = await n.json()

      setNurse(nurseData.user)

      const now = new Date()

      const filtered = appt.filter((a:any)=>{
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
    loadData()

    const interval = setInterval(()=>{
      loadData()
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
    loadData()
  }

  /* ================= ALERT LOGIC ================= */

  const isCritical = (a:any)=>{
    const v = a.vitals
    if(!v) return false

    return (
      v.bp > 140 ||
      v.temperature > 100 ||
      v.oxygen < 92
    )
  }

  /* ================= STATS ================= */

  const vitalsPending = appointments.filter(a => a.status === "pending").length
  const readyForDoctor = appointments.filter(a => a.status === "ready").length

  const queue = [
    ...appointments.filter(a=>a.status==="pending"),
    ...appointments.filter(a=>a.status==="ready")
  ]

  if(loading){
    return <div className="p-10 text-center">Loading...</div>
  }

  return(

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold">
          Nurse Dashboard
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Assigned Doctor: {nurse?.doctor?.name || "Not Assigned"}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        <Card icon={Calendar} label="Appointments Today" value={appointments.length} color="text-blue-600"/>
        <Card icon={Activity} label="Vitals Pending" value={vitalsPending} color="text-orange-500"/>
        <Card icon={CheckCircle} label="Ready For Doctor" value={readyForDoctor} color="text-green-600"/>

      </div>

      {/* 🔥 QUEUE */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h2 className="font-semibold mb-3">Queue</h2>

        <div className="flex gap-3 overflow-x-auto pb-2">

          {queue.map((a:any,i:number)=>(
            <div
              key={a.id}
              className={`min-w-[120px] px-3 py-2 rounded-lg text-sm text-center font-medium
              ${i===0
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700"
              }`}
            >
              {i===0 ? "Now" : `#${i+1}`}
              <br/>
              {a.patient?.name?.split(" ")[0]}
            </div>
          ))}

        </div>
      </div>

      {/* PATIENTS */}
      <div>

        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Today's Patients
        </h2>

        {appointments.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            🏥 No patients today
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

          {appointments.map((a:any)=>(

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
                  Critical Patient
                </div>
              )}

              {/* PATIENT */}
              <div className="flex items-center gap-3 mb-3">

                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={16}/>
                </div>

                <div className="truncate">
                  <p className="font-medium text-sm">
                    {a.patient?.name || "Patient"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {a.patient?.user?.email || "No email"}
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
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm"
                >
                  <Activity size={14}/>
                  Add Vitals
                </a>

                {a.status !== "ready" && (
                  <button
                    onClick={()=>markReady(a.id)}
                    className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-2 rounded-lg text-sm"
                  >
                    Mark Ready
                  </button>
                )}

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </div>

  )
}

/* CARD */
function Card({icon:Icon,label,value,color}:any){
  return(
    <div className="bg-white border rounded-xl p-4 flex items-center gap-3 shadow-sm">
      <Icon className={color} size={22}/>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  )
}