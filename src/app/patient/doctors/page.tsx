"use client"

import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { X } from "lucide-react"

export default function PatientDoctors(){

const [doctors,setDoctors] = useState<any[]>([])
const [groupedDoctors,setGroupedDoctors] = useState<any>({})
const [selectedDoctor,setSelectedDoctor] = useState<any>(null)

const [date,setDate] = useState<Date | null>(null)
const [time,setTime] = useState("")


function generateSlots(){

const slots:string[] = []

let hour = 9
let minute = 0

while(hour < 17){

const h = hour.toString().padStart(2,"0")
const m = minute.toString().padStart(2,"0")

slots.push(`${h}:${m}`)

minute += 15

if(minute === 60){
minute = 0
hour++
}

}

return slots

}

const timeSlots = generateSlots()



useEffect(()=>{

fetch("/api/doctors")
.then(res=>res.json())
.then(data=>{

setDoctors(data)

const grouped = data.reduce((acc:any,doc:any)=>{

if(!acc[doc.specialization]){
acc[doc.specialization] = []
}

acc[doc.specialization].push(doc)

return acc

},{});

setGroupedDoctors(grouped)

})

},[])



const handleBook = async()=>{

if(!date || !time){
alert("Select date and time")
return
}

await fetch("/api/appointments",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

doctorId:selectedDoctor.id,
date,
time

})

})

alert("Appointment Booked")

setSelectedDoctor(null)

}



return(

<div className="max-w-6xl mx-auto px-8 py-10">

<h1 className="text-3xl font-bold mb-10">
Doctors
</h1>



{Object.entries(groupedDoctors).map(([category,docs]:any)=>(

<div key={category} className="mb-12">

<h2 className="text-2xl font-bold mb-6">
🏥 {category}
</h2>


{/* ROW LAYOUT */}

<div className="flex flex-wrap gap-6 justify-start">

{docs.map((doc:any)=>(

<div
key={doc.id}
className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition w-[250px]"
>

<h3 className="text-xl font-bold mb-1">
👨‍⚕️ {doc.name}
</h3>

<p className="text-gray-600">
{doc.experience} years experience
</p>

<button
onClick={()=>setSelectedDoctor(doc)}
className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
>

Book Appointment

</button>

</div>

))}

</div>

</div>

))}



{/* BOOKING MODAL */}

{selectedDoctor && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative">

<button
onClick={()=>setSelectedDoctor(null)}
className="absolute right-4 top-4"
>
<X/>
</button>


<h2 className="text-2xl font-bold mb-4">
Book Appointment
</h2>

<p className="mb-6 text-gray-600">
Doctor: <b>{selectedDoctor.name}</b>
</p>



<DatePicker
selected={date}
onChange={(d)=>setDate(d)}
placeholderText="Select Date"
className="w-full border p-3 rounded-lg mb-6"
/>



<div className="flex flex-wrap gap-3 mb-6">

{timeSlots.map(slot=>(

<button
key={slot}
onClick={()=>setTime(slot)}
className={`px-3 py-2 rounded border ${
time === slot
? "bg-blue-600 text-white"
: "bg-white"
}`}
>

{slot}

</button>

))}

</div>



<button
onClick={handleBook}
className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
>

Confirm Appointment

</button>

</div>

</div>

)}

</div>

)

}