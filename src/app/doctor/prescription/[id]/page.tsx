"use client"

import { useEffect,useState } from "react"
import { useParams,useRouter } from "next/navigation"
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



useEffect(()=>{

const load = async()=>{

try{

const res = await fetch(`/api/appointments/${params.id}`)
const data = await res.json()

setAppointment(data)

if(data?.patient?.id){

fetch(`/api/prescriptions?patientId=${data.patient.id}`)
.then(res=>res.json())
.then(historyData=>setHistory(historyData))

}

}catch(err){

console.log("APPOINTMENT ERROR",err)

}

setLoading(false)

}

load()

},[])



if(loading){
return <div className="p-10">Loading...</div>
}

if(!appointment){
return <div className="p-10">Appointment not found</div>
}



const doctor = appointment.doctor
const patient = appointment.patient



const addMedicine = ()=>{

setMedicines([...medicines,{name:"",dosage:"",timing:""}])

}



const updateMedicine = (index:number,field:string,value:string)=>{

const updated = [...medicines]

updated[index][field] = value

setMedicines(updated)

}



const printPrescription = ()=>{

window.print()

}



const downloadPDF = ()=>{

const doc = new jsPDF()

doc.text("City Care Hospital",20,20)

doc.text(`Doctor: Dr. ${doctor.name}`,20,40)
doc.text(`Patient: ${patient.name}`,20,50)
doc.text(`Date: ${new Date().toLocaleDateString()}`,20,60)

let y = 80

medicines.forEach((m,index)=>{

doc.text(`${index+1}. ${m.name} - ${m.dosage} (${m.timing})`,20,y)

y+=10

})

doc.save("prescription.pdf")

}



const savePrescription = async ()=>{

try{

const res = await fetch("/api/prescriptions",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

doctorId:doctor.id,
patientId:patient.id,
appointmentId:appointment.id,
medicine: medicines,
notes:""

})

})

if(res.ok){

alert("Prescription saved")

}else{

alert("Error saving prescription")

}

}catch(err){

console.log("SAVE ERROR",err)

}

}



return(

<div className="p-10 bg-gray-100 min-h-screen">



{/* PRESCRIPTION CARD */}

<div id="prescription" className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-10 print:shadow-none">



{/* HOSPITAL */}

<div className="text-center border-b pb-4 mb-6">

<h1 className="text-3xl font-bold">
City Care Hospital
</h1>

<p className="text-gray-500">
MG Road Jaipur • +91 9876543210
</p>

</div>



{/* DOCTOR */}

<div className="mb-6">

<p className="font-semibold text-lg">
Dr. {doctor.name}
</p>

<p className="text-gray-500">
{doctor.specialization} • {doctor.experience} years experience
</p>

</div>



{/* PATIENT INFO */}

<div className="grid md:grid-cols-4 gap-6 bg-gray-50 p-4 rounded-lg mb-4">

<div>
<p className="text-sm text-gray-500">Patient</p>
<p className="font-medium">{patient.name}</p>
</div>

<div>
<p className="text-sm text-gray-500">Phone</p>
<p className="font-medium">{patient.phone}</p>
</div>

<div>
<p className="text-sm text-gray-500">Gender</p>
<p className="font-medium">{patient.gender}</p>
</div>

<div>
<p className="text-sm text-gray-500">Blood Group</p>
<p className="font-medium">{patient.bloodGroup}</p>
</div>

</div>



{/* PATIENT HISTORY BUTTON */}

<div className="mb-6">

<button
onClick={()=>router.push(`/doctor/patients/${patient.id}`)}
className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm"
>
View Full Patient History
</button>

</div>



{/* MEDICINES */}

<h2 className="font-semibold mb-4 text-lg">
Medicines
</h2>



<div className="space-y-3">

{medicines.map((med,index)=>(

<div key={index} className="grid md:grid-cols-3 gap-4">

<input
placeholder="Medicine Name"
className="border p-3 rounded-lg"
value={med.name}
onChange={(e)=>updateMedicine(index,"name",e.target.value)}
/>

<input
placeholder="Dosage (500mg)"
className="border p-3 rounded-lg"
value={med.dosage}
onChange={(e)=>updateMedicine(index,"dosage",e.target.value)}
/>

<select
className="border p-3 rounded-lg"
value={med.timing}
onChange={(e)=>updateMedicine(index,"timing",e.target.value)}
>

<option value="">Select</option>
<option>Morning</option>
<option>Afternoon</option>
<option>Night</option>
<option>Morning + Night</option>

</select>

</div>

))}

</div>



<button
onClick={addMedicine}
className="mt-4 text-blue-600 font-medium"
>
+ Add Medicine
</button>



{/* PATIENT HISTORY PREVIEW */}

{history.length > 0 && (

<div className="mt-10">

<h2 className="text-lg font-semibold mb-4">
Recent Patient Prescriptions
</h2>

<div className="bg-gray-50 rounded-lg p-4 space-y-2">

{history.slice(0,5).map((h:any)=>(
<div key={h.id} className="flex justify-between text-sm">

<span>
{new Date(h.createdAt).toLocaleDateString()}
</span>

<span className="text-gray-600">
{h.medicine?.length || 0} medicines
</span>

</div>
))}

</div>

</div>

)}



{/* FOOTER */}

<div className="flex justify-between mt-10">

<p className="text-sm text-gray-500">
Date: {new Date().toLocaleDateString()}
</p>

<div className="text-right">

<p className="font-semibold">
Dr. {doctor.name}
</p>

<p className="text-sm text-gray-500">
Signature
</p>

</div>

</div>



</div>



{/* ACTION BUTTONS */}

<div className="max-w-4xl mx-auto mt-6 flex gap-4 print:hidden">

<button
onClick={printPrescription}
className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
>
Print
</button>

<button
onClick={downloadPDF}
className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
>
Download PDF
</button>

<button
onClick={savePrescription}
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
>
Save Prescription
</button>

</div>



</div>

)

}