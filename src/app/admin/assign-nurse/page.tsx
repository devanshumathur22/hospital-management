"use client"

import { useEffect, useState } from "react"
import { Search, Stethoscope, User } from "lucide-react"
import { motion } from "framer-motion"

export default function AssignNurse(){

  const [doctors,setDoctors] = useState<any[]>([])
  const [nurses,setNurses] = useState<any[]>([])
  const [search,setSearch] = useState("")
  const [loading,setLoading] = useState(true)
  const [assigning,setAssigning] = useState(false)

  useEffect(()=>{
    loadData()
  },[])

  const loadData = async () => {
    try{
      const d = await fetch("/api/doctors",{ credentials:"include" })
      const n = await fetch("/api/nurses",{ credentials:"include" })

      const doctorsData = await d.json()
      const nursesData = await n.json()

      const safeDoctors = Array.isArray(doctorsData)
        ? doctorsData
        : doctorsData?.data || []

      const safeNurses = Array.isArray(nursesData)
        ? nursesData
        : nursesData?.data || nursesData?.nurses || []

      setDoctors(safeDoctors)
      setNurses(safeNurses)

    }catch(err){
      console.log(err)
      setDoctors([])
      setNurses([])
    }

    setLoading(false)
  }

  async function assign(doctorId:string,nurseId:string){
    if (!nurseId) return

    setAssigning(true)

    try{
      const res = await fetch("/api/admin/assign-nurse",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ doctorId, nurseId }),
        credentials:"include"
      })

      const data = await res.json()

      if(!res.ok){
        alert(data.error || "Failed ❌")
        return
      }

      alert("Assigned successfully ✅")
      await loadData()

    }catch(err){
      console.log(err)
      alert("Failed ❌")
    }

    setAssigning(false)
  }

  /* 🔥 GET ASSIGNED NURSE IDS */
  const assignedNurseIds = doctors.flatMap((d:any)=>
    d.nurses?.map((n:any)=>n.id) || []
  )

  /* 🔥 FILTER AVAILABLE NURSES ONLY */
  const filteredNurses = nurses
    .filter((n:any)=> !assignedNurseIds.includes(n.id)) // only free nurses
    .filter((n:any)=>
      n.name?.toLowerCase().includes(search.toLowerCase())
    )

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-sm">Loading...</div>
  }

  return(
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      <h1 className="text-2xl font-bold">
        Assign Nurse To Doctor
      </h1>

      <div className="relative w-full max-w-md">
        <Search size={16} className="absolute left-3 top-2.5 text-gray-400"/>

        <input
          placeholder="Search nurse..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="pl-9 pr-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">

        {doctors.map((d:any)=>(

          <motion.div
            key={d.id}
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            className="bg-white border p-5 rounded-2xl shadow-sm space-y-3"
          >

            {/* Doctor */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                <Stethoscope size={16}/>
              </div>

              <div>
                <p className="font-semibold text-sm">{d.name}</p>
                <p className="text-xs text-gray-500">Doctor</p>
              </div>
            </div>

            {/* Assigned */}
            <div className="text-sm text-gray-600">
              Assigned:{" "}
              <span className="font-medium">
                {d.nurses?.length
                  ? d.nurses.map((n:any)=>n.name).join(", ")
                  : "Not Assigned"}
              </span>
            </div>

            {/* Select */}
            <div className="relative">

              <User size={14} className="absolute left-3 top-2.5 text-gray-400"/>

              <select
                disabled={assigning}
                defaultValue=""
                onChange={(e)=>assign(d.id,e.target.value)}
                className="border rounded-lg pl-8 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">Select Nurse</option>

                {filteredNurses.length === 0 && (
                  <option disabled>No Available Nurse</option>
                )}

                {filteredNurses.map((n:any)=>(
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}

              </select>

            </div>

          </motion.div>

        ))}

      </div>

    </div>
  )
}