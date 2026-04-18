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

  /* LOAD */
  const loadData = async () => {
    try{
      const [a,n] = await Promise.all([
        fetch("/api/appointments",{ credentials:"include" }),
        fetch("/api/auth/me",{ cache:"no-store",credentials:"include" })
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

  useEffect(()=>{
    loadData()
    const interval = setInterval(loadData,5000)
    return ()=> clearInterval(interval)
  },[])

  /* ACTIONS */
  const markReady = async(id:string)=>{
    await fetch(`/api/appointments/${id}`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ status:"ready" })
      ,credentials:"include"
    })
    loadData()
  }

  const markComplete = async(id:string)=>{
    await fetch(`/api/appointments/${id}`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ status:"completed" })
      ,credentials:"include"
    })
    loadData()
  }

  /* CRITICAL */
  const isCritical = (a:any)=>{
    const v = a.vitals
    if(!v) return false

    return (
      v.bp > 140 ||
      v.temperature > 100 ||
      v.oxygen < 92
    )
  }

  /* FILTER */
  const pending = appointments.filter(a=>a.status==="pending")
  const ready = appointments.filter(a=>a.status==="ready")
  const completed = appointments.filter(a=>a.status==="completed")

  const queue = [...pending, ...ready]

  if(loading){
    return <div className="p-10 text-center">Loading...</div>
  }

  return(

    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Nurse Dashboard
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Assigned Doctor: {nurse?.doctor?.name || "Not Assigned"}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">

        <Card icon={Calendar} label="Today" value={appointments.length} color="text-blue-600"/>
        <Card icon={Activity} label="Pending" value={pending.length} color="text-orange-500"/>
        <Card icon={CheckCircle} label="Completed" value={completed.length} color="text-green-600"/>

      </div>

      {/* QUEUE */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h2 className="font-semibold mb-3">Queue</h2>

        <div className="flex gap-3 overflow-x-auto">

          {queue.map((a:any,i:number)=>(
            <div
              key={a.id}
              className={`min-w-[120px] px-3 py-2 rounded-lg text-center text-sm
              ${i===0 ? "bg-green-600 text-white" : "bg-gray-100"}`}
            >
              {i===0 ? "Now" : `#${i+1}`}
              <br/>
              {a.patient?.name?.split(" ")[0]}
            </div>
          ))}

        </div>
      </div>

      {/* ACTIVE PATIENTS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Active Patients
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {queue.map((a:any)=>(

            <motion.div
              key={a.id}
              initial={{opacity:0,y:20}}
              animate={{opacity:1,y:0}}
              className={`bg-white p-4 rounded-xl border shadow-sm space-y-3
              ${isCritical(a) ? "border-red-500" : ""}
              `}
            >

              {isCritical(a) && (
                <div className="text-red-600 text-xs flex gap-2">
                  <AlertTriangle size={14}/> Critical
                </div>
              )}

              <p className="font-semibold">
                {a.patient?.name}
              </p>

              <p className="text-xs text-gray-500">
                Dr. {a.doctor?.name}
              </p>

              <p className="text-xs text-gray-500 flex gap-2 items-center">
                <Clock size={14}/> {a.time}
              </p>

              <span className={`text-xs px-2 py-1 rounded ${
                a.status==="ready"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-600"
              }`}>
                {a.status}
              </span>

              <div className="space-y-2">

                {a.status === "pending" && (
                  <button
                    onClick={()=>markReady(a.id)}
                    className="w-full border border-green-600 text-green-600 py-2 rounded"
                  >
                    Mark Ready
                  </button>
                )}

               

              </div>

            </motion.div>

          ))}

        </div>
      </div>

      {/* COMPLETED */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Completed Patients
        </h2>

        {completed.length === 0 && (
          <p className="text-gray-500 text-sm">
            No completed patients
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {completed.map((a:any)=>(

            <div
              key={a.id}
              className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2"
            >

              <p className="font-semibold">
                {a.patient?.name}
              </p>

              <p className="text-sm text-gray-600">
                Dr. {a.doctor?.name}
              </p>

              <p className="text-xs text-gray-500">
                {new Date(a.updatedAt).toLocaleString()}
              </p>

              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                Completed
              </span>

            </div>

          ))}

        </div>
      </div>

    </div>

  )
}

/* CARD */
function Card({icon:Icon,label,value,color}:any){
  return(
    <div className="bg-white p-4 rounded-xl border flex items-center gap-3 shadow-sm">
      <Icon className={color} size={22}/>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  )
}