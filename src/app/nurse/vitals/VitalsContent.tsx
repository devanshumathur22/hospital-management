"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import {
  Activity,
  Thermometer,
  HeartPulse,
  Droplet,
  FileText
} from "lucide-react"

export default function VitalsContent(){

  const params = useSearchParams()
  const router = useRouter()

  const patientId = params.get("patient")
  const appointmentId = params.get("appointment")

  const [form,setForm] = useState({
    bp:"",
    temperature:"",
    pulse:"",
    oxygen:"",
    notes:""
  })

  const [loading,setLoading] = useState(false)

  /* ================= INPUT ================= */

  const handleChange = (e:any)=>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  /* ================= SAVE ================= */

  const handleSubmit = async ()=>{

    if(!form.bp || !form.temperature || !form.pulse || !form.oxygen){
      alert("Fill all required fields")
      return
    }

    setLoading(true)

    try{

      await fetch("/api/vitals",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          patientId,
          appointmentId,
          ...form
        })
      })

      // 👉 mark ready automatically
      await fetch(`/api/appointments/${appointmentId}`,{
        method:"PATCH",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ status:"ready" })
      })

      alert("Vitals saved successfully")

      router.push("/nurse/dashboard")

    }catch(err){
      console.log(err)
      alert("Error saving vitals")
    }

    setLoading(false)
  }

  /* ================= ALERT ================= */

  const isCritical =
    Number(form.bp) > 140 ||
    Number(form.temperature) > 100 ||
    Number(form.oxygen) < 92

  return(

    <div className="max-w-2xl mx-auto px-4 py-8">

      <div className="bg-white border rounded-xl p-6 shadow-sm">

        <h1 className="text-xl font-semibold mb-6">
          Add Patient Vitals
        </h1>

        {/* ALERT */}
        {isCritical && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            ⚠️ Critical vitals detected!
          </div>
        )}

        <div className="space-y-4">

          {/* BP */}
          <Input
            icon={Activity}
            name="bp"
            placeholder="Blood Pressure (e.g. 120)"
            value={form.bp}
            onChange={handleChange}
          />

          {/* TEMP */}
          <Input
            icon={Thermometer}
            name="temperature"
            placeholder="Temperature (°F)"
            value={form.temperature}
            onChange={handleChange}
          />

          {/* PULSE */}
          <Input
            icon={HeartPulse}
            name="pulse"
            placeholder="Pulse Rate"
            value={form.pulse}
            onChange={handleChange}
          />

          {/* OXYGEN */}
          <Input
            icon={Droplet}
            name="oxygen"
            placeholder="Oxygen (%)"
            value={form.oxygen}
            onChange={handleChange}
          />

          {/* NOTES */}
          <div>
            <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
              <FileText size={14}/>
              Notes
            </div>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 text-sm"
              placeholder="Optional notes..."
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm"
          >
            {loading ? "Saving..." : "Save Vitals"}
          </button>

        </div>

      </div>

    </div>

  )
}

/* INPUT COMPONENT */
function Input({icon:Icon,name,placeholder,value,onChange}:any){
  return(
    <div>
      <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
        <Icon size={14}/>
        {placeholder}
      </div>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
    </div>
  )
}