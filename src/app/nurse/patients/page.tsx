"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Phone,
  Search,
  Mail,
  Activity,
  Eye
} from "lucide-react"
import { motion } from "framer-motion"

export default function NursePatients(){

  const router = useRouter()

  const [patients,setPatients] = useState<any[]>([])
  const [search,setSearch] = useState("")
  const [loading,setLoading] = useState(true)

  /* ================= LOAD ================= */

  const loadPatients = async () => {
    try{
      const me = await fetch("/api/auth/me",{ cache:"no-store" })
      const nurse = await me.json()

      if(!nurse?.user?.doctor?.id){
        setPatients([])
        setLoading(false)
        return
      }

      const res = await fetch("/api/appointments",{
        credentials:"include"
      })

      const data = await res.json()

      const map = new Map()

      data.forEach((a:any)=>{
        if(a.patient && !map.has(a.patient.id)){
          map.set(a.patient.id,a.patient)
        }
      })

      setPatients(Array.from(map.values()))

    }catch(err){
      console.log(err)
    }

    setLoading(false)
  }

  /* ================= AUTO REFRESH ================= */

  useEffect(()=>{
    loadPatients()

    const interval = setInterval(()=>{
      loadPatients()
    },8000)

    return ()=> clearInterval(interval)
  },[])

  /* ================= SEARCH ================= */

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  )

  /* ================= UI ================= */

  if(loading){
    return <div className="p-10 text-center">Loading patients...</div>
  }

  return(

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

        <h1 className="text-xl sm:text-2xl font-semibold">
          Patients
        </h1>

        <p className="text-sm text-gray-500">
          {filtered.length} patients
        </p>

      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-3 text-gray-400"/>
        <input
          placeholder="Search name or phone..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border rounded-lg h-10 pl-9 pr-3 w-full text-sm"
        />
      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          🏥 No patients found
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

        {filtered.map((p:any)=>(

          <motion.div
            key={p.id}
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            whileHover={{y:-4}}
            className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >

            {/* INFO */}
            <div>

              {/* NAME */}
              <div className="flex items-center gap-2 mb-2">
                <User size={16}/>
                <p className="font-medium text-sm">{p.name}</p>
              </div>

              {/* PHONE */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Phone size={14}/>
                {p.phone || "-"}
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 truncate">
                <Mail size={14}/>
                {p.user?.email || "No email"}
              </div>

            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex gap-2">

              <button
                onClick={()=>router.push(`/nurse/vitals/${p.id}`)}
                className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs"
              >
                <Activity size={14}/>
                Vitals
              </button>

              <button
                onClick={()=>router.push(`/patient/${p.id}/history`)}
                className="flex-1 flex items-center justify-center gap-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg text-xs"
              >
                <Eye size={14}/>
                History
              </button>

            </div>

          </motion.div>

        ))}

      </div>

    </div>

  )
}