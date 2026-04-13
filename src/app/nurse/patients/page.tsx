"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Phone, Search, Mail } from "lucide-react"
import { motion } from "framer-motion"

export default function NursePatients(){

  const router = useRouter()

  const [patients,setPatients] = useState<any[]>([])
  const [search,setSearch] = useState("")
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    loadPatients()
  },[])

  /* ================= LOAD ================= */

  const loadPatients = async () => {

    try{

      // 🔥 get nurse
      const me = await fetch("/api/auth/me",{
        cache:"no-store"
      })

      const nurse = await me.json()

      if(!nurse?.user?.doctor?.id){
        setPatients([])
        setLoading(false)
        return
      }

      // 🔥 get appointments
      const res = await fetch("/api/appointments",{
        credentials:"include"
      })

      const data = await res.json()

      // 🔥 unique patients
      const map = new Map()

      data.forEach((a:any)=>{
        if(a.patient && !map.has(a.patient.id)){
          map.set(a.patient.id,a.patient)
        }
      })

      setPatients(Array.from(map.values()))

    }catch(err){
      console.log("PATIENT LOAD ERROR",err)
    }

    setLoading(false)
  }

  /* ================= SEARCH ================= */

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  /* ================= UI ================= */

  if(loading){
    return <div className="p-10 text-center">Loading patients...</div>
  }

  return(

    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

      <h1 className="text-2xl font-semibold">
        Patients
      </h1>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-3 text-gray-400"/>
        <input
          placeholder="Search patient..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border rounded-lg h-10 pl-9 pr-3 w-full"
        />
      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <p className="text-gray-500">
          No patients found
        </p>
      )}

      {/* LIST */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filtered.map((p:any)=>(

          <motion.div
            key={p.id}
            onClick={()=>router.push(`/nurse/vitals/${p.id}`)}
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            whileHover={{y:-4}}
            className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition cursor-pointer"
          >

            {/* NAME */}
            <div className="flex items-center gap-2 mb-2">
              <User size={16}/>
              <p className="font-medium">{p.name}</p>
            </div>

            {/* PHONE */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone size={14}/>
              {p.phone || "-"}
            </div>

            {/* ✅ EMAIL FIX */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Mail size={14}/>
              {p.user?.email || "No email"}
            </div>

          </motion.div>

        ))}

      </div>

    </div>

  )
}