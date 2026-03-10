"use client";

import { useEffect, useState } from "react";

export default function DoctorProfile(){

const [doctor,setDoctor] = useState<any>(null)

const [editing,setEditing] = useState(false)

const [form,setForm] = useState({
name:"",
specialization:"",
experience:"",
email:""
})

useEffect(()=>{

fetch("/api/doctors")
.then(res=>res.json())
.then(data=>{

setDoctor(data[0])

setForm({
name:data[0].name,
specialization:data[0].specialization,
experience:data[0].experience,
email:data[0].email
})

})

},[])

if(!doctor) return <div className="p-10">Loading...</div>


const handleChange = (e:any)=>{

setForm({
...form,
[e.target.name]:e.target.value
})

}


const saveProfile = async()=>{

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

}


return(

<div className="p-10 bg-gray-100 min-h-screen">

<div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8">

<h1 className="text-3xl font-bold mb-6">
Doctor Profile
</h1>

<div className="grid grid-cols-2 gap-6">

<div>
<label className="text-sm text-gray-500">Name</label>
<p className="font-medium">{doctor.name}</p>
</div>

<div>
<label className="text-sm text-gray-500">Specialization</label>
<p className="font-medium">{doctor.specialization}</p>
</div>

<div>
<label className="text-sm text-gray-500">Experience</label>
<p className="font-medium">{doctor.experience} years</p>
</div>

<div>
<label className="text-sm text-gray-500">Email</label>
<p className="font-medium">{doctor.email}</p>
</div>

</div>

<div className="mt-8">

<button
onClick={()=>setEditing(true)}
className="bg-blue-600 text-white px-6 py-3 rounded-lg"
>
Edit Profile
</button>

</div>

</div>



{/* EDIT MODAL */}

{editing && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-8 rounded-xl w-[400px]">

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
placeholder="Experience"
className="w-full border p-3 rounded mb-4"
/>

<input
name="email"
value={form.email}
onChange={handleChange}
placeholder="Email"
className="w-full border p-3 rounded mb-6"
/>


<div className="flex gap-3">

<button
onClick={saveProfile}
className="bg-green-600 text-white px-5 py-2 rounded"
>
Save
</button>

<button
onClick={()=>setEditing(false)}
className="bg-gray-400 text-white px-5 py-2 rounded"
>
Cancel
</button>

</div>

</div>

</div>

)}

</div>

)

}