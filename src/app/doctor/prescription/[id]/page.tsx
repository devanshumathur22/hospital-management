"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import jsPDF from "jspdf"

export default function PrescriptionPage(){

const params = useParams()
const router = useRouter()

const [appointment,setAppointment] = useState<any>(null)
const [history,setHistory] = useState<any[]>([])
const [loading,setLoading] = useState(true)

const [medicines,setMedicines] = useState([
  { name:"", dosage:"", timing:"" }
])

/* 🔥 LOAD DATA */
useEffect(()=>{

const load = async()=>{

try{

const res = await fetch(`/api/appointments/${params.id}`)
const data = await res.json()

setAppointment(data)

/* ✅ FIXED: no patientId param */
if(data?.patient?.id){
  fetch(`/api/prescriptions`)
  .then(res=>res.json())
  .then(historyData=>setHistory(historyData))
}

}catch(err){
console.log(err)
}

setLoading(false)
}

load()

},[])


if(loading){
return <div className="p-6 text-sm">Loading...</div>
}

if(!appointment){
return <div className="p-6 text-sm">Appointment not found</div>
}

const doctor = appointment.doctor
const patient = appointment.patient

/* 🔥 ADD MEDICINE */
const addMedicine = ()=>{
setMedicines([...medicines,{name:"",dosage:"",timing:""}])
}

/* 🔥 UPDATE MEDICINE */
const updateMedicine = (index:number,field:string,value:string)=>{
const updated = [...medicines]
updated[index][field] = value
setMedicines(updated)
}

/* 🔥 PDF */
const downloadPDF = ()=>{

const doc = new jsPDF()

doc.setFontSize(18)
doc.text("City Care Hospital",105,20,{ align:"center" })

doc.setFontSize(10)
doc.text("MG Road Jaipur | +91 9876543210",105,26,{ align:"center" })

doc.line(20,30,190,30)

doc.setFontSize(12)

doc.text(`Doctor: Dr. ${doctor.name}`,20,40)
doc.text(`Specialization: ${doctor.specialization}`,20,46)

doc.text(`Patient: ${patient.name}`,20,60)
doc.text(`Phone: ${patient.phone}`,20,66)
doc.text(`Gender: ${patient.gender}`,20,72)

doc.text(`Date: ${new Date().toLocaleDateString()}`,140,40)

let y = 90

doc.setFontSize(13)
doc.text("Prescription",20,y)

y += 10

doc.setFontSize(11)

doc.text("No",20,y)
doc.text("Medicine",35,y)
doc.text("Dosage",100,y)
doc.text("Timing",150,y)

doc.line(20,y+2,190,y+2)

y += 10

medicines.forEach((m,index)=>{

doc.text(String(index+1),20,y)
doc.text(m.name || "-",35,y)
doc.text(m.dosage || "-",100,y)
doc.text(m.timing || "-",150,y)

y += 8

})

y += 20

doc.line(120,y,180,y)
doc.text("Doctor Signature",130,y+6)

doc.save(`Prescription-${patient.name}.pdf`)
}

/* 🔥 SAVE */
const savePrescription = async ()=>{

if(medicines.some(m => !m.name)){
  alert("Enter medicine name")
  return
}

const res = await fetch("/api/prescriptions",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
  doctorId:doctor.id,
  patientId:patient.id,
  appointmentId:appointment.id,
  medicine: medicines,
  notes:""
})
})

if(res.ok){
  alert("Saved ✅")

  /* 🔥 MARK COMPLETED */
  await fetch(`/api/appointments/${appointment.id}`,{
    method:"PUT",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      status:"completed"
    })
  })

  router.push("/doctor/appointments")
}else{
  alert("Error saving")
}

}

return(

<div className="p-4 sm:p-6 bg-gray-100 min-h-screen space-y-6">

<div className="max-w-4xl mx-auto bg-white shadow rounded-xl p-4 sm:p-6 md:p-10 space-y-6">

{/* HEADER */}
<div className="text-center border-b pb-4">
<h1 className="text-xl sm:text-2xl font-bold">
City Care Hospital
</h1>
<p className="text-xs text-gray-500">
MG Road Jaipur • +91 9876543210
</p>
</div>

{/* DOCTOR */}
<div>
<p className="font-semibold text-lg">
Dr. {doctor.name}
</p>
<p className="text-gray-500 text-sm">
{doctor.specialization} • {doctor.experience} yrs
</p>
</div>

{/* PATIENT */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-lg text-sm">

<div>
<p className="text-gray-500">Patient</p>
<p className="font-medium">{patient.name}</p>
</div>

<div>
<p className="text-gray-500">Phone</p>
<p className="font-medium">{patient.phone}</p>
</div>

<div>
<p className="text-gray-500">Gender</p>
<p className="font-medium">{patient.gender}</p>
</div>

<div>
<p className="text-gray-500">Blood</p>
<p className="font-medium">{patient.bloodGroup}</p>
</div>

</div>

{/* HISTORY BTN */}
<button
onClick={()=>router.push(`/doctor/patients/${patient.id}`)}
className="text-sm bg-gray-800 text-white px-3 py-2 rounded-lg"
>
View Patient History
</button>

{/* MEDICINES */}
<h2 className="font-semibold text-lg">
Medicines
</h2>

<div className="space-y-3">

{medicines.map((med,index)=>(

<div key={index} className="grid md:grid-cols-3 gap-2">

<input
placeholder="Medicine"
className="border p-2 rounded-lg"
value={med.name}
onChange={(e)=>updateMedicine(index,"name",e.target.value)}
/>

<input
placeholder="Dosage"
className="border p-2 rounded-lg"
value={med.dosage}
onChange={(e)=>updateMedicine(index,"dosage",e.target.value)}
/>

<select
className="border p-2 rounded-lg"
value={med.timing}
onChange={(e)=>updateMedicine(index,"timing",e.target.value)}
>
<option value="">Timing</option>
<option>Morning</option>
<option>Afternoon</option>
<option>Night</option>
</select>

</div>

))}

</div>

<button
onClick={addMedicine}
className="text-blue-600 text-sm"
>
+ Add Medicine
</button>

{/* HISTORY */}
{history.length > 0 && (
<div>

<h2 className="font-semibold mb-2">
Recent Prescriptions
</h2>

<div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">

{history.slice(0,5).map((h:any)=>(
<div key={h.id} className="flex justify-between">
<span>{new Date(h.createdAt).toLocaleDateString()}</span>
<span>{h.medicine?.length} meds</span>
</div>
))}

</div>

</div>
)}

{/* FOOTER */}
<div className="flex justify-between text-sm">
<p>Date: {new Date().toLocaleDateString()}</p>
<p className="font-semibold">Dr. {doctor.name}</p>
</div>

</div>

{/* ACTIONS */}
<div className="max-w-4xl mx-auto flex gap-3">

<button
onClick={()=>window.print()}
className="bg-green-600 text-white px-4 py-2 rounded-lg"
>
Print
</button>

<button
onClick={downloadPDF}
className="bg-purple-600 text-white px-4 py-2 rounded-lg"
>
Download PDF
</button>

<button
onClick={savePrescription}
className="bg-blue-600 text-white px-4 py-2 rounded-lg"
>
Save
</button>

</div>

</div>

)
}