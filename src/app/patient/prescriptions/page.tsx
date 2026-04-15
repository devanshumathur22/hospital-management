"use client"

import { useEffect, useState } from "react"

export default function PatientPrescriptions() {

const [prescriptions, setPrescriptions] = useState<any[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

const [search, setSearch] = useState("")
const [dateFilter, setDateFilter] = useState("")
const [selectedPrescription, setSelectedPrescription] = useState<any>(null)

/* FETCH */
useEffect(() => {
fetch("/api/prescriptions")
.then(res => res.json())
.then(data => {
setPrescriptions(Array.isArray(data) ? data : [])
})
.catch(()=>setError("Failed to load"))
.finally(()=>setLoading(false))
},[])

/* FILTER */
const filtered = prescriptions.filter((p:any)=>{
const doctor = p.doctor?.name?.toLowerCase() || ""
const searchMatch = doctor.includes(search.toLowerCase())

if(!dateFilter) return searchMatch

const d1 = new Date(p.createdAt)
const d2 = new Date(dateFilter)

return d1.toDateString() === d2.toDateString() && searchMatch
})

/* LOADING */
if(loading){
return <div className="p-6 text-sm">Loading...</div>
}

if(error){
return <div className="p-6 text-red-500">{error}</div>
}

return(

<div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

<h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
Prescriptions
</h1>

{/* FILTER */}
<div className="flex flex-col sm:flex-row gap-3">

<input
placeholder="Search doctor..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border px-3 py-2 rounded-lg text-sm w-full sm:w-72"
/>

<input
type="date"
value={dateFilter}
onChange={(e)=>setDateFilter(e.target.value)}
className="border px-3 py-2 rounded-lg text-sm"
/>

</div>

{/* ❌ EMPTY */}
{filtered.length === 0 && (
<p className="text-gray-500 text-sm">
No prescriptions found
</p>
)}

{/* 🔥 MOBILE VIEW */}
<div className="space-y-4 sm:hidden">

{filtered.map((p:any)=>(
<div key={p.id} className="bg-white p-4 rounded-xl shadow space-y-2">

<p className="font-semibold text-sm">
Dr. {p.doctor?.name}
</p>

<p className="text-xs text-gray-500">
{new Date(p.createdAt).toDateString()}
</p>

<button
onClick={()=>setSelectedPrescription(p)}
className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
>
View
</button>

</div>
))}

</div>

{/* 💻 DESKTOP TABLE */}
<div className="hidden sm:block bg-white rounded-xl shadow overflow-x-auto">

<table className="w-full text-sm">

<thead className="bg-gray-100">
<tr>
<th className="p-4 text-left">Doctor</th>
<th className="p-4 text-left">Date</th>
<th className="p-4 text-left">Action</th>
</tr>
</thead>

<tbody>

{filtered.map((item:any)=>(
<tr key={item.id} className="border-t">

<td className="p-4">
Dr. {item.doctor?.name}
</td>

<td className="p-4">
{new Date(item.createdAt).toLocaleDateString()}
</td>

<td className="p-4">

<button
onClick={()=>setSelectedPrescription(item)}
className="bg-blue-600 text-white px-3 py-1 rounded"
>
View
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

{/* 🔥 MODAL */}
{selectedPrescription && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

<div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-md">

<h2 className="text-lg font-bold mb-4">
Prescription
</h2>

<p className="text-sm mb-2">
Doctor: {selectedPrescription.doctor?.name}
</p>

<ul className="text-sm space-y-1">

{selectedPrescription.medicine?.map((m:any,i:number)=>(
<li key={i}>
{m.name} - {m.dosage}
</li>
))}

</ul>

<button
onClick={()=>setSelectedPrescription(null)}
className="mt-4 bg-gray-500 text-white px-4 py-2 rounded text-sm w-full"
>
Close
</button>

</div>

</div>

)}

</div>

)
}