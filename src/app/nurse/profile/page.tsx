"use client"

import { useEffect, useState } from "react"
import {
  User,
  Mail,
  Stethoscope,
  Phone,
  Pencil,
  Check
} from "lucide-react"

export default function NurseProfile(){

  const [nurse,setNurse] = useState<any>(null)
  const [loading,setLoading] = useState(true)
  const [edit,setEdit] = useState(false)
  const [saving,setSaving] = useState(false)

  const [form,setForm] = useState({
    name:"",
    phone:""
  })

  /* ================= LOAD ================= */

  useEffect(()=>{

    const loadProfile = async () => {
      try{
        // 🔥 FIX: correct API
        const res = await fetch("/api/nurses/me", { cache:"no-store", credentials:"include" })
        const data = await res.json()

        const nurseData = data.data

        setNurse(nurseData)

        setForm({
          name:nurseData?.name || "",
          phone:nurseData?.phone || ""
        })

      }catch(err){
        console.log(err)
      }

      setLoading(false)
    }

    loadProfile()

  },[])

  /* ================= SAVE ================= */

  const handleSave = async ()=>{

    setSaving(true)

    try{

      const res = await fetch("/api/nurses/profile",{
        method:"PATCH",credentials:"include",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(form)
      })

      const data = await res.json()

      if(!data.success){
        alert(data.error || "Update failed")
        setSaving(false)
        return
      }

      setNurse(data.data)
      setEdit(false)

    }catch(err){
      console.log(err)
      alert("Something went wrong")
    }

    setSaving(false)
  }

  /* ================= UI ================= */

  if(loading){
    return <div className="p-10 text-center">Loading...</div>
  }

  if(!nurse){
    return <div className="p-10 text-center">Not found</div>
  }

  return(

    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      <div className="bg-white border rounded-xl p-6 sm:p-8 shadow-sm">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-xl sm:text-2xl font-semibold">
            Nurse Profile
          </h1>

          <button
            onClick={()=>setEdit(!edit)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <Pencil size={14}/>
            {edit ? "Cancel" : "Edit"}
          </button>

        </div>

        {/* AVATAR */}
        <div className="flex items-center gap-4 mb-6">

          <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-semibold">
            {nurse.name?.charAt(0) || "N"}
          </div>

          <div>
            <p className="font-medium text-lg">
              {nurse.name}
            </p>
            <p className="text-sm text-gray-500">
              Nurse
            </p>
          </div>

        </div>

        {/* DETAILS */}
        <div className="space-y-4">

          {/* NAME */}
          <div className="flex items-center gap-3">
            <User size={18}/>
            {edit ? (
              <input
                value={form.name}
                onChange={(e)=>setForm({...form,name:e.target.value})}
                className="border rounded px-2 py-1 text-sm w-full max-w-xs"
              />
            ) : (
              <p className="font-medium">{nurse.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div className="flex items-center gap-3">
            <Mail size={18}/>
            <p className="text-gray-600">
              {nurse.email || "No email"}
            </p>
          </div>

          {/* PHONE */}
          <div className="flex items-center gap-3">
            <Phone size={18}/>
            {edit ? (
              <input
                value={form.phone}
                onChange={(e)=>setForm({...form,phone:e.target.value})}
                className="border rounded px-2 py-1 text-sm w-full max-w-xs"
              />
            ) : (
              <p>{nurse.phone || "-"}</p>
            )}
          </div>

          {/* DOCTOR */}
          <div className="flex items-center gap-3">
            <Stethoscope size={18}/>
            <p>
              Assigned Doctor:{" "}
              <span className="font-medium text-green-600">
                {nurse?.doctor?.name || "Not Assigned"}
              </span>
            </p>
          </div>

        </div>

        {/* SAVE */}
        {edit && (
          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              <Check size={14}/>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

      </div>

    </div>

  )
}