"use client"

import { useEffect, useState } from "react"
import {
  User, Search, FileText, Calendar, Clock, Stethoscope
} from "lucide-react"
import { motion } from "framer-motion"

export default function DoctorPrescriptions(){

  const [prescriptions,setPrescriptions] = useState<any[]>([])
  const [filtered,setFiltered] = useState<any[]>([])
  const [loading,setLoading] = useState(true)
  const [selected,setSelected] = useState<any>(null)
  const [search,setSearch] = useState("")

  /* LOAD */
  useEffect(()=>{
    fetch("/api/prescriptions",{ credentials:"include" })
    .then(res=>res.json())
    .then(data=>{
      setPrescriptions(data || [])
      setFiltered(data || [])
      setLoading(false)
    })
  },[])

  /* SEARCH */
  useEffect(()=>{
    const s = search.toLowerCase()

    const f = prescriptions.filter((p:any)=>{
      return (
        p.patient?.name?.toLowerCase().includes(s) ||
        p.doctor?.name?.toLowerCase().includes(s)
      )
    })

    setFiltered(f)
  },[search,prescriptions])

  /* FORMAT */
  const format = (d:string)=>{
    const date = new Date(d)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
      day: date.toLocaleDateString(undefined,{ weekday:"long" })
    }
  }

  if(loading){
    return <div className="p-6">Loading...</div>
  }

  return(
    <div className="max-w-7xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FileText size={20}/> Prescriptions
      </h1>

      {/* SEARCH */}
      <input
        placeholder="Search patient..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="border p-2 rounded w-full max-w-sm"
      />

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {filtered.map((p:any)=>{

          const f = format(p.createdAt)

          return(
            <motion.div
              key={p.id}
              whileHover={{y:-4}}
              className="bg-white p-5 rounded-xl shadow space-y-3"
            >

              {/* TOP */}
              <div className="flex items-center gap-3">
                <User size={18}/>
                <div>
                  <p className="font-semibold">{p.patient?.name}</p>
                  <p className="text-xs text-gray-500">
                    Dr. {p.doctor?.name}
                  </p>
                </div>
              </div>

              {/* DATE */}
              <div className="text-sm text-gray-500 space-y-1">
                <p className="flex items-center gap-1">
                  <Calendar size={14}/> {f.date} ({f.day})
                </p>
                <p className="flex items-center gap-1">
                  <Clock size={14}/> {f.time}
                </p>
              </div>

              {/* BUTTON */}
              <button
                onClick={()=>setSelected(p)}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                View Details
              </button>

            </motion.div>
          )
        })}

      </div>

      {/* ================= MODAL ================= */}
      {selected && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-2xl p-6 rounded-xl space-y-5">

            {/* HEADER */}
            <div className="text-center border-b pb-3">
              <h2 className="text-xl font-bold">City Care Hospital</h2>
              <p className="text-sm text-gray-500">Prescription</p>
            </div>

            {/* INFO */}
            <div className="grid grid-cols-2 text-sm">

              <div>
                <p><b>Patient:</b> {selected.patient?.name}</p>
                <p><b>Gender:</b> {selected.patient?.gender || "-"}</p>
                <p><b>Phone:</b> {selected.patient?.phone || "-"}</p>
              </div>

              <div className="text-right">
                <p><b>Doctor:</b> Dr. {selected.doctor?.name}</p>
                <p><b>Date:</b> {format(selected.createdAt).date}</p>
                <p><b>Time:</b> {format(selected.createdAt).time}</p>
                <p><b>Day:</b> {format(selected.createdAt).day}</p>
              </div>

            </div>

            {/* MEDICINES */}
            <div>
              <h3 className="font-semibold mb-2">Medicines</h3>

              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Name</th>
                    <th>Dosage</th>
                    <th>Days</th>
                    <th>Note</th>
                  </tr>
                </thead>

                <tbody>
                  {selected.medicine?.map((m:any,i:number)=>(
                    <tr key={i} className="border-t text-center">

                      <td className="p-2">{m.name}</td>

                      <td>
                        {m.morning && "M "}
                        {m.afternoon && "A "}
                        {m.night && "N"}
                      </td>

                      <td>{m.days}</td>

                      <td>{m.note}</td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

            {/* NOTES */}
            <div>
              <h3 className="font-semibold">Notes</h3>
              <p className="text-sm text-gray-600">
                {selected.notes || "-"}
              </p>
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-end pt-5 text-sm">

              <p>Hospital Helpline: +91 XXXXXXXX</p>

              <div className="text-right">
                <div className="border-t w-40 mb-1"></div>
                <p>Doctor Signature</p>
              </div>

            </div>

            {/* ACTION */}
            <button
              onClick={()=>setSelected(null)}
              className="w-full bg-gray-700 text-white py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  )
}