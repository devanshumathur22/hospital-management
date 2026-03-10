"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Swal from "sweetalert2"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useRouter } from "next/navigation"

export default function Appointment(){

const router = useRouter()

const [isLogged,setIsLogged] = useState(false)

const [name,setName] = useState("")
const [phone,setPhone] = useState("")
const [department,setDepartment] = useState("")
const [doctor,setDoctor] = useState("")
const [date,setDate] = useState<Date | null>(null)
const [time,setTime] = useState("")

const [doctors,setDoctors] = useState<any[]>([])
const [filteredDoctors,setFilteredDoctors] = useState<any[]>([])

const timeSlots = [
"09:00 AM",
"10:00 AM",
"11:00 AM",
"12:00 PM",
"02:00 PM",
"03:00 PM",
"04:00 PM"
]


// check login

useEffect(()=>{

const patient = localStorage.getItem("patient")

if(patient){

setIsLogged(true)

}

},[])



// fetch doctors

useEffect(()=>{

if(!isLogged) return

fetch("/api/doctors")
.then(res=>res.json())
.then(data=>setDoctors(data))

},[isLogged])



// filter doctors

useEffect(()=>{

const filtered = department === ""
? []
: doctors.filter((d:any)=> d.specialization === department)

setFilteredDoctors(filtered)

},[department,doctors])



const handleSubmit = async(e:any)=>{

e.preventDefault()

if(!name || !phone || !doctor || !date || !time){

Swal.fire({
icon:"warning",
title:"All fields required"
})

return
}


await fetch("/api/appointments",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name,
phone,
doctor,
date,
time
})

})


Swal.fire({
icon:"success",
title:"Appointment Booked",
text:"Doctor will contact you shortly",
confirmButtonColor:"#2563eb"
})


// whatsapp message

const message = `Hospital Appointment

Name: ${name}
Phone: ${phone}
Doctor: ${doctor}
Date: ${date?.toDateString()}
Time: ${time}`

const url = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`

window.open(url,"_blank")

}



return(

<div className="py-20 bg-blue-50 min-h-screen flex flex-col items-center px-6 space-y-8">


{/* EMERGENCY */}

<div className="bg-red-50 border border-red-200 p-5 rounded-xl text-red-700 max-w-lg w-full text-center">

🚨 For medical emergencies please call ambulance instead of booking appointment.

<br/>

<b>Emergency Helpline: +91 99999 00000</b>

</div>



{/* INSTRUCTIONS */}

<div className="bg-white p-6 rounded-2xl shadow max-w-lg w-full">

<h2 className="text-xl font-bold mb-4 text-blue-600">
Appointment Instructions
</h2>

<ul className="text-gray-600 space-y-2 text-sm">

<li>✔ Select department and doctor carefully</li>

<li>✔ Choose available date and time slot</li>

<li>✔ Doctor will contact you after booking</li>

<li>✔ Bring previous medical reports if available</li>

<li>✔ Reach hospital 10 minutes before appointment</li>

</ul>

</div>



{/* HOW IT WORKS */}

<div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl max-w-lg w-full">

<h2 className="text-lg font-semibold mb-3">
How Appointment Works
</h2>

<ol className="text-gray-700 text-sm space-y-2">

<li>1️⃣ Patient selects department and doctor</li>

<li>2️⃣ Appointment request is sent to hospital</li>

<li>3️⃣ Hospital confirms appointment</li>

<li>4️⃣ Doctor contacts patient via phone or WhatsApp</li>

<li>5️⃣ Patient visits hospital at selected time</li>

</ol>

</div>



{/* NOT LOGGED IN */}

{!isLogged && (

<div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">

<h1 className="text-3xl font-bold mb-4">
Login Required
</h1>

<p className="text-gray-600 mb-6">
Please login as a patient to book an appointment.
</p>

<button
onClick={()=>router.push("/login")}
className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
>
Login Now
</button>

</div>

)}



{/* FORM */}

{isLogged && (

<motion.form

onSubmit={handleSubmit}

initial={{opacity:0,y:40}}
animate={{opacity:1,y:0}}
transition={{duration:0.6}}

className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-lg space-y-6"

>

<h1 className="text-3xl font-bold text-center">
Book Appointment
</h1>


<input
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Patient Name"
className="w-full p-3 border rounded-lg"
/>


<input
value={phone}
onChange={(e)=>setPhone(e.target.value)}
placeholder="Phone Number"
className="w-full p-3 border rounded-lg"
/>



<select
value={department}
onChange={(e)=>setDepartment(e.target.value)}
className="w-full p-3 border rounded-lg"
>

<option>Select Department</option>

{[...new Set(doctors.map((doc:any)=>doc.specialization))].map((dep:any)=>(
<option key={dep} value={dep}>
🏥 {dep}
</option>
))}

</select>



<select
value={doctor}
onChange={(e)=>setDoctor(e.target.value)}
className="w-full p-3 border rounded-lg"
>

<option>Select Doctor</option>

{filteredDoctors.map((doc:any)=>(
<option key={doc._id} value={doc.name}>
👨‍⚕️ {doc.name}
</option>
))}

</select>



<DatePicker

selected={date}
onChange={(date)=>setDate(date)}

placeholderText="Select Date"

className="w-full p-3 border rounded-lg"

/>



<select
value={time}
onChange={(e)=>setTime(e.target.value)}
className="w-full p-3 border rounded-lg"
>

<option>Select Time Slot</option>

{timeSlots.map((slot)=>(
<option key={slot}>
⏰ {slot}
</option>
))}

</select>



<button
type="submit"
className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition cursor-pointer"
>

Book Now

</button>

</motion.form>

)}

</div>

)
}