"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
User,
Mail,
Stethoscope,
Award,
Edit,
Save,
X
} from "lucide-react"

export default function DoctorProfile(){

const [doctor,setDoctor] = useState<any>(null)
const [editing,setEditing] = useState(false)
const [loading,setLoading] = useState(true)
const [saving,setSaving] = useState(false)

const [form,setForm] = useState({
name:"",
specialization:"",
experience:""
})

useEffect(()=>{

const loadDoctor = async()=>{
try{
const res = await fetch("/api/auth/me",{ cache:"no-store",credentials:"include" })
const data = await res.json()

if(data?.user){
setDoctor(data.user)

setForm({
name:data.user.name || "",
specialization:data.user.specialization || "",
experience:data.user.experience || ""
})
}
}catch(err){
console.log(err)
}
setLoading(false)
}

loadDoctor()

},[])

const handleChange = (e:any)=>{
setForm({
...form,
[e.target.name]:e.target.value
})
}

/* 🔥 SAVE */
const saveProfile = async()=>{

setSaving(true)

try{
const res = await fetch(`/api/doctors/${doctor.id}`,{
method:"PUT",
headers:{ "Content-Type":"application/json", "credentials": "include" },
body:JSON.stringify(form)
})

const data = await res.json()

if(!res.ok){
alert(data.error || "Update failed")
return
}

setDoctor(data)
setEditing(false)

alert("Profile updated successfully ✅")

}catch(err){
console.log(err)
}finally{
setSaving(false)
}

}

/* 🔥 RESET */
const resetForm = ()=>{
setForm({
name:doctor.name,
specialization:doctor.specialization,
experience:doctor.experience
})
setEditing(false)
}

if(loading){
return <div className="p-6 text-sm">Loading profile...</div>
}

if(!doctor){
return <div className="p-6 text-sm">Doctor not found</div>
}

return(

<div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">

<motion.div
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
className="bg-white border rounded-2xl shadow p-4 sm:p-6 md:p-8 space-y-6"
>

{/* 🔥 HEADER */}
<div className="flex items-center gap-4">

<div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
{doctor.name?.charAt(0)}
</div>

<div>
<h1 className="text-lg sm:text-xl md:text-2xl font-bold">
Dr. {doctor.name}
</h1>
<p className="text-xs sm:text-sm text-gray-500">
Doctor Profile
</p>
</div>

</div>

{/* 🔥 INFO */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

<div className="flex items-center gap-3">
<Stethoscope size={16}/>
<div>
<p className="text-xs text-gray-500">Specialization</p>
<p className="font-medium text-sm sm:text-base">
{doctor.specialization || "-"}
</p>
</div>
</div>

<div className="flex items-center gap-3">
<Award size={16}/>
<div>
<p className="text-xs text-gray-500">Experience</p>
<p className="font-medium text-sm sm:text-base">
{doctor.experience || 0} years
</p>
</div>
</div>

<div className="flex items-center gap-3">
<Mail size={16}/>
<div>
<p className="text-xs text-gray-500">Email</p>
<p className="font-medium text-sm sm:text-base break-all">
{doctor.user?.email}
</p>
</div>
</div>

</div>

{/* 🔥 BUTTON */}
<button
onClick={()=>setEditing(true)}
className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm w-full sm:w-fit hover:bg-green-700"
>
<Edit size={14}/>
Edit Profile
</button>

</motion.div>

{/* 🔥 MODAL */}
{editing && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

<div className="bg-white p-5 rounded-xl w-full max-w-md shadow-xl">

<h2 className="text-lg font-bold mb-4">
Edit Profile
</h2>

<input
name="name"
value={form.name}
onChange={handleChange}
placeholder="Name"
className="w-full border p-3 rounded mb-3 text-sm"
/>

<input
name="specialization"
value={form.specialization}
onChange={handleChange}
placeholder="Specialization"
className="w-full border p-3 rounded mb-3 text-sm"
/>

<input
name="experience"
type="number"
value={form.experience}
onChange={handleChange}
placeholder="Experience"
className="w-full border p-3 rounded mb-4 text-sm"
/>

<div className="flex justify-end gap-2">

<button
onClick={resetForm}
className="bg-gray-400 text-white px-4 py-2 rounded text-sm"
>
Cancel
</button>

<button
onClick={saveProfile}
disabled={saving}
className="bg-green-600 text-white px-4 py-2 rounded text-sm flex items-center gap-1"
>
<Save size={14}/>
{saving ? "Saving..." : "Save"}
</button>

</div>

</div>

</div>

)}

</div>

)
}