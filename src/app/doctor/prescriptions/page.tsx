"use client"

import { useEffect,useState } from "react"

export default function DoctorPrescriptions(){

const [prescriptions,setPrescriptions] = useState<any[]>([])
const [loading,setLoading] = useState(true)
const [selected,setSelected] = useState<any>(null)

useEffect(()=>{

fetch("/api/prescriptions")
.then(res=>res.json())
.then(data=>{
setPrescriptions(data)
setLoading(false)
})

},[])

const handlePrint = (p:any)=>{

const printWindow = window.open("", "", "width=600,height=600")

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

<div className="p-8">

<h1 className="text-3xl font-bold mb-6">
Doctor Prescriptions
</h1>

<div className="bg-white shadow rounded-xl overflow-hidden">

<table className="w-full">

<thead className="bg-gray-100">

<tr>
<th className="p-4 text-left">Patient</th>
<th className="p-4 text-left">Medicine</th>
<th className="p-4 text-left">Date</th>
<th className="p-4 text-left">Actions</th>
</tr>

</thead>

<tbody>

{prescriptions.length === 0 && (

<tr>
<td colSpan={4} className="p-6 text-center text-gray-500">
No prescriptions yet
</td>
</tr>

)}

{prescriptions.map((p:any)=>(

<tr key={p.id} className="border-t">

<td className="p-4">
{p.patient?.name}
</td>

<td className="p-4">

{Array.isArray(p.medicine)

? p.medicine.map((m:any,i:number)=>(
<div key={i}>
{m.name} - {m.dosage} ({m.timing})
</div>
))

: "-"}

</td>

<td className="p-4">
{new Date(p.createdAt).toLocaleDateString()}
</td>

<td className="p-4 flex gap-2">

<button
onClick={()=>setSelected(p)}
className="bg-blue-600 text-white px-3 py-1 rounded"
>
View
</button>

<button
onClick={()=>handlePrint(p)}
className="bg-green-600 text-white px-3 py-1 rounded"
>
Print
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>



{/* VIEW MODAL */}

{selected && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-6 rounded-xl w-[400px]">

<h2 className="text-xl font-bold mb-4">
Prescription
</h2>

<p className="mb-2">
<b>Patient:</b> {selected.patient?.name}
</p>

<p className="mb-4">
<b>Date:</b> {new Date(selected.createdAt).toLocaleDateString()}
</p>

<h3 className="font-semibold mb-2">
Medicines
</h3>

<ul className="mb-4">

{selected.medicine?.map((m:any,i:number)=>(
<li key={i}>
{m.name} - {m.dosage} ({m.timing})
</li>
))}

</ul>

<button
onClick={()=>setSelected(null)}
className="bg-gray-500 text-white px-4 py-2 rounded"
>
Close
</button>

</div>

</div>

)}

</div>

)

}