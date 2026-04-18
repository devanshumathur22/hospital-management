"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  Search,
  Activity,
  XCircle
} from "lucide-react";

export default function DoctorAppointments(){

  const router = useRouter()

  const [appointments,setAppointments] = useState<any[]>([])
  const [loading,setLoading] = useState(true)
  const [search,setSearch] = useState("")

  /* 🔥 FETCH */
  const fetchAppointments = async ()=>{
    try{
      const res = await fetch("/api/appointments",{ credentials:"include" })
      const data = await res.json()
      setAppointments(data || [])
    }catch{
      setAppointments([])
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchAppointments()

    /* 🔔 AUTO REFRESH (NOTIFICATION SYSTEM) */
    const interval = setInterval(()=>{
      fetchAppointments()
    },5000)

    return ()=>clearInterval(interval)
  },[])

  /* 🔥 UPDATE STATUS */
  const updateStatus = async(id:string,status:string)=>{

    if(status==="cancelled"){
      const ok = confirm("Cancel this appointment?")
      if(!ok) return
    }

    if(status==="no-show"){
      const ok = confirm("Mark as No-show?")
      if(!ok) return
    }

    await fetch(`/api/appointments/${id}`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({status}),credentials:"include"
      
    })

    await fetchAppointments()

    if(status==="completed"){
      router.push(`/doctor/prescription/${id}`)
    }
  }

  /* 🔥 NAVIGATION */
  const openPrescription = (id:string)=>{
    router.push(`/doctor/prescription/${id}`)
  }

  const openHistory = (patientId:string)=>{
    router.push(`/doctor/patients/${patientId}`)
  }

  /* 🔍 FILTER */
  const filtered = appointments.filter((a:any)=>
    a.patient?.name?.toLowerCase().includes(search.toLowerCase())
  )

  if(loading){
    return <div className="p-6 text-sm">Loading appointments...</div>
  }

  return(

    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Appointments
      </h1>

      {/* SEARCH */}
      <div className="relative w-full sm:w-80">

        <Search size={16} className="absolute left-3 top-2.5 text-gray-400"/>

        <input
          placeholder="Search patient..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="pl-9 pr-3 py-2 text-sm border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500 text-sm">
          No appointments found
        </p>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

        {filtered.map((a:any)=>(

          <motion.div
            key={a.id}
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            whileHover={{y:-4}}
            className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-lg transition space-y-3"
          >

            {/* PATIENT */}
            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={16}/>
              </div>

              <div>
                <p className="font-semibold text-sm truncate">
                  {a.patient?.name || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">
                  Patient
                </p>
              </div>

            </div>

            {/* DATE */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14}/>
              {new Date(a.date).toDateString()}
            </div>

            {/* TIME */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14}/>
              {a.time}
            </div>

            {/* STATUS */}
            <span className={`text-xs px-2 py-1 rounded-full w-fit

              ${a.status==="pending" && "bg-yellow-100 text-yellow-700"}
              ${a.status==="completed" && "bg-green-100 text-green-700"}
              ${a.status==="cancelled" && "bg-red-100 text-red-700"}
              ${a.status==="no-show" && "bg-gray-200 text-gray-700"}

            `}>
              {a.status}
            </span>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-2 pt-2">

              {a.status === "pending" && (
                <>
                  <button
                    onClick={()=>updateStatus(a.id,"completed")}
                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs"
                  >
                    <CheckCircle size={14}/>
                    Complete
                  </button>

                  <button
                    onClick={()=>updateStatus(a.id,"cancelled")}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs"
                  >
                    <XCircle size={14}/>
                    Cancel
                  </button>

                  <button
                    onClick={()=>updateStatus(a.id,"no-show")}
                    className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1.5 rounded-lg text-xs"
                  >
                    🚫 No-show
                  </button>
                </>
              )}

              {/* VITALS */}
              <button
                onClick={()=>router.push(`/doctor/vitals/${a.id}`)}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs"
              >
                <Activity size={14}/>
                Vitals
              </button>

              {/* PRESCRIPTION */}
              <button
                onClick={()=>openPrescription(a.id)}
                className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs"
              >
                <FileText size={14}/>
                Prescription
              </button>

              {/* 🔥 NEW: PATIENT HISTORY */}
              <button
                onClick={()=>openHistory(a.patient?.id)}
                className="bg-black text-white px-3 py-1.5 rounded-lg text-xs"
              >
                History
              </button>

            </div>

          </motion.div>

        ))}

      </div>

    </div>

  )
}