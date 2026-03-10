"use client"

import { useEffect, useState } from "react"

export default function PatientPrescriptions(){

const [prescriptions,setPrescriptions] = useState<any[]>([])
const [loading,setLoading] = useState(true)

useEffect(()=>{

fetch("/api/prescriptions")
.then(res=>res.json())
.then(data=>{
setPrescriptions(data)
setLoading(false)
})

},[])

if(loading){
return <div className="p-6">Loading prescriptions...</div>
}

return(

<div className="p-6">

<h1 className="text-3xl font-bold mb-6">
Prescriptions
</h1>

<div className="bg-white shadow-md rounded-xl overflow-hidden">

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

{prescriptions.length === 0 && (

<tr>
<td colSpan={4} className="p-6 text-center text-gray-500">
No prescriptions yet
</td>
</tr>

)}

{prescriptions.map((item:any)=>{

let medicineText = "-"

/* medicine object */

if(item.medicine && typeof item.medicine === "object" && !Array.isArray(item.medicine)){
medicineText = `${item.medicine.name} - ${item.medicine.dosage} (${item.medicine.timing})`
}

/* medicine array */

if(Array.isArray(item.medicine)){
medicineText = item.medicine
.map((m:any)=>`${m.name} - ${m.dosage} (${m.timing})`)
.join(", ")
}

return(

<tr key={item.id} className="border-t">

<td className="p-4">
{item.doctor?.name || "Doctor"}
</td>

<td className="p-4">
{medicineText}
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

</div>

)

}