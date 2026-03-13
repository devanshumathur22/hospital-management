"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
User,
Phone,
HeartPulse,
Calendar,
Droplet,
MapPin,
ShieldAlert,
Edit,
Save,
X
} from "lucide-react";

export default function PatientProfile() {

const [patient, setPatient] = useState<any>(null);
const [editing, setEditing] = useState(false);

const [form, setForm] = useState({
name: "",
phone: "",
gender: "",
dob: "",
bloodGroup: "",
address: "",
emergencyContact: ""
});

useEffect(() => {

const load = async () => {

const me = await fetch("/api/auth/me")
const user = await me.json()

if (!user?.user?.id) return

const res = await fetch(`/api/patients/${user.user.id}`)
const data = await res.json()

setPatient(data)

setForm({
name: data?.name || "",
phone: data?.phone || "",
gender: data?.gender || "",
dob: data?.dob ? data.dob.substring(0,10) : "",
bloodGroup: data?.bloodGroup || "",
address: data?.address || "",
emergencyContact: data?.emergencyContact || ""
})

}

load()

}, [])


const handleChange = (e:any) => {

setForm({
...form,
[e.target.name]: e.target.value
})

}


const handleSave = async () => {

const me = await fetch("/api/auth/me")
const user = await me.json()

const id = user.user.id

const res = await fetch(`/api/patients/${id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
})

const data = await res.json()

setPatient(data)
setEditing(false)

}


return(

<div className="max-w-5xl mx-auto px-4 py-10">

<h1 className="text-3xl font-bold mb-8">
Patient Profile
</h1>


<motion.div
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
className="backdrop-blur-xl bg-white/80 border border-white/30 shadow-xl rounded-2xl p-8"
>

{patient && !editing ? (

<div className="grid md:grid-cols-2 gap-6 text-sm">

<p className="flex items-center gap-2">
<User size={16}/> <b>Name:</b> {patient?.name}
</p>

<p className="flex items-center gap-2">
<Phone size={16}/> <b>Phone:</b> {patient?.phone}
</p>

<p className="flex items-center gap-2">
<HeartPulse size={16}/> <b>Gender:</b> {patient?.gender}
</p>

<p className="flex items-center gap-2">
<Calendar size={16}/> <b>DOB:</b> {patient?.dob?.substring(0,10)}
</p>

<p className="flex items-center gap-2">
<Droplet size={16}/> <b>Blood Group:</b> {patient?.bloodGroup}
</p>

<p className="flex items-center gap-2">
<MapPin size={16}/> <b>Address:</b> {patient?.address}
</p>

<p className="flex items-center gap-2 md:col-span-2">
<ShieldAlert size={16}/> <b>Emergency Contact:</b> {patient?.emergencyContact}
</p>

<button
onClick={()=>setEditing(true)}
className="flex items-center gap-2 w-fit mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
>
<Edit size={16}/> Edit Profile
</button>

</div>

):(


<div className="grid gap-4">

<input
name="name"
value={form.name}
onChange={handleChange}
placeholder="Full Name"
className="border p-2 rounded-lg"
/>

<input
name="phone"
value={form.phone}
onChange={handleChange}
placeholder="Phone"
className="border p-2 rounded-lg"
/>

<select
name="gender"
value={form.gender}
onChange={handleChange}
className="border p-2 rounded-lg"
>
<option value="">Select Gender</option>
<option>Male</option>
<option>Female</option>
</select>

<input
type="date"
name="dob"
value={form.dob}
onChange={handleChange}
className="border p-2 rounded-lg"
/>

<input
name="bloodGroup"
value={form.bloodGroup}
onChange={handleChange}
placeholder="Blood Group"
className="border p-2 rounded-lg"
/>

<input
name="address"
value={form.address}
onChange={handleChange}
placeholder="Address"
className="border p-2 rounded-lg"
/>

<input
name="emergencyContact"
value={form.emergencyContact}
onChange={handleChange}
placeholder="Emergency Contact"
className="border p-2 rounded-lg"
/>

<div className="flex gap-3 mt-2">

<button
onClick={handleSave}
className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
>
<Save size={16}/> Save
</button>

<button
onClick={()=>setEditing(false)}
className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
>
<X size={16}/> Cancel
</button>

</div>

</div>

)}

</motion.div>

</div>

)

}