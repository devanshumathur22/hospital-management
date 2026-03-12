"use client"

import { useEffect,useState } from "react"

export default function Appointments(){

const [doctors,setDoctors] = useState<any[]>([])
const [patients,setPatients] = useState<any[]>([])

const [form,setForm] = useState({
doctorId:"",
patientId:"",
date:"",
time:""
})

useEffect(()=>{

fetch("/api/doctors")
.then(res=>res.json())
.then(setDoctors)

fetch("/api/patients")
.then(res=>res.json())
.then(setPatients)

},[])

const book = async(e:any)=>{

e.preventDefault()

await fetch("/api/appointments",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify(form)
})

alert("Appointment booked")

}

return(

<div className="space-y-8">

<h1 className="text-2xl font-bold">
Book Appointment
</h1>

<form
onSubmit={book}
className="bg-white p-6 rounded-xl shadow space-y-4 max-w-md"
>

<select
className="border p-3 w-full"
onChange={e=>setForm({...form,doctorId:e.target.value})}
>

<option>Select Doctor</option>

{doctors.map(d=>(
<option key={d.id} value={d.id}>
{d.name}
</option>
))}

</select>

<select
className="border p-3 w-full"
onChange={e=>setForm({...form,patientId:e.target.value})}
>

<option>Select Patient</option>

{patients.map(p=>(
<option key={p.id} value={p.id}>
{p.name}
</option>
))}

</select>

<select
className="border p-3 w-full"
onChange={e=>setForm({...form,slotId:e.target.value})}
>

<option>Select Slot</option>

{slots.map((s:any)=>(
<option key={s.id} value={s.id}>
{s.time} - Dr {s.doctor.name}
</option>
))}

</select>

<input
type="date"
className="border p-3 w-full"
onChange={e=>setForm({...form,date:e.target.value})}
/>

<input
type="time"
className="border p-3 w-full"
onChange={e=>setForm({...form,time:e.target.value})}
/>

<button className="bg-green-600 text-white px-6 py-2 rounded">
Book
</button>

</form>

</div>

)

}