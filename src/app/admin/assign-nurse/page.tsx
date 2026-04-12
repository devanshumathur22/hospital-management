"use client"

import { useEffect, useState } from "react"
import { Search, Stethoscope } from "lucide-react"

export default function AssignNurse(){

  const [doctors,setDoctors] = useState<any[]>([])
  const [nurses,setNurses] = useState<any[]>([])
  const [search,setSearch] = useState("")

  /* ====================== */
  /* LOAD DATA */
  /* ====================== */

  useEffect(()=>{
    loadData()
  },[])

  const loadData = async () => {
    const d = await fetch("/api/doctors")
    const n = await fetch("/api/nurses")

    setDoctors(await d.json())
    setNurses(await n.json())
  }

  /* ====================== */
  /* ASSIGN */
  /* ====================== */

  async function assign(doctorId:string,nurseId:string){

    await fetch("/api/admin/assign-nurse",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({ doctorId, nurseId })
    })

    await loadData() // 🔥 auto refresh
  }

  /* ====================== */
  /* SEARCH */
  /* ====================== */

  const filteredNurses = nurses.filter(n =>
    n.name?.toLowerCase().includes(search.toLowerCase())
  )

  return(

    <div className="max-w-4xl mx-auto p-6 space-y-8">

      <h1 className="text-2xl font-bold">
        Assign Nurse To Doctor
      </h1>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-3 text-gray-400"/>
        <input
          placeholder="Search nurse..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border rounded-lg pl-9 pr-3 h-10 w-full"
        />
      </div>

      {/* DOCTOR LIST */}
      <div className="space-y-4">

        {doctors.map(d=>(

          <div
            key={d.id}
            className="bg-white border p-4 rounded-xl shadow-sm space-y-2"
          >

            {/* DOCTOR */}
            <div className="flex items-center gap-2">
              <Stethoscope size={16}/>
              <p className="font-medium">{d.name}</p>
            </div>

            {/* 🔥 ASSIGNED NURSE SHOW */}
            <p className="text-sm text-gray-500">
              Assigned: {
                d.nurses?.length
                  ? d.nurses.map((n:any)=>n.name).join(", ")
                  : "Not Assigned"
              }
            </p>

            {/* SELECT */}
            <select
              value={d.nurses?.[0]?.id || ""} // 🔥 preselect
              onChange={(e)=>assign(d.id,e.target.value)}
              className="border rounded-lg h-9 px-3 w-full"
            >

              <option value="">Select Nurse</option>

              {filteredNurses.map(n=>(
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}

            </select>

          </div>

        ))}

      </div>

    </div>
  )
}