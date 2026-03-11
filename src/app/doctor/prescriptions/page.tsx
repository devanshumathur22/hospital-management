"use client"

import { useEffect,useState } from "react"

export default function DoctorPrescriptions(){

const [prescriptions,setPrescriptions] = useState<any[]>([])
const [filtered,setFiltered] = useState<any[]>([])
const [loading,setLoading] = useState(true)
const [selected,setSelected] = useState<any>(null)
const [search,setSearch] = useState("")



useEffect(()=>{

fetch("/api/prescriptions")
.then(res=>res.json())
.then(data=>{
setPrescriptions(data || [])
setFiltered(data || [])
setLoading(false)
})

},[])



useEffect(()=>{

const f = prescriptions.filter((p:any)=>
p.patient?.name?.toLowerCase().includes(search.toLowerCase())
)

setFiltered(f)

},[search,prescriptions])



const handlePrint = (p:any)=>{

const printWindow = window.open("", "", "width=700,height=700")

printWindow?.document.write(`
<h2>Prescription</h2>

<p><b>Patient:</b> ${p.patient?.name}</p>
<p><b>Date:</b> ${new Date(p.createdAt).toLocaleDateString()}</p>

<h3>Medicines</h3>

<ul>
${p.medicine?.map((m:any)=>`<li>${m.name} - ${m.dosage} (${m.timing})</li>`).join("")}
</ul>

`)

printWindow?.document.close()
printWindow?.print()

}



if(loading){
return <div className="p-8">Loading prescriptions...</div>
}



return(

<div className="p-8 space-y-6">

{/* TITLE */}

<h1 className="text-3xl font-bold text-gray-800">
Doctor Prescriptions
</h1>



{/* SEARCH */}

<input
type="text"
placeholder="Search patient..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border px-4 py-2 rounded-lg w-full md:w-80"
/>



{/* TABLE */}

<div className="bg-white shadow rounded-xl overflow-hidden">

{filtered.length === 0 && (

<div className="p-10 text-center text-gray-500">
No prescriptions yet
</div>

)}



{filtered.length > 0 && (

<div className="overflow-x-auto">

<table className="w-full">

<thead className="bg-gray-100 text-sm text-gray-600">

<tr>

<th className="p-4 text-left">Patient</th>
<th className="p-4 text-left">Medicines</th>
<th className="p-4 text-left">Date</th>
<th className="p-4 text-left">Actions</th>

</tr>

</thead>



<tbody>

{filtered.map((p:any)=>(

<tr key={p.id} className="border-t hover:bg-gray-50">

<td className="p-4 font-medium">
{p.patient?.name}
</td>



<td className="p-4 text-sm">

{Array.isArray(p.medicine)

? p.medicine.slice(0,2).map((m:any,i:number)=>(
<div key={i}>
{m.name} - {m.dosage}
</div>
))

: "-"}

{p.medicine?.length > 2 && (
<div className="text-gray-500 text-xs">
+{p.medicine.length - 2} more
</div>
)}

</td>



<td className="p-4 text-sm">
{new Date(p.createdAt).toLocaleDateString()}
</td>



<td className="p-4 flex gap-2">

<button
onClick={()=>setSelected(p)}
className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
>
View
</button>

<button
onClick={()=>handlePrint(p)}
className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
>
Print
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

)}

</div>



{/* MODAL */}

{selected && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white p-6 rounded-xl w-[420px] shadow-xl">

<h2 className="text-xl font-bold mb-4">
Prescription
</h2>



<p className="mb-2 text-sm">
<b>Patient:</b> {selected.patient?.name}
</p>

<p className="mb-4 text-sm">
<b>Date:</b> {new Date(selected.createdAt).toLocaleDateString()}
</p>



<h3 className="font-semibold mb-2">
Medicines
</h3>

<ul className="space-y-1 text-sm mb-4">

{selected.medicine?.map((m:any,i:number)=>(
<li key={i}>
{m.name} - {m.dosage} ({m.timing})
</li>
))}

</ul>



<div className="flex justify-end gap-2">

<button
onClick={()=>handlePrint(selected)}
className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
>
Print
</button>

<button
onClick={()=>setSelected(null)}
className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
>
Close
</button>

</div>

</div>

</div>

)}

</div>

)

}