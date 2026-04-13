"use client"

import { useEffect,useState } from "react"
import { User, Mail, Phone, Search, Activity } from "lucide-react"
import { motion } from "framer-motion"

export default function Patients(){

  const [patients,setPatients] = useState<any[]>([])
  const [filtered,setFiltered] = useState<any[]>([])
  const [search,setSearch] = useState("")
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState("")

  /* ================= LOAD ================= */

  useEffect(()=>{

    const load = async()=>{

      try{

        const res = await fetch("/api/patients",{
          credentials:"include"
        })

        const data = await res.json()

        if(!res.ok){
          setError(data.error || "Failed to load")
        }else{
          setPatients(data || [])
          setFiltered(data || [])
        }

      }catch(err){
        console.log(err)
        setError("Something went wrong")
      }

      setLoading(false)
    }

    load()

  },[])

  /* ================= SEARCH ================= */

  useEffect(()=>{

    const f = patients.filter((p:any)=>
      p.name?.toLowerCase().includes(search.toLowerCase())
    )

    setFiltered(f)

  },[search,patients])

  /* ================= UI ================= */

  if(loading){
    return <div className="p-10 text-center">Loading patients...</div>
  }

  if(error){
    return <div className="p-10 text-center text-red-500">{error}</div>
  }

  return(

    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <User size={26}/>
          Patients
        </h1>

        {/* SEARCH */}
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-3 text-gray-400"/>
          <input
            placeholder="Search patient..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
          />
        </div>

      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <p className="text-gray-500 text-center">
          No patients found
        </p>
      )}

      {/* GRID */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filtered.map((p:any)=>(

          <motion.div
            key={p.id}
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            whileHover={{y:-6,scale:1.02}}
            className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
          >

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-4">

              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={20}/>
              </div>

              <div>
                <p className="font-semibold text-lg">
                  {p.name}
                </p>
                <p className="text-xs text-gray-500">
                  Patient
                </p>
              </div>

            </div>

            {/* INFO */}

            <div className="space-y-2 text-sm text-gray-600">

              {/* ✅ EMAIL FIX */}
              <div className="flex items-center gap-2">
                <Mail size={14}/>
                {p.user?.email || "No email"}
              </div>

              <div className="flex items-center gap-2">
                <Phone size={14}/>
                {p.phone || "No phone"}
              </div>

              {/* EXTRA */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Activity size={12}/>
                Blood Group: {p.bloodGroup || "-"}
              </div>

            </div>

          </motion.div>

        ))}

      </div>

    </div>

  )
}