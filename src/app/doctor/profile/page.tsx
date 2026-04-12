"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Stethoscope,
  Award,
  Edit,
  Save,
  X
} from "lucide-react";

export default function DoctorProfile(){

  const [doctor,setDoctor] = useState<any>(null)
  const [editing,setEditing] = useState(false)
  const [loading,setLoading] = useState(true)

  const [form,setForm] = useState({
    name:"",
    specialization:"",
    experience:"",
    email:""
  })

  useEffect(()=>{

    const loadDoctor = async()=>{

      try{

        // ✅ FIXED API (logged-in user)
        const res = await fetch("/api/auth/me", {
          cache: "no-store"
        })

        const data = await res.json()

        if(data?.user){

          setDoctor(data.user)

          setForm({
            name:data.user.name || "",
            specialization:data.user.specialization || "",
            experience:data.user.experience || "",
            email:data.user.email || ""
          })

        }

      }catch(err){
        console.log("DOCTOR ERROR",err)
      }

      setLoading(false)

    }

    loadDoctor()

  },[])



  if(loading){
    return <div className="p-10 text-center">Loading profile...</div>
  }

  if(!doctor){
    return <div className="p-10 text-center">Doctor not found</div>
  }



  const handleChange = (e:any)=>{

    setForm({
      ...form,
      [e.target.name]:e.target.value
    })

  }



  const saveProfile = async()=>{

    try{

      const res = await fetch(`/api/doctors/${doctor.id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          id: doctor.id,
          ...form
        })
      })

      const data = await res.json()

      setDoctor(data)
      setEditing(false)

    }catch(err){
      console.log("UPDATE ERROR",err)
    }

  }



  return(

    <div className="max-w-6xl mx-auto px-4 py-10">

      <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        className="bg-white border rounded-2xl shadow-sm p-8"
      >

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">

          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={24}/>
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              {doctor.name}
            </h1>
            <p className="text-sm text-gray-500">
              Doctor Profile
            </p>
          </div>

        </div>


        {/* INFO GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="flex items-center gap-3">
            <Stethoscope size={18}/>
            <div>
              <p className="text-xs text-gray-500">Specialization</p>
              <p className="font-medium">{doctor.specialization}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Award size={18}/>
            <div>
              <p className="text-xs text-gray-500">Experience</p>
              <p className="font-medium">{doctor.experience} years</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail size={18}/>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium">{doctor.email}</p>
            </div>
          </div>

        </div>


        {/* BUTTON */}
        <div className="mt-8">

          <button
            onClick={()=>setEditing(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            <Edit size={16}/>
            Edit Profile
          </button>

        </div>

      </motion.div>


      {/* EDIT MODAL */}
      {editing && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-xl w-[420px] shadow-xl">

            <h2 className="text-xl font-bold mb-6">
              Edit Doctor Profile
            </h2>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border p-3 rounded mb-4"
            />

            <input
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="Specialization"
              className="w-full border p-3 rounded mb-4"
            />

            <input
              name="experience"
              type="number"
              value={form.experience}
              onChange={handleChange}
              placeholder="Experience (years)"
              className="w-full border p-3 rounded mb-4"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border p-3 rounded mb-6"
            />


            <div className="flex justify-end gap-3">

              <button
                onClick={()=>setEditing(false)}
                className="flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                <X size={14}/>
                Cancel
              </button>

              <button
                onClick={saveProfile}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                <Save size={14}/>
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )

}