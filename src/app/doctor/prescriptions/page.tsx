"use client"

import { useEffect, useState } from "react"
import { User, Search, FileText, Printer, Calendar, Clock } from "lucide-react"
import { motion } from "framer-motion"
import jsPDF from "jspdf"

export default function DoctorPrescriptions(){

const [prescriptions,setPrescriptions] = useState<any[]>([])
const [filtered,setFiltered] = useState<any[]>([])
const [loading,setLoading] = useState(true)
const [selected,setSelected] = useState<any>(null)
const [search,setSearch] = useState("")

/* LOAD */
useEffect(()=>{
fetch("/api/prescriptions")
.then(res=>res.json())
.then(data=>{
setPrescriptions(data || [])
setFiltered(data || [])
setLoading(false)
})
},[])

/* 🔥 SMART SEARCH */
useEffect(()=>{

const s = search.toLowerCase()

const f = prescriptions.filter((p:any)=>{

const patient = p.patient?.name?.toLowerCase() || ""
const doctor = p.doctor?.name?.toLowerCase() || ""

const dateObj = new Date(p.createdAt)

const date = dateObj.toLocaleDateString().toLowerCase()
const time = dateObj.toLocaleTimeString().toLowerCase()
const day = dateObj.toLocaleDateString(undefined,{ weekday:"long" }).toLowerCase()

return (
  patient.includes(s) ||
  doctor.includes(s) ||
  date.includes(s) ||
  time.includes(s) ||
  day.includes(s)
)

})

setFiltered(f)

},[search,prescriptions])

/* FORMAT DATE */
const formatDate = (d:string)=>{
const date = new Date(d)
return {
date: date.toLocaleDateString(),
time: date.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
day: date.toLocaleDateString(undefined,{ weekday:"short" })
}
}

/* PRINT */
const handlePrint = (p:any)=>{
const w = window.open("", "", "width=700,height=700")

w?.document.write(`
<h2>Prescription</h2>
<p><b>Patient:</b> ${p.patient?.name}</p>
<p><b>Doctor:</b> Dr. ${p.doctor?.name}</p>
<p><b>Date:</b> ${new Date(p.createdAt).toLocaleString()}</p>

<h3>Medicines</h3>
<ul>
${p.medicine?.map((m:any)=>`<li>${m.name} - ${m.dosage} (${m.timing})</li>`).join("")}
</ul>
`)

w?.document.close()
w?.print()
}

/* PDF */
const handlePDF = (p:any)=>{
const doc = new jsPDF()

doc.setFontSize(18)
doc.text("City Care Hospital",105,20,{ align:"center" })

doc.setFontSize(10)
doc.text("Jaipur | +91 XXXXXXXX",105,26,{ align:"center" })

doc.line(20,30,190,30)

doc.text(`Patient: ${p.patient?.name}`,20,50)
doc.text(`Doctor: Dr. ${p.doctor?.name}`,20,58)
doc.text(`Date: ${new Date(p.createdAt).toLocaleString()}`,20,66)

let y = 80

p.medicine?.forEach((m:any,i:number)=>{
doc.text(`${i+1}. ${m.name} - ${m.dosage} (${m.timing})`,20,y)
y+=8
})

y+=20
doc.line(120,y,180,y)
doc.text("Doctor Signature",130,y+6)

doc.save(`Prescription-${p.patient?.name}.pdf`)
}

/* LOADING */
if(loading){
return <div className="p-6">Loading...</div>
}

return(

<div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

{/* HEADER */}
<h1 className="flex items-center gap-2 text-2xl font-bold">
<FileText size={22}/> Doctor Prescriptions
</h1>

{/* SEARCH */}
<div className="relative w-full sm:w-96">

<Search className="absolute left-3 top-3 text-gray-400" size={16}/>

<input
placeholder="Search patient, doctor, date, time..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="pl-9 pr-3 py-2 border rounded-lg w-full"
/>

</div>

{/* EMPTY */}
{filtered.length === 0 && (
<p className="text-gray-500 text-sm">
No prescriptions found
</p>
)}

{/* GRID */}
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

{filtered.map((p:any)=>{

const { date, time, day } = formatDate(p.createdAt)

return(

<motion.div
key={p.id}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
whileHover={{y:-4}}
className="bg-white rounded-2xl shadow p-5 space-y-3"
>

{/* TOP */}
<div className="flex items-center gap-3">

<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
<User size={16}/>
</div>

<div>
<p className="font-semibold">{p.patient?.name}</p>
<p className="text-xs text-gray-500">
Dr. {p.doctor?.name}
</p>
</div>

</div>

{/* DATE */}
<div className="flex items-center justify-between text-xs text-gray-500">

<div className="flex items-center gap-1">
<Calendar size={14}/> {date} ({day})
</div>

<div className="flex items-center gap-1">
<Clock size={14}/> {time}
</div>

</div>

{/* MEDS */}
<div className="text-sm space-y-1">

{p.medicine?.slice(0,2).map((m:any,i:number)=>(
<div key={i}>
{m.name} - {m.dosage}
</div>
))}

{p.medicine?.length > 2 && (
<div className="text-gray-500 text-xs">
+{p.medicine.length - 2} more
</div>
)}

</div>

{/* ACTIONS */}
<div className="flex gap-2 pt-2">

<button
onClick={()=>setSelected(p)}
className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
>
View
</button>

<button
onClick={()=>handlePrint(p)}
className="bg-green-600 text-white px-3 py-1 rounded text-sm"
>
Print
</button>

<button
onClick={()=>handlePDF(p)}
className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
>
PDF
</button>

</div>

</motion.div>

)

})}

</div>

{/* MODAL */}
{selected && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

<div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">

<h2 className="font-bold text-lg">Prescription</h2>

<p><b>Patient:</b> {selected.patient?.name}</p>
<p><b>Doctor:</b> Dr. {selected.doctor?.name}</p>
<p><b>Date:</b> {new Date(selected.createdAt).toLocaleString()}</p>

<ul className="text-sm space-y-1">
{selected.medicine?.map((m:any,i:number)=>(
<li key={i}>
{m.name} - {m.dosage} ({m.timing})
</li>
))}
</ul>

<div className="flex gap-2">

<button
onClick={()=>handlePrint(selected)}
className="bg-green-600 text-white px-3 py-2 rounded w-full"
>
Print
</button>

<button
onClick={()=>handlePDF(selected)}
className="bg-purple-600 text-white px-3 py-2 rounded w-full"
>
PDF
</button>

<button
onClick={()=>setSelected(null)}
className="bg-gray-500 text-white px-3 py-2 rounded w-full"
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