"use client"

import { useEffect,useState } from "react"
import { User, Search, FileText, Printer, Calendar } from "lucide-react"
import { motion } from "framer-motion"

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
return <div className="p-10 text-center">Loading prescriptions...</div>
}



return(

<div className="max-w-7xl mx-auto px-4 py-10 space-y-8">

<h1 className="flex items-center gap-2 text-3xl font-bold">
<FileText size={26}/>
Doctor Prescriptions
</h1>



{/* SEARCH */}

<div className="relative w-full md:w-96">

<Search size={18} className="absolute left-3 top-3 text-gray-400"/>

<input
placeholder="Search patient..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="pl-10 pr-4 py-2 border rounded-lg w-full"
/>

</div>



{/* CARDS */}

<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

{filtered.map((p:any)=>(

<motion.div
key={p.id}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
whileHover={{y:-4}}
className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
>

{/* PATIENT */}

<div className="flex items-center gap-3 mb-4">

<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
<User size={18}/>
</div>

<div>

<p className="font-semibold">
{p.patient?.name}
</p>

<p className="text-xs text-gray-500">
Patient
</p>

</div>

</div>



{/* DATE */}

<div className="flex items-center gap-2 text-sm text-gray-600 mb-4">

<Calendar size={14}/>

{new Date(p.createdAt).toLocaleDateString()}

</div>



{/* MEDICINES */}

<div className="text-sm mb-4 space-y-1">

{Array.isArray(p.medicine)
? p.medicine.slice(0,2).map((m:any,i:number)=>(
<div key={i}>
{m.name} - {m.dosage}
</div>
))
: "-"}

{p.medicine?.length > 2 && (
<div className="text-gray-500 text-xs">
+{p.medicine.length - 2} more medicines
</div>
)}

</div>



{/* ACTIONS */}

<div className="flex gap-2">

<button
onClick={()=>setSelected(p)}
className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
>

<FileText size={14}/>
View

</button>

<button
onClick={()=>handlePrint(p)}
className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm"
>

<Printer size={14}/>
Print

</button>

</div>

</motion.div>

))}

</div>



{/* MODAL */}

{selected && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white p-6 rounded-xl w-[420px] shadow-xl">

<h2 className="text-xl font-bold mb-4 flex items-center gap-2">

<FileText size={18}/>

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
className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded text-sm"
>

<Printer size={14}/>
Print

</button>

<button
onClick={()=>setSelected(null)}
className="bg-gray-500 text-white px-4 py-2 rounded text-sm"
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