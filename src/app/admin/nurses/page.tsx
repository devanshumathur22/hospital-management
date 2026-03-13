"use client"

import { useEffect,useState } from "react"
import {
UserPlus,
User,
Mail,
Lock,
Phone,
Briefcase
} from "lucide-react"

export default function AdminNurses(){

const [nurses,setNurses] = useState<any[]>([])

const [form,setForm] = useState({
name:"",
email:"",
password:"",
phone:"",
department:"",
experience:""
})


/* FETCH NURSES */

useEffect(()=>{

fetch("/api/nurses")
.then(res=>res.json())
.then(setNurses)

},[])



/* ADD NURSE */

async function addNurse(){

if(!form.name || !form.email || !form.password){

alert("Name email password required")
return

}

const res = await fetch("/api/nurses",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(form)

})

const data = await res.json()

if(res.ok){

setNurses(prev=>[data,...prev])

setForm({
name:"",
email:"",
password:"",
phone:"",
department:"",
experience:""
})

}else{

alert(data.error)

}

}



return(

<div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

{/* ====================== */}
{/* ADD NURSE */}
{/* ====================== */}

<div className="bg-white border rounded-2xl p-8 shadow-sm">

<h1 className="flex items-center gap-2 text-2xl font-semibold mb-8">

<UserPlus size={22}/>

Add Nurse

</h1>



<div className="grid md:grid-cols-2 gap-5">


{/* NAME */}

<div className="space-y-1">

<label className="text-sm text-gray-500">
Nurse Name
</label>

<div className="flex items-center border rounded-lg px-3 h-11">

<User size={16} className="text-gray-400 mr-2"/>

<input
placeholder="Enter nurse name"
value={form.name}
onChange={(e)=>setForm({...form,name:e.target.value})}
className="flex-1 outline-none text-sm"
/>

</div>

</div>



{/* EMAIL */}

<div className="space-y-1">

<label className="text-sm text-gray-500">
Email
</label>

<div className="flex items-center border rounded-lg px-3 h-11">

<Mail size={16} className="text-gray-400 mr-2"/>

<input
placeholder="Enter email"
value={form.email}
onChange={(e)=>setForm({...form,email:e.target.value})}
className="flex-1 outline-none text-sm"
/>

</div>

</div>



{/* PASSWORD */}

<div className="space-y-1">

<label className="text-sm text-gray-500">
Login Password
</label>

<div className="flex items-center border rounded-lg px-3 h-11">

<Lock size={16} className="text-gray-400 mr-2"/>

<input
type="password"
placeholder="Create password"
value={form.password}
onChange={(e)=>setForm({...form,password:e.target.value})}
className="flex-1 outline-none text-sm"
/>

</div>

</div>



{/* PHONE */}

<div className="space-y-1">

<label className="text-sm text-gray-500">
Phone
</label>

<div className="flex items-center border rounded-lg px-3 h-11">

<Phone size={16} className="text-gray-400 mr-2"/>

<input
placeholder="Phone number"
value={form.phone}
onChange={(e)=>setForm({...form,phone:e.target.value})}
className="flex-1 outline-none text-sm"
/>

</div>

</div>



{/* DEPARTMENT */}

<div className="space-y-1">

<label className="text-sm text-gray-500">
Department
</label>

<div className="flex items-center border rounded-lg px-3 h-11">

<Briefcase size={16} className="text-gray-400 mr-2"/>

<input
placeholder="ICU / Ward"
value={form.department}
onChange={(e)=>setForm({...form,department:e.target.value})}
className="flex-1 outline-none text-sm"
/>

</div>

</div>



{/* EXPERIENCE */}

<div className="space-y-1">

<label className="text-sm text-gray-500">
Experience
</label>

<input
placeholder="Years of experience"
value={form.experience}
onChange={(e)=>setForm({...form,experience:e.target.value})}
className="border rounded-lg h-11 px-3 text-sm w-full"
/>

</div>

</div>



<button
onClick={addNurse}
className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
>

Add Nurse

</button>

</div>



{/* ====================== */}
{/* NURSE LIST */}
{/* ====================== */}

<div>

<h2 className="text-xl font-semibold mb-6">
Nurses
</h2>


<div className="grid md:grid-cols-2 gap-4">

{nurses.map(n=>(

<div
key={n.id}
className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
>

<p className="font-semibold">
{n.name}
</p>

<p className="text-sm text-gray-500">
{n.email}
</p>

<p className="text-sm text-gray-500 mt-1">
Dept: {n.department || "-"}
</p>

</div>

))}

</div>

</div>

</div>

)

}