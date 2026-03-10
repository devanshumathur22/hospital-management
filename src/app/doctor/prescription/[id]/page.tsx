"use client"

import { useEffect,useState } from "react"
import { useParams } from "next/navigation"

export default function PrescriptionPage(){

const params = useParams()

const [appointment,setAppointment] = useState<any>(null)

const [medicines,setMedicines] = useState([
{ name:"", dosage:"", timing:"" }
])

useEffect(()=>{

fetch(`/api/appointments/${params.id}`)
.then(res=>res.json())
.then(data=>setAppointment(data))

},[])

if(!appointment) return <div className="p-10">Loading...</div>

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


const savePrescription = async ()=>{

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

}


return(

<div className="p-10 bg-gray-100 min-h-screen">

<div id="prescription" className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-10">

{/* Hospital */}

<div className="text-center border-b pb-4 mb-6">

<h1 className="text-3xl font-bold">
City Care Hospital
</h1>

<p className="text-gray-500">
MG Road Jaipur • +91 9876543210
</p>

</div>


{/* Doctor */}

<div className="mb-6">

<p className="font-semibold text-lg">
Dr. {doctor.name}
</p>

<p className="text-gray-500">
{doctor.specialization} • {doctor.experience} years experience
</p>

</div>


{/* Patient */}

<div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg mb-6">

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


{/* Medicines */}

<h2 className="font-semibold mb-4 text-lg">
Medicines
</h2>

<div className="space-y-4">

{medicines.map((med,index)=>(

<div key={index} className="grid grid-cols-3 gap-4">

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
className="mt-4 text-blue-600"
>
+ Add Medicine
</button>


{/* Footer */}

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


{/* Buttons */}

<div className="max-w-4xl mx-auto mt-6 flex gap-4">

<button
onClick={printPrescription}
className="bg-green-600 text-white px-6 py-3 rounded-lg"
>
Print
</button>

<button
onClick={savePrescription}
className="bg-blue-600 text-white px-6 py-3 rounded-lg"
>
Save Prescription
</button>

</div>

</div>

)

}