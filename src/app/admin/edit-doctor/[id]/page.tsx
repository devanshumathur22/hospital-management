"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function EditDoctor() {

const params = useParams();
const router = useRouter();

const [doctor,setDoctor] = useState({
name:"",
specialization:"",
experience:""
})

const [loading,setLoading] = useState(true)
const [saving,setSaving] = useState(false)

/* FETCH SINGLE DOCTOR (OPTIMIZED) */
useEffect(()=>{

if(!params?.id) return

fetch(`/api/doctors/${params.id}`)
.then(res=>res.json())
.then(data=>{
if(data){
setDoctor({
name:data.name || "",
specialization:data.specialization || "",
experience:data.experience || ""
})
}
})
.catch(()=>{})
.finally(()=>setLoading(false))

},[params.id])

/* UPDATE */
const updateDoctor = async (e:any)=>{

e.preventDefault()

setSaving(true)

await fetch(`/api/doctors/${params.id}`,{
method:"PUT",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
...doctor,
experience:Number(doctor.experience)
})
})

setSaving(false)

alert("Doctor updated")

router.push("/admin/doctors")

}

/* LOADING */
if(loading){
return(
<div className="flex items-center justify-center min-h-screen text-sm">
Loading doctor...
</div>
)
}

return(

<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6 sm:py-10">

<div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-5 sm:p-8 border space-y-6">

{/* BACK */}
<button
onClick={()=>router.back()}
className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
>
<ArrowLeft size={14}/>
Back
</button>

{/* TITLE */}
<h1 className="text-lg sm:text-2xl font-bold">
Edit Doctor
</h1>

{/* FORM */}
<form onSubmit={updateDoctor} className="space-y-5">

{/* NAME */}
<div>
<label className="text-xs sm:text-sm text-gray-500">
Doctor Name
</label>
<input
className="w-full border rounded-lg p-2.5 sm:p-3 mt-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
value={doctor.name}
onChange={(e)=>setDoctor({...doctor,name:e.target.value})}
/>
</div>

{/* SPECIALIZATION */}
<div>
<label className="text-xs sm:text-sm text-gray-500">
Specialization
</label>
<input
className="w-full border rounded-lg p-2.5 sm:p-3 mt-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
value={doctor.specialization}
onChange={(e)=>setDoctor({...doctor,specialization:e.target.value})}
/>
</div>

{/* EXPERIENCE */}
<div>
<label className="text-xs sm:text-sm text-gray-500">
Experience (years)
</label>
<input
type="number"
className="w-full border rounded-lg p-2.5 sm:p-3 mt-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
value={doctor.experience}
onChange={(e)=>setDoctor({...doctor,experience:e.target.value})}
/>
</div>

{/* BUTTON */}
<button
disabled={saving}
className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition disabled:opacity-60"
>
{saving ? "Updating..." : "Update Doctor"}
</button>

</form>

</div>

</div>

)
}