"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Phone, Search } from "lucide-react"
import { motion } from "framer-motion"

export default function NursePatients(){

const router = useRouter()

const [patients,setPatients] = useState<any[]>([])
const [search,setSearch] = useState("")

useEffect(()=>{

fetch("/api/patients")
.then(res=>res.json())
.then(data=>{
if(Array.isArray(data)){
setPatients(data)
}else{
setPatients([])
}
})

},[])

const filtered = patients.filter(p =>
p.name?.toLowerCase().includes(search.toLowerCase())
)

return(

<div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

<h1 className="text-2xl font-semibold">
Patients
</h1>

<div className="relative max-w-sm">
<Search size={16} className="absolute left-3 top-3 text-gray-400"/>

<input
placeholder="Search patient..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border rounded-lg h-10 pl-9 pr-3 w-full"
/>
</div>

<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

{filtered.map((p:any)=>(

<motion.div
key={p.id}
onClick={()=>router.push(`/nurse/vitals/${p.id}`)}  // ✅ FIX
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
whileHover={{y:-4}}
className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition cursor-pointer"
>

<div className="flex items-center gap-2 mb-2">
<User size={16}/>
<p className="font-medium">{p.name}</p>
</div>

<div className="flex items-center gap-2 text-sm text-gray-500">
<Phone size={14}/>
{p.phone || "-"}
</div>

</motion.div>

))}

</div>

{filtered.length === 0 && (
<p className="text-gray-500">
No patients found
</p>
)}

</div>
)
}