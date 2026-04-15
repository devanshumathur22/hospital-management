"use client"

import { useEffect,useState } from "react"
import { useParams } from "next/navigation"

export default function DoctorVitals(){

const params = useParams()
const patientId = params.id

const [vitals,setVitals] = useState<any[]>([])
const [loading,setLoading] = useState(true)
const [saving,setSaving] = useState(false)

/* 🔥 FORM */
const [form,setForm] = useState({
bp:"",
temperature:"",
pulse:"",
notes:""
})

/* 🔥 LOAD */
const loadVitals = ()=>{
fetch(`/api/vitals?patient=${patientId}`)
.then(res=>res.json())
.then(data=>setVitals(data || []))
.catch(()=>setVitals([]))
.finally(()=>setLoading(false))
}

useEffect(()=>{
loadVitals()
},[patientId])

/* 🔥 INPUT */
const handleChange = (e:any)=>{
setForm({
...form,
[e.target.name]:e.target.value
})
}

/* 🔥 SAVE */
const saveVitals = async()=>{

if(!form.bp || !form.temperature || !form.pulse){
alert("Fill required fields")
return
}

setSaving(true)

try{
await fetch("/api/vitals",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
patientId,
...form
})
})

setForm({
bp:"",
temperature:"",
pulse:"",
notes:""
})

loadVitals()

}catch(err){
console.log(err)
}finally{
setSaving(false)
}

}

/* 🔥 UI */
if(loading){
return <div className="p-6 text-sm">Loading vitals...</div>
}

return(

<div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">

{/* 🔥 TITLE */}
<h1 className="text-lg sm:text-xl md:text-2xl font-bold">
Patient Vitals
</h1>

{/* 🔥 ADD FORM */}
<div className="bg-white border rounded-xl p-4 shadow space-y-3">

<h2 className="font-semibold text-sm sm:text-base">
Add Vitals
</h2>

<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

<input
name="bp"
placeholder="BP"
value={form.bp}
onChange={handleChange}
className="border p-2 rounded text-sm"
/>

<input
name="temperature"
placeholder="Temp"
value={form.temperature}
onChange={handleChange}
className="border p-2 rounded text-sm"
/>

<input
name="pulse"
placeholder="Pulse"
value={form.pulse}
onChange={handleChange}
className="border p-2 rounded text-sm"
/>

<input
name="notes"
placeholder="Notes"
value={form.notes}
onChange={handleChange}
className="border p-2 rounded text-sm"
/>

</div>

<button
onClick={saveVitals}
disabled={saving}
className="bg-green-600 text-white px-4 py-2 rounded text-sm"
>
{saving ? "Saving..." : "Add Vitals"}
</button>

</div>

{/* ❌ Empty */}
{vitals.length === 0 && (
<p className="text-gray-500 text-sm">
No vitals added yet
</p>
)}

{/* 🔥 LIST */}
<div className="space-y-4">

{vitals.map(v=>(

<div
key={v.id}
className="bg-white border rounded-xl p-4 shadow-sm space-y-2"
>

<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">

<div>
<p className="text-gray-500">BP</p>
<p className="font-medium">{v.bp}</p>
</div>

<div>
<p className="text-gray-500">Temp</p>
<p className="font-medium">{v.temperature}°C</p>
</div>

<div>
<p className="text-gray-500">Pulse</p>
<p className="font-medium">{v.pulse}</p>
</div>

<div>
<p className="text-gray-500">Date</p>
<p className="font-medium">
{new Date(v.createdAt).toLocaleDateString()}
</p>
</div>

</div>

{v.notes && (
<p className="text-xs sm:text-sm text-gray-600 border-t pt-2">
<b>Notes:</b> {v.notes}
</p>
)}

</div>

))}

</div>

</div>

)
}