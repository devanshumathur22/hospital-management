"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { User, Mail, Phone, ArrowLeft, Activity } from "lucide-react"
import { motion } from "framer-motion"

export default function PatientDetails(){

  const { id } = useParams()
  const router = useRouter()

  const [patient,setPatient] = useState<any>(null)
  const [appointments,setAppointments] = useState<any[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    const load = async()=>{

      try{

        // 🔥 patient detail
        const res1 = await fetch(`/api/patients?id=${id}`,{
          credentials:"include"
        })

        const data1 = await res1.json()

        // 🔥 appointment history
        const res2 = await fetch(`/api/appointments?patientId=${id}`,{
          credentials:"include"
        })

        const data2 = await res2.json()

        setPatient(data1)
        setAppointments(data2 || [])

      }catch(err){
        console.log(err)
      }

      setLoading(false)
    }

    if(id) load()

  },[id])

  if(loading){
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  if(!patient){
    return (
      <div className="p-10 text-red-500 text-center">
        Patient not found
      </div>
    )
  }

  return(

    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      {/* BACK */}
      <button
        onClick={()=>router.back()}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
      >
        <ArrowLeft size={16}/>
        Back
      </button>

      {/* PATIENT INFO */}
      <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        className="bg-white border rounded-2xl p-6 shadow-sm"
      >

        <div className="flex items-center gap-4 mb-6">

          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={24}/>
          </div>

          <div>
            <h1 className="text-xl font-bold">
              {patient.name}
            </h1>
            <p className="text-sm text-gray-500">
              MRN: {patient.mrn}
            </p>
          </div>

        </div>

        {/* DETAILS */}
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">

          <div className="flex items-center gap-2">
            <Mail size={14}/>
            {patient.user?.email || "No email"}
          </div>

          <div className="flex items-center gap-2">
            <Phone size={14}/>
            {patient.phone || "No phone"}
          </div>

          <div>
            Blood Group: {patient.bloodGroup || "-"}
          </div>

          <div>
            Gender: {patient.gender || "-"}
          </div>

          <div>
            Address: {patient.address || "-"}
          </div>

          <div>
            Emergency: {patient.emergencyContact || "-"}
          </div>

        </div>

      </motion.div>

      {/* ACTIONS */}
      <div className="grid grid-cols-2 gap-4">
        <button
       onClick={() => router.push(`/receptionist/book?patientId=${patient.id}`)}
className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl shadow-lg hover:scale-105 transition"
        >
            Book Appointment
            </button>

        <button
          onClick={()=>router.push(`/receptionist/queue`)}
          className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl"
        >
          View Queue
        </button>

      </div>

      {/* APPOINTMENTS */}
      <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{delay:0.1}}
        className="bg-white border rounded-2xl p-6 shadow-sm"
      >

        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Activity size={16}/>
          Appointment History
        </h2>

        {appointments.length === 0 ? (
          <p className="text-sm text-gray-500">
            No appointments found
          </p>
        ) : (

          <div className="space-y-3">

            {appointments.map((a:any,i)=>(

              <div
                key={i}
                className="flex justify-between border-b pb-2 text-sm"
              >

                <div>
                  <p className="font-medium">
                    {a.doctor?.name || "Doctor"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(a.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-xs text-gray-600">
                    {a.time}
                  </p>

                  <p className={`text-xs font-medium ${
                    a.status === "completed" ? "text-green-600" :
                    a.status === "cancelled" ? "text-red-600" :
                    "text-yellow-600"
                  }`}>
                    {a.status}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </motion.div>

    </div>

  )
}