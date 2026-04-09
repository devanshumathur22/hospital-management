"use client"

import { useEffect, useState } from "react"

export default function PatientPrescriptions(){

const [prescriptions,setPrescriptions] = useState<any[]>([])
const [loading,setLoading] = useState(true)

const [search,setSearch] = useState("")
const [dateFilter,setDateFilter] = useState("")
const [selectedDoctor,setSelectedDoctor] = useState<any>(null)
const [selectedPrescription,setSelectedPrescription] = useState<any>(null)

useEffect(()=>{

fetch("/api/prescriptions")
.then(res=>res.json())
.then(data=>{
setPrescriptions(data)
setLoading(false)
})

},[])

const filtered = prescriptions.filter((p)=>{

const doctor = p.doctor?.name?.toLowerCase() || ""
const searchMatch = doctor.includes(search.toLowerCase())

const dateMatch = dateFilter
? new Date(p.createdAt).toLocaleDateString() ===
new Date(dateFilter).toLocaleDateString()
: true

return searchMatch && dateMatch

})

/* ✅ DOWNLOAD SINGLE PRESCRIPTION */

function downloadPrescription(p:any){

const win = window.open("", "", "width=800,height=600")

if(win){

win.document.write(`
<html>
<head>
<title>Prescription</title>
<style>
body{font-family:sans-serif;padding:20px}
h2{margin-bottom:10px}
</style>
</head>
<body>

<h2>Hospital Prescription</h2>

<p><b>Doctor:</b> ${p.doctor?.name}</p>
<p><b>Date:</b> ${new Date(p.createdAt).toLocaleDateString()}</p>

<h3>Medicines:</h3>
<ul>
${(Array.isArray(p.medicine)?p.medicine:[p.medicine]).map((m:any)=>`
<li>${m.name} - ${m.dosage}</li>
`).join("")}
</ul>

<p><b>Notes:</b> ${p.notes || "-"}</p>

</body>
</html>
`)

win.document.close()
win.print()

}

}

if(loading){
return <div className="p-10 text-center">Loading...</div>
}

return(

<div className="max-w-6xl mx-auto px-4 py-10">

<h1 className="text-3xl font-bold mb-8">
Prescriptions
</h1>

{/* SEARCH */}

<div className="flex flex-col md:flex-row gap-4 mb-8">

<input
placeholder="Search doctor..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border rounded-lg px-4 py-2 w-full md:w-64"
/>

<input
type="date"
value={dateFilter}
onChange={(e)=>setDateFilter(e.target.value)}
className="border rounded-lg px-4 py-2"
/>

</div>

{/* TABLE */}

<div className="bg-white rounded-xl shadow overflow-hidden">

<table className="w-full text-left">

<thead className="bg-gray-100">
<tr>
<th className="p-4">Doctor</th>
<th className="p-4">Medicine</th>
<th className="p-4">Date</th>
<th className="p-4">Action</th>
</tr>
</thead>

<tbody>

{filtered.length === 0 && (
<tr>
<td colSpan={4} className="p-6 text-center">
No prescriptions
</td>
</tr>
)}

{filtered.map((item:any)=>{

let meds:any[] = []

if(Array.isArray(item.medicine)){
meds = item.medicine
}else if(item.medicine){
meds = [item.medicine]
}

return(

<tr key={item.id} className="border-t hover:bg-gray-50">

<td
className="p-4 text-blue-600 cursor-pointer"
onClick={()=>setSelectedDoctor(item.doctor)}
>
{item.doctor?.name}
</td>

<td className="p-4">

{meds.map((m:any,i:number)=>(
<div key={i} className="text-sm">
{m.name} ({m.dosage})
</div>
))}

</td>

<td className="p-4">
{new Date(item.createdAt).toLocaleDateString()}
</td>

<td className="p-4 flex gap-2">

<button
onClick={()=>setSelectedPrescription(item)}
className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
>
View
</button>

<button
onClick={()=>downloadPrescription(item)}
className="bg-green-500 text-white px-3 py-1 rounded text-sm"
>
Download
</button>

</td>

</tr>

)

})}

</tbody>

</table>

</div>

{/* VIEW MODAL */}

{selectedPrescription && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white p-6 rounded-xl w-[400px] relative">

<button
onClick={()=>setSelectedPrescription(null)}
className="absolute right-3 top-3"
>
✕
</button>

<h2 className="text-xl font-bold mb-4">
Prescription
</h2>

<p><b>Doctor:</b> {selectedPrescription.doctor?.name}</p>

<p className="mt-2"><b>Date:</b> {new Date(selectedPrescription.createdAt).toLocaleDateString()}</p>

<div className="mt-4">
<b>Medicines:</b>

<ul className="list-disc ml-5 mt-2">
{(Array.isArray(selectedPrescription.medicine)
? selectedPrescription.medicine
: [selectedPrescription.medicine]
).map((m:any,i:number)=>(
<li key={i}>{m.name} - {m.dosage}</li>
))}
</ul>

</div>

<p className="mt-4">
<b>Notes:</b> {selectedPrescription.notes || "-"}
</p>

<button
onClick={()=>downloadPrescription(selectedPrescription)}
className="mt-4 w-full bg-green-600 text-white py-2 rounded"
>
Download PDF
</button>

</div>

</div>

)}

{/* DOCTOR POPUP */}

{selectedDoctor && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white p-6 rounded-xl w-[350px] relative">

<button
onClick={()=>setSelectedDoctor(null)}
className="absolute right-3 top-3"
>
✕
</button>

<h2 className="text-xl font-bold mb-4">
Doctor Profile
</h2>

<p><b>Name:</b> {selectedDoctor?.name}</p>
<p><b>Specialization:</b> {selectedDoctor?.specialization}</p>
<p><b>Experience:</b> {selectedDoctor?.experience} years</p>

</div>

</div>

)}

</div>

)

}