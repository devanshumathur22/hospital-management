"use client"

import { useEffect, useState } from "react"
import {
  Activity,
  Thermometer,
  HeartPulse
} from "lucide-react"

export default function NurseVitals(){

  const [appointments,setAppointments] = useState<any[]>([])
  const [selected,setSelected] = useState<any>(null)
  const [vitals,setVitals] = useState<any[]>([])
  const [loading,setLoading] = useState(true)

  const [form,setForm] = useState({
    bp:"",
    temperature:"",
    pulse:"",
    notes:""
  })

  useEffect(()=>{
    loadAppointments()
  },[])

  const loadAppointments = async()=>{
    const res = await fetch("/api/appointments")
    const data = await res.json()

    const today = new Date()

    const filtered = data.filter((a:any)=>{
      const d = new Date(a.date)
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      )
    })

    filtered.sort((a:any,b:any)=>a.token - b.token)

    setAppointments(filtered)
    setLoading(false)
  }

  const loadVitals = async(patientId:string)=>{
    const res = await fetch(`/api/vitals?patient=${patientId}`)
    const data = await res.json()

   const sorted = data.sort(
  (a:any, b:any) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
)

    setVitals(sorted)
  }

  const handleSelect = (a:any)=>{
    setSelected(a)
    loadVitals(a.patientId)
  }

  const handleSubmit = async()=>{

    if(!selected) return

    await fetch("/api/vitals",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        ...form,
        patientId:selected.patientId
      })
    })

    await fetch(`/api/appointments/${selected.id}`,{
      method:"PATCH",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ status:"ready" })
    })

    setForm({ bp:"", temperature:"", pulse:"", notes:"" })

    loadVitals(selected.patientId)
  }

  if(loading){
    return <div className="p-10 text-center">Loading...</div>
  }

  return(

    <div className="grid lg:grid-cols-3 gap-6 p-4">

      {/* QUEUE */}
      <div className="space-y-3">

        <h2 className="font-semibold">Queue</h2>

        {appointments.map((a:any)=>(
          <div
            key={a.id}
            onClick={()=>handleSelect(a)}
            className={`p-3 rounded-lg cursor-pointer border
            ${selected?.id === a.id ? "bg-blue-50 border-blue-400" : "bg-white"}
            `}
          >
            <p className="font-medium">
              #{a.token} - {a.patient?.name}
            </p>
            <p className="text-xs text-gray-500">{a.time}</p>
          </div>
        ))}

      </div>

      {/* FORM */}
      <div className="bg-white p-5 rounded-xl border">

        <h2 className="font-semibold mb-3">Add Vitals</h2>

        {selected && (
          <>
            <p className="text-sm mb-3">
              Patient: <b>{selected.patient?.name}</b>
            </p>

            <Input icon={Activity} placeholder="BP"
              value={form.bp}
              onChange={(v:any)=>setForm({...form,bp:v})}
            />

            <Input icon={Thermometer} placeholder="Temperature"
              value={form.temperature}
              onChange={(v:any)=>setForm({...form,temperature:v})}
            />

            <Input icon={HeartPulse} placeholder="Pulse"
              value={form.pulse}
              onChange={(v:any)=>setForm({...form,pulse:v})}
            />

            <textarea
              placeholder="Notes"
              value={form.notes}
              onChange={(e)=>setForm({...form,notes:e.target.value})}
              className="w-full border rounded p-2 text-sm mt-2"
            />

            <button
              onClick={handleSubmit}
              className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg"
            >
              Save
            </button>
          </>
        )}

      </div>

      {/* HISTORY (🔥 DOCTOR VIEW) */}
      <div className="space-y-3">

        <h2 className="font-semibold">Vitals History</h2>

        {vitals.map((v:any)=>{

          const isCritical =
            Number(v.temperature) > 100 ||
            Number(v.pulse) > 120

          return(
            <div
              key={v.id}
              className={`p-4 rounded-xl border shadow-sm
              ${isCritical ? "bg-red-50 border-red-400" : "bg-white"}
              `}
            >

              {/* MAIN */}
              <div className="grid grid-cols-3 text-center">

                <div>
                  <p className="text-xs text-gray-500">BP</p>
                  <p className="font-semibold">{v.bp || "-"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Temp</p>
                  <p className="font-semibold">{v.temperature || "-"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Pulse</p>
                  <p className="font-semibold">{v.pulse || "-"}</p>
                </div>

              </div>

              {/* NOTES */}
              {v.notes && (
                <p className="text-xs text-gray-500 mt-2">
                  {v.notes}
                </p>
              )}

              {/* TIME */}
              <p className="text-[10px] text-gray-400 mt-1 text-right">
                {new Date(v.createdAt).toLocaleTimeString()}
              </p>

            </div>
          )
        })}

      </div>

    </div>
  )
}

function Input({icon:Icon,placeholder,value,onChange}:any){
  return(
    <div className="flex items-center gap-2 border px-3 py-2 rounded mt-2">
      <Icon size={16}/>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full outline-none text-sm"
      />
    </div>
  )
}