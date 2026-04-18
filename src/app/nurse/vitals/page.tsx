"use client"

import { useEffect, useState } from "react"
import {
  Activity,
  Thermometer,
  HeartPulse,
  Search,
  User,
  Clock
} from "lucide-react"
import { motion } from "framer-motion"

export default function NurseVitals(){

  const [appointments,setAppointments] = useState<any[]>([])
  const [filtered,setFiltered] = useState<any[]>([])
  const [selected,setSelected] = useState<any>(null)
  const [vitals,setVitals] = useState<any[]>([])
  const [loading,setLoading] = useState(true)
  const [search,setSearch] = useState("")

  const [form,setForm] = useState({
    bp:"",
    temperature:"",
    pulse:"",
    notes:""
  })

  /* LOAD */
  useEffect(()=>{
    loadAppointments()
  },[])

  const loadAppointments = async()=>{
    const res = await fetch("/api/appointments",{ credentials:"include" })
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
    setFiltered(filtered)
    setLoading(false)
  }

  /* 🔥 SEARCH */
  useEffect(()=>{

    const s = search.toLowerCase()

    const f = appointments.filter((a:any)=>{

      const patient = a.patient?.name?.toLowerCase() || ""
      const doctor = a.doctor?.name?.toLowerCase() || ""
      const time = (a.time || "").toLowerCase()

      return (
        patient.includes(s) ||
        doctor.includes(s) ||
        time.includes(s)
      )

    })

    setFiltered(f)

  },[search,appointments])

  /* LOAD VITALS */
  const loadVitals = async(patientId:string)=>{
    const res = await fetch(`/api/vitals?patient=${patientId}`,{ credentials:"include" })
    const data = await res.json()

    const sorted = data.sort(
      (a:any,b:any)=>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    setVitals(sorted)
  }

  const handleSelect = (a:any)=>{
    setSelected(a)
    loadVitals(a.patientId)
  }

  /* SAVE */
  const handleSubmit = async()=>{

    if(!selected) return

    await fetch("/api/vitals",{
      method:"POST",credentials:"include",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        ...form,
        patientId:selected.patientId
      })
    })

    await fetch(`/api/appointments/${selected.id}`,{
      method:"PUT", credentials:"include",
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

    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">
        Vitals Management
      </h1>

      {/* SEARCH */}
      <div className="relative w-full sm:w-96">

        <Search className="absolute left-3 top-3 text-gray-400" size={16}/>

        <input
          placeholder="Search patient, doctor, time..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="pl-9 pr-3 py-2 border rounded-lg w-full"
        />

      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* QUEUE */}
        <div className="space-y-3">

          <h2 className="font-semibold">Queue</h2>

          {filtered.map((a:any)=>(
            <motion.div
              key={a.id}
              whileHover={{scale:1.02}}
              onClick={()=>handleSelect(a)}
              className={`p-3 rounded-xl cursor-pointer border
              ${selected?.id === a.id ? "bg-blue-50 border-blue-400" : "bg-white"}
              `}
            >
              <div className="flex justify-between items-center">

                <p className="font-medium text-sm flex items-center gap-2">
                  <User size={14}/>
                  {a.patient?.name}
                </p>

                <span className="text-xs text-gray-500">
                  #{a.token}
                </span>

              </div>

              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Clock size={12}/> {a.time}
              </p>

            </motion.div>
          ))}

        </div>

        {/* FORM */}
        <div className="bg-white p-5 rounded-2xl shadow space-y-3">

          <h2 className="font-semibold">Add Vitals</h2>

          {selected ? (
            <>
              <p className="text-sm">
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
                className="w-full border rounded p-2 text-sm"
              />

              <button
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white py-2 rounded-lg"
              >
                Save Vitals
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Select a patient
            </p>
          )}

        </div>

        {/* HISTORY */}
        <div className="space-y-3">

          <h2 className="font-semibold">Vitals History</h2>

          {vitals.map((v:any)=>{

            const isCritical =
              Number(v.temperature) > 100 ||
              Number(v.pulse) > 120

            return(
              <motion.div
                key={v.id}
                initial={{opacity:0,y:10}}
                animate={{opacity:1,y:0}}
                className={`p-4 rounded-xl shadow border
                ${isCritical ? "bg-red-50 border-red-400" : "bg-white"}
                `}
              >

                <div className="grid grid-cols-3 text-center text-sm">

                  <div>
                    <p className="text-gray-500 text-xs">BP</p>
                    <p className="font-semibold">{v.bp || "-"}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Temp</p>
                    <p className="font-semibold">{v.temperature || "-"}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Pulse</p>
                    <p className="font-semibold">{v.pulse || "-"}</p>
                  </div>

                </div>

                {v.notes && (
                  <p className="text-xs text-gray-600 mt-2">
                    {v.notes}
                  </p>
                )}

                <p className="text-[10px] text-gray-400 mt-1 text-right">
                  {new Date(v.createdAt).toLocaleString()}
                </p>

              </motion.div>
            )
          })}

        </div>

      </div>

    </div>

  )
}

/* INPUT */
function Input({icon:Icon,placeholder,value,onChange}:any){
  return(
    <div className="flex items-center gap-2 border px-3 py-2 rounded">
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