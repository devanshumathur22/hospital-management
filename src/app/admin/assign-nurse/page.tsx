"use client"

import { useEffect,useState } from "react"
import { Search, User, Stethoscope } from "lucide-react"

export default function AssignNurse(){

const [doctors,setDoctors] = useState<any[]>([])
const [nurses,setNurses] = useState<any[]>([])
const [search,setSearch] = useState("")

useEffect(()=>{

fetch("/api/doctors")
.then(res=>res.json())
.then(setDoctors)

fetch("/api/nurses")
.then(res=>res.json())
.then(setNurses)

},[])



async function assign(doctorId:string,nurseId:string){

await fetch("/api/admin/assign-nurse",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
doctorId,
nurseId
})

})

alert("Nurse Assigned")

}



/* SEARCH */

const filteredNurses = nurses.filter(n =>
n.name?.toLowerCase().includes(search.toLowerCase())
)



return(

<div className="max-w-4xl mx-auto p-6 space-y-8">

<h1 className="text-2xl font-bold">
Assign Nurse To Doctor
</h1>



{/* SEARCH NURSE */}

<div className="relative max-w-sm">

<Search size={16} className="absolute left-3 top-3 text-gray-400"/>

<input
placeholder="Search nurse..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border rounded-lg pl-9 pr-3 h-10 w-full"
/>

</div>



{/* DOCTOR LIST */}

<div className="space-y-4">

{doctors.map(d=>(

<div
key={d.id}
className="flex items-center justify-between bg-white border p-4 rounded-xl shadow-sm"
>

{/* DOCTOR */}

<div className="flex items-center gap-2">

<Stethoscope size={16}/>

<p className="font-medium">
{d.name}
</p>

</div>



{/* NURSE SELECT */}

<select
onChange={(e)=>assign(d.id,e.target.value)}
className="border rounded-lg h-9 px-3"
>

<option>Select Nurse</option>

{filteredNurses.map(n=>(
<option key={n.id} value={n.id}>
{n.name}
</option>
))}

</select>

</div>

))}

</div>

</div>

)

}