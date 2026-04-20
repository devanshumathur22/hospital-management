"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Plus, Trash2, Save } from "lucide-react"

const medicineList = [
  "Paracetamol","Crocin","Dolo 650","Azithromycin",
  "Amoxicillin","Ibuprofen","Cetirizine","Pantoprazole"
]

export default function PrescriptionEdit(){

  const { id } = useParams()
  const router = useRouter()

  const [data,setData] = useState<any>(null)
  const [loading,setLoading] = useState(true)
  const [saving,setSaving] = useState(false)

  const [medicines,setMedicines] = useState<any[]>([
    { name:"", morning:false, afternoon:false, night:false, days:"", note:"" }
  ])

  const [notes,setNotes] = useState("")

  /* ================= LOAD ================= */

  useEffect(()=>{
    const load = async()=>{
      try{
        const res = await fetch(`/api/prescriptions/${id}`,{
          credentials:"include"
        })

        const result = await res.json()

        if(result){
          setData(result)
          setNotes(result.notes || "")

          if(Array.isArray(result.medicine) && result.medicine.length){
            setMedicines(result.medicine)
          }
        }

      }catch(err){
        console.log(err)
      }

      setLoading(false)
    }

    load()
  },[id])

  /* ================= HANDLERS ================= */

  const addMedicine = ()=>{
    setMedicines(prev=>[
      ...prev,
      { name:"", morning:false, afternoon:false, night:false, days:"", note:"" }
    ])
  }

  const updateMedicine = (i:number,field:string,value:any)=>{
    setMedicines(prev=>{
      const copy = [...prev]
      copy[i][field] = value
      return copy
    })
  }

  const removeMedicine = (i:number)=>{
    setMedicines(prev=>prev.filter((_,index)=>index!==i))
  }

  /* ================= SAVE ================= */

  const save = async()=>{

    const clean = medicines
      .filter(m => m.name.trim() !== "")
      .map(m => ({
        name: m.name,
        morning: m.morning,
        afternoon: m.afternoon,
        night: m.night,
        days: Number(m.days || 0),
        note: m.note || ""
      }))

    if(clean.length === 0){
      return alert("Add at least 1 medicine ❌")
    }

    setSaving(true)

    try{

      const res = await fetch("/api/prescriptions",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        credentials:"include",
        body:JSON.stringify({
          appointmentId:id,
          medicine:clean,
          notes
        })
      })

      const result = await res.json()

      if(!res.ok){
        alert(result.error || "Failed ❌")
        return
      }

      alert("Saved Successfully ✅")

      // 🔥 redirect back
      router.push("/doctor/appointments")

    }catch(err){
      console.log(err)
      alert("Server error ❌")
    }

    setSaving(false)
  }

  if(loading){
    return <div className="p-6">Loading...</div>
  }

  return(

    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h1 className="text-xl font-bold">Prescription</h1>
        <p className="text-sm text-gray-500">
          Patient: {data?.patient?.name} • Dr. {data?.doctor?.name}
        </p>
      </div>

      {/* MEDICINES */}
      <div className="bg-white rounded-2xl shadow p-5 space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Medicines</h2>

          <button
            onClick={addMedicine}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded"
          >
            <Plus size={14}/> Add
          </button>
        </div>

        <div className="space-y-3">

          {medicines.map((m,i)=>(

            <div key={i} className="grid md:grid-cols-6 gap-3 items-center bg-gray-50 p-3 rounded-lg">

              {/* NAME */}
              <input
                list="med-list"
                value={m.name}
                onChange={(e)=>updateMedicine(i,"name",e.target.value)}
                placeholder="Medicine"
                className="border p-2 rounded col-span-2"
              />

              {/* DOSAGE */}
              <div className="flex gap-2 text-xs">

                {["morning","afternoon","night"].map((t:any)=>(
                  <label key={t} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={m[t]}
                      onChange={(e)=>updateMedicine(i,t,e.target.checked)}
                    />
                    {t[0].toUpperCase()}
                  </label>
                ))}

              </div>

              {/* DAYS */}
              <input
                value={m.days}
                onChange={(e)=>updateMedicine(i,"days",e.target.value)}
                placeholder="Days"
                className="border p-2 rounded w-20"
              />

              {/* NOTE */}
              <input
                value={m.note}
                onChange={(e)=>updateMedicine(i,"note",e.target.value)}
                placeholder="Note"
                className="border p-2 rounded"
              />

              {/* DELETE */}
              <button
                onClick={()=>removeMedicine(i)}
                className="text-red-500"
              >
                <Trash2 size={16}/>
              </button>

            </div>

          ))}

        </div>

        <datalist id="med-list">
          {medicineList.map((m,i)=>(
            <option key={i} value={m}/>
          ))}
        </datalist>

      </div>

      {/* NOTES */}
      <div className="bg-white rounded-2xl shadow p-5">
        <textarea
          value={notes}
          onChange={(e)=>setNotes(e.target.value)}
          placeholder="Extra instructions..."
          className="w-full border p-3 rounded"
        />
      </div>

      {/* SAVE */}
      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
      >
        <Save size={16}/>
        {saving ? "Saving..." : "Save Prescription"}
      </button>

    </div>
  )
}