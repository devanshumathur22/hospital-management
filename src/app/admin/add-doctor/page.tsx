"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
User,
Mail,
Lock,
Stethoscope,
Briefcase,
Heart,
Brain,
Bone,
Sparkles,
Smile,
Baby,
Activity,
Scan
} from "lucide-react";

const specializations = [
{ name:"Cardiologist", icon:Heart },
{ name:"Neurologist", icon:Brain },
{ name:"Orthopedic", icon:Bone },
{ name:"Dermatologist", icon:Sparkles },
{ name:"Dentist", icon:Smile },
{ name:"Pediatrician", icon:Baby },
{ name:"Psychiatrist", icon:Activity },
{ name:"Radiologist", icon:Scan }
];

export default function AddDoctor(){

const [loading,setLoading] = useState(false)

const [form,setForm] = useState({
name:"",
email:"",
password:"",
specialization:"",
experience:""
})

const handleSubmit = async(e:any)=>{
e.preventDefault()

if(!form.name || !form.email || !form.password){
alert("Name, Email, Password required")
return
}

setLoading(true)

const res = await fetch("/api/doctors",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify(form)
})

const data = await res.json()

setLoading(false)

if(!res.ok){
alert(data.error || "Something went wrong")
return
}

alert("Doctor Added Successfully")

setForm({
name:"",
email:"",
password:"",
specialization:"",
experience:""
})

}

return(

<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6 sm:py-10">

<motion.div
initial={{opacity:0,y:30}}
animate={{opacity:1,y:0}}
className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-5 sm:p-8 border"
>

<h1 className="text-lg sm:text-2xl font-bold mb-6 sm:mb-8 flex items-center gap-2">
<Stethoscope size={20}/>
Add Doctor
</h1>

<form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

{/* NAME */}
<div>
<label className="text-xs sm:text-sm text-gray-500">Doctor Name</label>
<div className="relative mt-1">
<User size={16} className="absolute left-3 top-3 text-gray-400"/>
<input
value={form.name}
onChange={(e)=>setForm({...form,name:e.target.value})}
placeholder="Dr. John Smith"
className="w-full border rounded-lg p-2.5 sm:p-3 pl-9 sm:pl-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
/>
</div>
</div>

{/* EMAIL */}
<div>
<label className="text-xs sm:text-sm text-gray-500">Email</label>
<div className="relative mt-1">
<Mail size={16} className="absolute left-3 top-3 text-gray-400"/>
<input
type="email"
value={form.email}
onChange={(e)=>setForm({...form,email:e.target.value})}
placeholder="doctor@gmail.com"
className="w-full border rounded-lg p-2.5 sm:p-3 pl-9 sm:pl-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
/>
</div>
</div>

{/* PASSWORD */}
<div>
<label className="text-xs sm:text-sm text-gray-500">Password</label>
<div className="relative mt-1">
<Lock size={16} className="absolute left-3 top-3 text-gray-400"/>
<input
type="password"
value={form.password}
onChange={(e)=>setForm({...form,password:e.target.value})}
placeholder="Enter password"
className="w-full border rounded-lg p-2.5 sm:p-3 pl-9 sm:pl-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
/>
</div>
</div>

{/* SPECIALIZATION */}
<div>
<label className="text-xs sm:text-sm text-gray-500 mb-2 block">Specialization</label>

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">

{specializations.map((item,i)=>{
const Icon = item.icon

return(
<div
key={i}
onClick={()=>setForm({...form,specialization:item.name})}
className={`flex items-center gap-2 p-2.5 sm:p-3 border rounded-lg cursor-pointer transition text-xs sm:text-sm

${form.specialization===item.name
? "border-blue-500 bg-blue-50"
: "hover:bg-gray-50"
}`}
>
<Icon size={16} className="text-blue-600"/>
<span className="truncate">{item.name}</span>
</div>
)
})}

</div>

</div>

{/* EXPERIENCE */}
<div>
<label className="text-xs sm:text-sm text-gray-500">Experience (years)</label>
<div className="relative mt-1">
<Briefcase size={16} className="absolute left-3 top-3 text-gray-400"/>
<input
value={form.experience}
onChange={(e)=>setForm({...form,experience:e.target.value})}
placeholder="e.g. 5"
className="w-full border rounded-lg p-2.5 sm:p-3 pl-9 sm:pl-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
/>
</div>
</div>

{/* BUTTON */}
<motion.button
whileTap={{scale:0.96}}
disabled={loading}
className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition disabled:opacity-60"
>
{loading ? "Adding..." : "Add Doctor"}
</motion.button>

</form>

</motion.div>

</div>

)
}