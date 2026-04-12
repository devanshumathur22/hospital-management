"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function VitalsPage(){

  const params = useSearchParams()

  const patientId = params.get("patient")
  const appointmentId = params.get("appointment")

  const [vitals,setVitals] = useState<any[]>([])
  const [form,setForm] = useState({
    bp:"",
    temperature:"",
    pulse:"",
    notes:""
  })

  /* ====================== */
  /* FETCH VITALS */
  /* ====================== */

  useEffect(()=>{

    if(!patientId) return

    loadVitals()

  },[patientId])

  const loadVitals = async () => {

    const res = await fetch(`/api/vitals?patient=${patientId}`)
    const data = await res.json()

    if(Array.isArray(data)){
      setVitals(data)
    }else{
      setVitals([])
    }

  }

  /* ====================== */
  /* ADD VITAL */
  /* ====================== */

  const handleSubmit = async(e:any)=>{
    e.preventDefault()

    await fetch("/api/vitals",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        ...form,
        patientId,
        appointmentId // 🔥 IMPORTANT
      })
    })

    /* reset */
    setForm({
      bp:"",
      temperature:"",
      pulse:"",
      notes:""
    })

    await loadVitals()
  }

  return(

    <div className="p-6 max-w-3xl mx-auto space-y-6">

      <h1 className="text-xl font-semibold">
        Patient Vitals
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          placeholder="BP"
          value={form.bp}
          onChange={(e)=>setForm({...form,bp:e.target.value})}
          className="border p-2 w-full rounded"
        />

        <input
          placeholder="Temperature"
          value={form.temperature}
          onChange={(e)=>setForm({...form,temperature:e.target.value})}
          className="border p-2 w-full rounded"
        />

        <input
          placeholder="Pulse"
          value={form.pulse}
          onChange={(e)=>setForm({...form,pulse:e.target.value})}
          className="border p-2 w-full rounded"
        />

        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e)=>setForm({...form,notes:e.target.value})}
          className="border p-2 w-full rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Vital
        </button>

      </form>

      {/* LIST */}
      <div className="space-y-3">

        {vitals.map((v:any)=>(

          <div key={v.id} className="border p-3 rounded">

            <p>BP: {v.bp || "-"}</p>
            <p>Temp: {v.temperature || "-"}</p>
            <p>Pulse: {v.pulse || "-"}</p>

            <p className="text-sm text-gray-500">
              {v.notes}
            </p>

          </div>

        ))}

      </div>

    </div>
  )
}