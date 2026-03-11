"use client";

import { useEffect, useState } from "react";

export default function DoctorProfile(){

const [doctor,setDoctor] = useState<any>(null)
const [editing,setEditing] = useState(false)
const [loading,setLoading] = useState(true)

const [form,setForm] = useState({
name:"",
specialization:"",
experience:"",
email:""
})



useEffect(()=>{

const loadDoctor = async()=>{

try{

const res = await fetch("/api/doctors")
const data = await res.json()

if(data?.length){

setDoctor(data[0])

setForm({
name:data[0].name || "",
specialization:data[0].specialization || "",
experience:data[0].experience || "",
email:data[0].email || ""
})

}

}catch(err){

console.log("DOCTOR ERROR",err)

}

setLoading(false)

}

loadDoctor()

},[])



if(loading){
return <div className="p-10">Loading profile...</div>
}



if(!doctor){
return <div className="p-10">Doctor not found</div>
}



const handleChange = (e:any)=>{

setForm({
...form,
[e.target.name]:e.target.value
})

}



const saveProfile = async()=>{

try{

const res = await fetch(`/api/doctors/${doctor.id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(form)

})

const data = await res.json()

setDoctor(data)
setEditing(false)

}catch(err){

console.log("UPDATE ERROR",err)

}

}



return(

<div className="p-10 bg-gray-100 min-h-screen">



{/* PROFILE CARD */}

<div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8">

<h1 className="text-3xl font-bold mb-8">
Doctor Profile
</h1>



<div className="grid md:grid-cols-2 gap-6">

<div>

<p className="text-sm text-gray-500">
Name
</p>

<p className="font-semibold">
{doctor.name}
</p>

</div>



<div>

<p className="text-sm text-gray-500">
Specialization
</p>

<p className="font-semibold">
{doctor.specialization}
</p>

</div>



<div>

<p className="text-sm text-gray-500">
Experience
</p>

<p className="font-semibold">
{doctor.experience} years
</p>

</div>



<div>

<p className="text-sm text-gray-500">
Email
</p>

<p className="font-semibold">
{doctor.email}
</p>

</div>

</div>



<div className="mt-8">

<button
onClick={()=>setEditing(true)}
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
>
Edit Profile
</button>

</div>

</div>



{/* EDIT MODAL */}

{editing && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white p-8 rounded-xl w-[420px] shadow-xl">

<h2 className="text-xl font-bold mb-6">
Edit Doctor Profile
</h2>



<input
name="name"
value={form.name}
onChange={handleChange}
placeholder="Name"
className="w-full border p-3 rounded mb-4"
/>



<input
name="specialization"
value={form.specialization}
onChange={handleChange}
placeholder="Specialization"
className="w-full border p-3 rounded mb-4"
/>



<input
name="experience"
value={form.experience}
onChange={handleChange}
placeholder="Experience (years)"
className="w-full border p-3 rounded mb-4"
/>



<input
name="email"
value={form.email}
onChange={handleChange}
placeholder="Email"
className="w-full border p-3 rounded mb-6"
/>



<div className="flex justify-end gap-3">

<button
onClick={()=>setEditing(false)}
className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded"
>
Cancel
</button>

<button
onClick={saveProfile}
className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
>
Save
</button>

</div>

</div>

</div>

)}

</div>

)

}