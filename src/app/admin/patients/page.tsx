"use client";

import { useEffect,useState } from "react";
import { User, Mail, Phone, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPatients(){

const [patients,setPatients] = useState<any[]>([])
const [filtered,setFiltered] = useState<any[]>([])
const [loading,setLoading] = useState(true)
const [search,setSearch] = useState("")

/* 🔥 GET SEARCH PARAM SAFELY */
useEffect(()=>{
const params = new URLSearchParams(window.location.search)
const q = params.get("search") || ""
setSearch(q)
},[])

/* FETCH */
useEffect(()=>{

const fetchPatients = async()=>{

try{
const res = await fetch("/api/patients",{ credentials:"include" })
const data = await res.json()

setPatients(data || [])
setFiltered(data || [])

}catch(err){
console.log("Fetch error:",err)
}

setLoading(false)

}

fetchPatients()

},[])

/* 🔥 SEARCH FIX (name + phone + MRN) */
useEffect(()=>{

const q = search.toLowerCase()

const f = patients.filter((p:any)=>
p.name?.toLowerCase().includes(q) ||
p.phone?.toLowerCase().includes(q) ||
p.mrn?.toLowerCase().includes(q)
)

setFiltered(f)

},[search,patients])

/* DELETE */
const deletePatient = async(id:string)=>{

if(!confirm("Delete this patient?")) return

const res = await fetch(`/api/patients/${id}`,{
method:"DELETE",
credentials:"include"
})

if(res.ok){
setPatients(prev => prev.filter(p => p.id !== id))
}else{
alert("Delete failed")
}

}

/* LOADING */
if(loading){
return(
<div className="flex items-center justify-center min-h-screen text-sm">
Loading patients...
</div>
)
}

return(

<div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">

{/* HEADER */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

<h1 className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold">
<User size={22}/>
Patients
</h1>

{/* SEARCH */}
<div className="relative w-full sm:w-80">

<Search size={16} className="absolute left-3 top-2.5 text-gray-400"/>

<input
placeholder="Search by name / phone / MRN"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="pl-9 pr-3 py-2 text-sm border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

</div>

</div>

{/* EMPTY */}
{filtered.length === 0 && (
<p className="text-sm text-gray-500">
No patients found
</p>
)}

{/* GRID */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">

{filtered.map((p:any)=>(

<motion.div
key={p.id}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
whileHover={{y:-4}}
className="bg-white border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition space-y-3"
>

{/* PATIENT */}
<div className="flex items-center gap-3">

<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
<User size={16}/>
</div>

<div>
<p className="font-semibold text-sm truncate">
{p.name}
</p>
<p className="text-xs text-gray-500">
Patient
</p>
</div>

</div>

{/* INFO */}
<div className="space-y-1 text-xs sm:text-sm text-gray-600">

{/* 🔥 MRN */}
<p className="text-xs text-blue-600 font-medium">
MRN: {p.mrn}
</p>

<div className="flex items-center gap-2 truncate">
<Mail size={13}/>
<span className="truncate">{p.user?.email || "No email"}</span>
</div>

<div className="flex items-center gap-2">
<Phone size={13}/>
{p.phone || "No phone"}
</div>

<div>
Age: {p.age || "-"}
</div>

</div>

{/* ACTION */}
<button
onClick={()=>deletePatient(p.id)}
className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs sm:text-sm pt-1"
>
<Trash2 size={13}/>
Delete
</button>

</motion.div>

))}

</div>

</div>

)
}