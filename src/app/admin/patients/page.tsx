"use client";

import { useEffect,useState } from "react";
import { User, Mail, Phone, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPatients(){

const [patients,setPatients] = useState<any[]>([])
const [filtered,setFiltered] = useState<any[]>([])
const [loading,setLoading] = useState(true)
const [search,setSearch] = useState("")

useEffect(()=>{

const fetchPatients = async()=>{

try{

const res = await fetch("/api/patients")
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



useEffect(()=>{

const f = patients.filter((p:any)=>
p.name?.toLowerCase().includes(search.toLowerCase())
)

setFiltered(f)

},[search,patients])



const deletePatient = async(id:string)=>{

if(!confirm("Delete this patient?")) return

await fetch(`/api/patients/${id}`,{
method:"DELETE"
})

setPatients(prev =>
prev.filter(p => p.id !== id)
)

}



if(loading){
return <div className="p-10 text-center">Loading patients...</div>
}



return(

<div className="max-w-7xl mx-auto px-4 py-10">

{/* HEADER */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

<h1 className="flex items-center gap-2 text-3xl font-bold">

<User size={26}/>

Patients

</h1>



{/* SEARCH */}

<div className="relative w-full md:w-96">

<Search
size={18}
className="absolute left-3 top-3 text-gray-400"
/>

<input
placeholder="Search patient..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="pl-10 pr-4 py-2 border rounded-lg w-full"
/>

</div>

</div>



{/* GRID */}

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

<div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">

<User size={20}/>

</div>

<div>

<p className="font-semibold">
{p.name}
</p>

<p className="text-xs text-gray-500">
Patient
</p>

</div>

</div>



{/* INFO */}

<div className="space-y-2 text-sm text-gray-600 mb-4">

<div className="flex items-center gap-2">
<Mail size={14}/>
{p.email}
</div>

<div className="flex items-center gap-2">
<Phone size={14}/>
{p.phone}
</div>

<div>
Age: {p.age}
</div>

</div>



{/* ACTION */}

<button
onClick={()=>deletePatient(p.id)}
className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
>

<Trash2 size={14}/>

Delete

</button>

</motion.div>

))}

</div>

</div>

)

}