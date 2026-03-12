"use client"

import { useEffect,useState } from "react"

export default function Patients(){

const [patients,setPatients] = useState<any[]>([])
const [search,setSearch] = useState("")
const [form,setForm] = useState({
name:"",
email:"",
phone:""
})

useEffect(()=>{

fetch("/api/patients")
.then(res=>res.json())
.then(setPatients)

},[])

const register = async(e:any)=>{

e.preventDefault()

await fetch("/api/patients",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify(form)
})

location.reload()

}

const filtered = patients.filter(p=>
p.name?.toLowerCase().includes(search.toLowerCase())
)

return(

<div className="space-y-10">

<h1 className="text-2xl font-bold">
Patients
</h1>

{/* Register */}

<form
onSubmit={register}
className="bg-white p-6 rounded-xl shadow space-y-4 max-w-md"
>

<input
placeholder="Name"
className="border p-3 w-full"
onChange={e=>setForm({...form,name:e.target.value})}
/>

<input
placeholder="Email"
className="border p-3 w-full"
onChange={e=>setForm({...form,email:e.target.value})}
/>

<input
placeholder="Phone"
className="border p-3 w-full"
onChange={e=>setForm({...form,phone:e.target.value})}
/>

<button className="bg-blue-600 text-white px-6 py-2 rounded">
Register
</button>

</form>

{/* Search */}

<input
placeholder="Search patient"
className="border p-3 w-full max-w-md"
onChange={e=>setSearch(e.target.value)}
/>

{/* List */}

<div className="bg-white rounded-xl shadow">

{filtered.map((p:any)=>(

<div
key={p.id}
className="p-4 border-b flex justify-between"
>

<span>{p.name}</span>
<span>{p.phone}</span>

</div>

))}

</div>

</div>

)

}