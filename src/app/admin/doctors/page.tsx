"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Stethoscope, Trash2, Edit, Plus, Search } from "lucide-react";

export default function AdminDoctors() {

const [doctors,setDoctors] = useState<any[]>([])
const [search,setSearch] = useState("")

/* FETCH DOCTORS */

useEffect(()=>{

fetch("/api/doctors")
.then(res=>res.json())
.then(data=>{
setDoctors(data || [])
})

},[])



/* DELETE DOCTOR */

const deleteDoctor = async(id:string)=>{

const confirmDelete = confirm("Delete this doctor?")

if(!confirmDelete) return

try{

const res = await fetch(`/api/doctors/${id}`,{
method:"DELETE"
})

if(!res.ok){
throw new Error("Delete failed")
}

setDoctors(prev=>prev.filter(doc=>doc.id !== id))

}catch(err){
console.log("DELETE ERROR",err)
}

}



/* SEARCH FILTER */

const filteredDoctors = doctors.filter((d:any)=>
d.name?.toLowerCase().includes(search.toLowerCase())
)



/* GROUP BY SPECIALIZATION */

const grouped = filteredDoctors.reduce((acc:any,doc:any)=>{

if(!acc[doc.specialization]){
acc[doc.specialization] = []
}

acc[doc.specialization].push(doc)

return acc

},{})



return(

<div className="max-w-7xl mx-auto px-4 py-10">

{/* HEADER */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

<h1 className="flex items-center gap-2 text-3xl font-bold">
<Stethoscope size={26}/>
Doctors
</h1>



<div className="flex gap-4">

<div className="relative">

<Search size={18} className="absolute left-3 top-2.5 text-gray-400"/>

<input
placeholder="Search doctor..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="pl-9 pr-4 py-2 border rounded-lg"
/>

</div>



<Link
href="/admin/add-doctor"
className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
>

<Plus size={16}/>
Add Doctor

</Link>

</div>

</div>



{/* CATEGORY SECTIONS */}

{Object.entries(grouped).map(([specialization,docs]:any)=>(

<div key={specialization} className="mb-12">

<h2 className="text-xl font-semibold mb-6 flex items-center gap-2">

<Stethoscope size={18}/>
{specialization}

</h2>



<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

{docs.map((doctor:any)=>(

<div
key={doctor.id}
className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
>

{/* DOCTOR */}

<div className="flex items-center gap-3 mb-4">

<div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">

<User size={20}/>

</div>

<div>

<p className="font-semibold">
{doctor.name}
</p>

<p className="text-xs text-gray-500">
Doctor
</p>

</div>

</div>



{/* SPECIALIZATION */}

<div className="text-sm mb-2">

<span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
{doctor.specialization}
</span>

</div>



{/* EXPERIENCE */}

<p className="text-sm text-gray-600 mb-4">
{doctor.experience} years experience
</p>



{/* ACTIONS */}

<div className="flex gap-3">

<Link
href={`/admin/edit-doctor/${doctor.id}`}
className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
>

<Edit size={14}/>
Edit

</Link>

<button
onClick={()=>deleteDoctor(doctor.id)}
className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
>

<Trash2 size={14}/>
Delete

</button>

</div>

</div>

))}

</div>

</div>

))}

</div>

)

}