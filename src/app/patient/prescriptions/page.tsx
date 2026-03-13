"use client"

import { useEffect, useState } from "react"

export default function PatientPrescriptions(){

const [prescriptions,setPrescriptions] = useState<any[]>([])
const [loading,setLoading] = useState(true)

const [search,setSearch] = useState("")
const [dateFilter,setDateFilter] = useState("")
const [selectedDoctor,setSelectedDoctor] = useState<any>(null)

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



function downloadPDF(){

const content = document.getElementById("prescription-table")

const win = window.open("", "", "width=900,height=700")

if(win && content){

win.document.write(`
<html>
<head>
<title>Prescriptions</title>
<style>
body{font-family:sans-serif;padding:20px}
table{width:100%;border-collapse:collapse}
td,th{border:1px solid #ddd;padding:8px}
</style>
</head>
<body>
${content.innerHTML}
</body>
</html>
`)

win.document.close()
win.print()

}

}



if(loading){
return <div className="p-10 text-center">Loading prescriptions...</div>
}



return(

<div className="max-w-6xl mx-auto px-4 py-10">

<h1 className="text-3xl font-bold mb-8">
Prescriptions
</h1>



{/* SEARCH + FILTER */}

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

<button
onClick={downloadPDF}
className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
>
Download PDF
</button>

</div>



{/* DESKTOP TABLE */}

<div id="prescription-table" className="hidden md:block bg-white rounded-xl shadow overflow-hidden">

<table className="w-full text-left">

<thead className="bg-gray-100">
<tr>
<th className="p-4">Doctor</th>
<th className="p-4">Medicine</th>
<th className="p-4">Notes</th>
<th className="p-4">Date</th>
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
className="p-4 font-medium cursor-pointer text-blue-600"
onClick={()=>setSelectedDoctor(item.doctor)}
>
{item.doctor?.name || "Doctor"}
</td>

<td className="p-4 flex flex-wrap gap-2">

{meds.map((m:any,i:number)=>(
<span
key={i}
className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
>
{m.name} {m.dosage}
</span>
))}

</td>

<td className="p-4">
{item.notes || "-"}
</td>

<td className="p-4">
{new Date(item.createdAt).toLocaleDateString()}
</td>

</tr>

)

})}

</tbody>

</table>

</div>



{/* MOBILE CARD VIEW */}

<div className="md:hidden flex flex-col gap-4">

{filtered.map((item:any)=>{

let meds:any[] = []

if(Array.isArray(item.medicine)){
meds = item.medicine
}else if(item.medicine){
meds = [item.medicine]
}

return(

<div key={item.id} className="bg-white p-4 rounded-xl shadow">

<div
className="font-semibold text-blue-600 cursor-pointer"
onClick={()=>setSelectedDoctor(item.doctor)}
>
{item.doctor?.name || "Doctor"}
</div>

<div className="flex flex-wrap gap-2 mt-2">

{meds.map((m:any,i:number)=>(
<span
key={i}
className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
>
{m.name}
</span>
))}

</div>

<div className="text-sm text-gray-500 mt-2">
{item.notes}
</div>

<div className="text-xs text-gray-400 mt-1">
{new Date(item.createdAt).toLocaleDateString()}
</div>

</div>

)

})}

</div>



{/* DOCTOR POPUP */}

{selectedDoctor && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white p-6 rounded-xl w-[350px] relative">

<button
onClick={()=>setSelectedDoctor(null)}
className="absolute right-3 top-3 text-gray-500"
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