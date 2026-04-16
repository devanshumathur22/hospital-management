"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Activity,
  Thermometer,
  HeartPulse,
  FileText,
  AlertTriangle
} from "lucide-react"

export default function VitalsPage(){

  const params = useSearchParams()
  const router = useRouter()

  const patientId = params.get("patient")
  const appointmentId = params.get("appointment")

  const [vitals,setVitals] = useState<any[]>([])
  const [loading,setLoading] = useState(false)

  const [form,setForm] = useState({
    bp:"",
    temperature:"",
    pulse:"",
    notes:""
  })

  /* ================= FETCH ================= */

  useEffect(()=>{
    if(!patientId) return
    loadVitals()
  },[patientId])

  const loadVitals = async () => {
    const res = await fetch(`/api/vitals?patient=${patientId}`)
    const data = await res.json()
    setVitals(Array.isArray(data) ? data : [])
  }

  /* ================= ALERT ================= */

  const isCritical =
    Number(form.bp) > 140 ||
    Number(form.temperature) > 100

  /* ================= SUBMIT ================= */

  const handleSubmit = async(e:any)=>{
    e.preventDefault()

    if(!form.bp || !form.temperature || !form.pulse){
      alert("Fill all required fields")
      return
    }

    setLoading(true)

    await fetch("/api/vitals",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        ...form,
        patientId,
        appointmentId
      })
    })

    // 👉 auto mark ready
    await fetch(`/api/appointments/${appointmentId}`,{
      method:"PATCH",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ status:"ready" })
    })

    setForm({
      bp:"",
      temperature:"",
      pulse:"",
      notes:""
    })

    await loadVitals()

    setLoading(false)

    alert("Vitals saved")
  }

  return(

    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      <h1 className="text-xl sm:text-2xl font-semibold">
        Patient Vitals
      </h1>

      {/* ALERT */}
      {isCritical && (
        <div className="flex items-center gap-2 text-red-600 bg-red-100 p-2 rounded text-sm">
          <AlertTriangle size={14}/>
          Critical vitals detected
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 rounded-xl border shadow-sm">

        <Input icon={Activity} label="Blood Pressure" value={form.bp}
          onChange={(v:any)=>setForm({...form,bp:v})}
        />

        <Input icon={Thermometer} label="Temperature" value={form.temperature}
          onChange={(v:any)=>setForm({...form,temperature:v})}
        />

        <Input icon={HeartPulse} label="Pulse" value={form.pulse}
          onChange={(v:any)=>setForm({...form,pulse:v})}
        />

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <FileText size={14}/>
            Notes
          </div>
          <textarea
            value={form.notes}
            onChange={(e)=>setForm({...form,notes:e.target.value})}
            className="w-full border rounded-lg p-2 text-sm"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm"
        >
          {loading ? "Saving..." : "Save Vitals"}
        </button>

      </form>

      {/* HISTORY */}
      <div className="space-y-3">

        <h2 className="text-lg font-semibold">
          Previous Vitals
        </h2>

        {vitals.length === 0 && (
          <p className="text-gray-500 text-sm">
            No vitals yet
          </p>
        )}

        {vitals.map((v:any)=>(

          <div key={v.id} className="border rounded-lg p-3 text-sm bg-white">

            <div className="flex justify-between">
              <p>BP: {v.bp || "-"}</p>
              <p>Temp: {v.temperature || "-"}</p>
            </div>

            <div className="flex justify-between mt-1">
              <p>Pulse: {v.pulse || "-"}</p>
              <p className="text-gray-400 text-xs">
                {new Date(v.createdAt).toLocaleTimeString()}
              </p>
            </div>

            {v.notes && (
              <p className="text-gray-500 mt-1 text-xs">
                {v.notes}
              </p>
            )}

          </div>

        ))}

      </div>

    </div>
  )
}

/* INPUT */
function Input({icon:Icon,label,value,onChange}:any){
  return(
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
        <Icon size={14}/>
        {label}
      </div>

      <input
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
    </div>
  )
}