"use client"

import { useEffect,useState } from "react"
import { useParams } from "next/navigation"

export default function DoctorVitals(){

const params = useParams()
const patientId = params.id

const [vitals,setVitals] = useState<any[]>([])

useEffect(()=>{

fetch(`/api/vitals?patient=${patientId}`)
.then(res=>res.json())
.then(data=>{
setVitals(data)
})

},[patientId])

return(

<div className="p-8">

<h1 className="text-2xl font-bold mb-6">
Patient Vitals
</h1>

{vitals.length === 0 && (
<p className="text-gray-500">
No vitals added yet
</p>
)}

{vitals.map(v=>(
<div key={v.id} className="border p-4 rounded mb-3">

<p><b>BP:</b> {v.bp}</p>
<p><b>Temp:</b> {v.temperature}</p>
<p><b>Pulse:</b> {v.pulse}</p>
<p><b>Notes:</b> {v.notes}</p>

</div>
))}

</div>

)

}