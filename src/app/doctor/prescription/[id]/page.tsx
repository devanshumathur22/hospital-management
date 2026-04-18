"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function PrescriptionView(){

const params = useParams()
const id = params?.id as string

const [data,setData] = useState<any>(null)
const [loading,setLoading] = useState(true)
const [error,setError] = useState<string | null>(null)

/* 🔥 FETCH + AUTO CREATE */
useEffect(()=>{

if(!id) return

const load = async ()=>{

try{

let res = await fetch(`/api/prescriptions/${id}`)

/* ❌ NOT FOUND → AUTO CREATE */
if(res.status === 404){

await fetch("/api/prescriptions",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({
  appointmentId: id,
  medicine: [],
  notes:""
})
})

/* 🔁 REFETCH */
res = await fetch(`/api/prescriptions/${id}`)
}

if(!res.ok){
throw new Error("Failed to load prescription")
}

const result = await res.json()
setData(result)

}catch(err:any){
setError(err.message)
}

setLoading(false)
}

load()

},[id])

/* STATES */
if(loading){
return <div className="p-6">Loading...</div>
}

if(error){
return <div className="p-6 text-red-500">{error}</div>
}

if(!data){
return <div className="p-6">No data found</div>
}

return(

<div className="min-h-screen bg-gray-100 p-6">

<div className="max-w-5xl mx-auto bg-white p-8 shadow rounded space-y-6">

{/* HEADER */}
<div className="text-center border-b pb-4">
<h1 className="text-2xl font-bold">City Care Hospital</h1>
<p className="text-sm text-gray-500">
Discharge Summary / Prescription
</p>
</div>

{/* INFO */}
<div className="grid grid-cols-2 gap-4 text-sm">

<div>
<p><b>Patient:</b> {data.patient?.name || "-"}</p>
<p><b>Phone:</b> {data.patient?.phone || "-"}</p>
<p><b>Gender:</b> {data.patient?.gender || "-"}</p>
</div>

<div className="text-right">
<p><b>Doctor:</b> Dr. {data.doctor?.name || "-"}</p>
<p><b>Date:</b> {new Date(data.createdAt).toLocaleDateString()}</p>
</div>

</div>

{/* SECTIONS */}
<div className="space-y-4 text-sm">

<div>
<p className="font-semibold">CONDITION AT DISCHARGE</p>
<p className="text-gray-700">
Patient is stable at the time of discharge.
</p>
</div>

<div>
<p className="font-semibold">ADVICE AT DISCHARGE</p>
<p className="text-gray-700">
Do not stop medications without consulting doctor.
</p>
</div>

<div>
<p className="font-semibold">DIETARY ADVICE</p>
<p className="text-gray-700">
Diet as per dietitian advice.
</p>
</div>

</div>

{/* MEDICATION */}
<div>

<h2 className="font-bold mb-3">
MEDICATION AT DISCHARGE
</h2>

<div className="grid grid-cols-2 gap-6 text-sm">

{/* LEFT */}
<div>
<p className="font-semibold underline mb-2">DRUG NAME</p>

{data.medicine?.length > 0 ? (
data.medicine.map((m:any,i:number)=>(
<p key={i}>{i+1}) {m.name}</p>
))
) : (
<p className="text-gray-500">No medicines</p>
)}

</div>

{/* RIGHT */}
<div>
<p className="font-semibold underline mb-2">PATIENT INSTRUCTION</p>

{data.medicine?.length > 0 ? (
data.medicine.map((m:any,i:number)=>(
<p key={i}>{m.timing || "-"} • {m.dosage || "-"}</p>
))
) : (
<p className="text-gray-500">-</p>
)}

</div>

</div>

</div>

{/* FOOTER */}
<div className="flex justify-between items-end pt-6 text-sm">

<p>Hospital Helpline: +91 XXXXXXXX</p>

<div className="text-right">
<div className="border-t w-40 mb-1"></div>
<p>Doctor Signature</p>
</div>

</div>

</div>

</div>

)
}