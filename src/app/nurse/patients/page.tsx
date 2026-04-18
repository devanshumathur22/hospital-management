"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Phone,
  Search,
  Mail,
  Activity,
  Eye,
  Calendar,
  Clock
} from "lucide-react"
import { motion } from "framer-motion"

type DateFormat = {
  date: string
  day: string
}

export default function NursePatients(){

  const router = useRouter()

  const [patients,setPatients] = useState<any[]>([])
  const [filtered,setFiltered] = useState<any[]>([])
  const [search,setSearch] = useState("")
  const [loading,setLoading] = useState(true)

  /* LOAD */
  const loadPatients = async () => {
    try{
      const res = await fetch("/api/appointments",{ credentials:"include" })
      const data = await res.json()

      const map = new Map()

      data.forEach((a:any)=>{
        if(a.patient && !map.has(a.patient.id)){
          map.set(a.patient.id,{
            ...a.patient,
            lastVisit: a.date || null,
            time: a.time || "-",
            doctor: a.doctor || null
          })
        }
      })

      const arr = Array.from(map.values())

      setPatients(arr)
      setFiltered(arr)

    }catch(err){
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(()=>{
    loadPatients()
    const i = setInterval(loadPatients,8000)
    return ()=>clearInterval(i)
  },[])

  /* 🔥 SEARCH */
  useEffect(()=>{

    const s = search.toLowerCase()

    const f = patients.filter((p:any)=>{

      const name = p.name?.toLowerCase() || ""
      const phone = p.phone || ""
      const email = p.user?.email?.toLowerCase() || ""
      const doctor = p.doctor?.name?.toLowerCase() || ""

      const d = p.lastVisit ? new Date(p.lastVisit) : null

      const date = d ? d.toLocaleDateString().toLowerCase() : ""
      const day = d ? d.toLocaleDateString(undefined,{ weekday:"long" }).toLowerCase() : ""
      const time = (p.time || "").toLowerCase()

      return (
        name.includes(s) ||
        phone.includes(s) ||
        email.includes(s) ||
        doctor.includes(s) ||
        date.includes(s) ||
        day.includes(s) ||
        time.includes(s)
      )

    })

    setFiltered(f)

  },[search,patients])

  /* ✅ FIXED FORMAT */
  const formatDate = (d:any): DateFormat => {

    if(!d){
      return { date:"-", day:"-" }
    }

    const date = new Date(d)

    if(isNaN(date.getTime())){
      return { date:"-", day:"-" }
    }

    return {
      date: date.toLocaleDateString(),
      day: date.toLocaleDateString(undefined,{ weekday:"short" })
    }
  }

  if(loading){
    return <div className="p-10 text-center">Loading patients...</div>
  }

  return(

    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Patients
        </h1>

        <p className="text-sm text-gray-500">
          {filtered.length} patients
        </p>

      </div>

      {/* SEARCH */}
      <div className="relative w-full sm:w-96">

        <Search className="absolute left-3 top-3 text-gray-400" size={16}/>

        <input
          placeholder="Search name, phone, doctor, date, time..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="pl-9 pr-3 py-2 border rounded-lg w-full"
        />

      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <p className="text-gray-500 text-sm">
          No patients found
        </p>
      )}

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {filtered.map((p:any)=>{

          const { date, day } = formatDate(p.lastVisit)

          return(

            <motion.div
              key={p.id}
              initial={{opacity:0,y:20}}
              animate={{opacity:1,y:0}}
              whileHover={{y:-4}}
              className="bg-white rounded-2xl shadow p-5 space-y-3"
            >

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={16}/>
                </div>

                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    {p.user?.email || "No email"}
                  </p>
                </div>

              </div>

              <div className="text-xs text-gray-500 space-y-1">

                <div className="flex items-center gap-2">
                  <Phone size={14}/> {p.phone || "-"}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={14}/> {date} ({day})
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={14}/> {p.time || "-"}
                </div>

                <div className="flex items-center gap-2">
                  Dr. {p.doctor?.name || "-"}
                </div>

              </div>

              <div className="flex gap-2 pt-2">

               
                

              </div>

            </motion.div>

          )

        })}

      </div>

    </div>

  )
}