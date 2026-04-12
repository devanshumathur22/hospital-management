"use client"

import { useEffect, useState } from "react"
import { User, Phone, Mail, Edit, Save, X } from "lucide-react"

export default function PatientProfile(){

  const [loading,setLoading] = useState(true)
  const [editing,setEditing] = useState(false)

  const [form,setForm] = useState({
    name:"",
    phone:"",
    gender:"",
    dob:"",
    bloodGroup:"",
    address:"",
    emergencyContact:""
  })

  useEffect(()=>{

    const load = async()=>{

      const res = await fetch("/api/patients")
      const data = await res.json()

      if(data){
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          gender: data.gender || "",
          dob: data.dob ? data.dob.split("T")[0] : "",
          bloodGroup: data.bloodGroup || "",
          address: data.address || "",
          emergencyContact: data.emergencyContact || ""
        })
      }

      setLoading(false)
    }

    load()

  },[])

  const handleChange = (e:any)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  const save = async()=>{

    const res = await fetch("/api/patients",{
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(form)
    })

    if(res.ok){
      setEditing(false)
      alert("Updated ✅")
    }
  }

  if(loading){
    return <div className="p-10 text-center">Loading...</div>
  }

  return(

    <div className="max-w-4xl mx-auto px-6 py-10">

      <div className="bg-white border rounded-2xl shadow-sm p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={22}/>
            </div>

            <div>
              <h1 className="text-xl font-semibold">
                {form.name}
              </h1>
              <p className="text-sm text-gray-500">
                Patient Profile
              </p>
            </div>
          </div>

          {!editing ? (
            <button
              onClick={()=>setEditing(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <Edit size={16}/>
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={save}
                className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded"
              >
                <Save size={14}/>
                Save
              </button>

              <button
                onClick={()=>setEditing(false)}
                className="flex items-center gap-1 bg-gray-400 text-white px-4 py-2 rounded"
              >
                <X size={14}/>
                Cancel
              </button>
            </div>
          )}

        </div>

        {/* INFO */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* NAME */}
          <div>
            <p className="text-xs text-gray-500">Name</p>
            {editing ? (
              <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded w-full"/>
            ) : (
              <p className="font-medium">{form.name}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            {editing ? (
              <input name="phone" value={form.phone} onChange={handleChange} className="border p-2 rounded w-full"/>
            ) : (
              <p className="font-medium">{form.phone}</p>
            )}
          </div>

          {/* GENDER */}
          <div>
            <p className="text-xs text-gray-500">Gender</p>
            {editing ? (
              <select name="gender" value={form.gender} onChange={handleChange} className="border p-2 rounded w-full">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            ) : (
              <p className="font-medium">{form.gender || "-"}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <p className="text-xs text-gray-500">DOB</p>
            {editing ? (
              <input type="date" name="dob" value={form.dob} onChange={handleChange} className="border p-2 rounded w-full"/>
            ) : (
              <p className="font-medium">{form.dob || "-"}</p>
            )}
          </div>

          {/* BLOOD */}
          <div>
            <p className="text-xs text-gray-500">Blood Group</p>
            {editing ? (
              <input name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="border p-2 rounded w-full"/>
            ) : (
              <p className="font-medium">{form.bloodGroup || "-"}</p>
            )}
          </div>

          {/* EMERGENCY */}
          <div>
            <p className="text-xs text-gray-500">Emergency Contact</p>
            {editing ? (
              <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} className="border p-2 rounded w-full"/>
            ) : (
              <p className="font-medium">{form.emergencyContact || "-"}</p>
            )}
          </div>

        </div>

        {/* ADDRESS */}
        <div className="mt-6">
          <p className="text-xs text-gray-500">Address</p>
          {editing ? (
            <input name="address" value={form.address} onChange={handleChange} className="border p-2 rounded w-full"/>
          ) : (
            <p className="font-medium">{form.address || "-"}</p>
          )}
        </div>

      </div>

    </div>

  )
}