"use client"

import { useEffect, useState } from "react"
import { User, Search, FileText, Printer, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import jsPDF from "jspdf"

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

/* 🔥 PRINT */
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

/* 🔥 PDF */
const handlePDF = (p:any)=>{

const doc = new jsPDF()

doc.setFontSize(18)
doc.text("City Care Hospital",105,20,{ align:"center" })

doc.setFontSize(10)
doc.text("MG Road Jaipur | +91 9876543210",105,26,{ align:"center" })

doc.line(20,30,190,30)

doc.setFontSize(12)

doc.text(`Patient: ${p.patient?.name}`,20,50)
doc.text(`Date: ${new Date(p.createdAt).toLocaleDateString()}`,140,50)

let y = 70

doc.text("Medicines",20,y)

y += 10

p.medicine?.forEach((m:any,index:number)=>{

doc.text(`${index+1}. ${m.name} - ${m.dosage} (${m.timing})`,20,y)
y += 8

})

y += 20
doc.line(120,y,180,y)
doc.text("Doctor Signature",130,y+6)

doc.save(`Prescription-${p.patient?.name}.pdf`)
}

if(loading){
return <div className="p-6 text-sm">Loading prescriptions...</div>
}

return(

<div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">

<h1 className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold">
<FileText size={20}/>
Doctor Prescriptions
</h1>

{/* SEARCH */}
<div className="relative w-full sm:w-80">

<Search size={16} className="absolute left-3 top-2.5 text-gray-400"/>

<input
placeholder="Search patient..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="pl-9 pr-3 py-2 text-sm border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

</div>

{filtered.length === 0 && (
<p className="text-gray-500 text-sm">
No prescriptions found
</p>
)}

{/* CARDS */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">

{filtered.map((p:any)=>(

<motion.div
key={p.id}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
whileHover={{y:-4}}
className="bg-white border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition space-y-3"
>

<div className="flex items-center gap-3">

<div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
<User size={16}/>
</div>

<div>
<p className="font-semibold text-sm sm:text-base truncate">
{p.patient?.name || "Unknown"}
</p>
<p className="text-xs text-gray-500">Patient</p>
</div>

</div>

<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
<Calendar size={14}/>
{new Date(p.createdAt).toLocaleDateString()}
</div>

<div className="text-xs sm:text-sm space-y-1">

{Array.isArray(p.medicine)
? p.medicine.slice(0,2).map((m:any,i:number)=>(
<div key={i} className="truncate">
{m.name} - {m.dosage}
</div>
))
: "-"}

{p.medicine?.length > 2 && (
<div className="text-gray-500 text-xs">
+{p.medicine.length - 2} more
</div>
)}

</div>

<div className="flex flex-wrap gap-2 pt-2">

<button
onClick={()=>setSelected(p)}
className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm"
>
<FileText size={14}/>
View
</button>

<button
onClick={()=>handlePrint(p)}
className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm"
>
<Printer size={14}/>
Print
</button>

<button
onClick={()=>handlePDF(p)}
className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm"
>
<FileText size={14}/>
PDF
</button>

</div>

</motion.div>

))}

</div>

{/* MODAL */}
{selected && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

<div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-md shadow-xl">

<h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
<FileText size={16}/>
Prescription
</h2>

<p className="mb-2 text-xs sm:text-sm">
<b>Patient:</b> {selected.patient?.name}
</p>

<p className="mb-4 text-xs sm:text-sm">
<b>Date:</b> {new Date(selected.createdAt).toLocaleDateString()}
</p>

<h3 className="font-semibold mb-2 text-sm">
Medicines
</h3>

<ul className="space-y-1 text-xs sm:text-sm mb-4">

{selected.medicine?.map((m:any,i:number)=>(
<li key={i}>
{m.name} - {m.dosage} ({m.timing})
</li>
))}

</ul>

<div className="flex flex-col sm:flex-row justify-end gap-2">

<button
onClick={()=>handlePrint(selected)}
className="bg-green-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
>
Print
</button>

<button
onClick={()=>handlePDF(selected)}
className="bg-purple-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
>
PDF
</button>

<button
onClick={()=>setSelected(null)}
className="bg-gray-500 text-white px-4 py-2 rounded text-xs sm:text-sm"
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