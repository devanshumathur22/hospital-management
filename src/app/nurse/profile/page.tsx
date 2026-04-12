"use client"

import { useEffect, useState } from "react"
import { User, Mail, Stethoscope } from "lucide-react"

export default function NurseProfile(){

  const [nurse,setNurse] = useState<any>(null)

  useEffect(()=>{

    const loadProfile = async () => {

      const res = await fetch("/api/auth/me")
      const data = await res.json()

      // ✅ IMPORTANT FIX
      setNurse(data.user)

    }

    loadProfile()

  },[])

  if(!nurse){
    return (
      <div className="p-10 text-center text-gray-500">
        Loading...
      </div>
    )
  }

  return(

    <div className="max-w-3xl mx-auto px-6 py-10">

      <div className="bg-white border rounded-2xl p-8 shadow-sm">

        <h1 className="text-2xl font-semibold mb-6">
          Nurse Profile
        </h1>

        {/* PROFILE */}
        <div className="space-y-4">

          {/* NAME */}
          <div className="flex items-center gap-3">
            <User size={18}/>
            <p className="font-medium">
              {nurse.name || "-"}
            </p>
          </div>

          {/* EMAIL */}
          <div className="flex items-center gap-3">
            <Mail size={18}/>
            <p className="text-gray-600">
              {nurse.email || "-"}
            </p>
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

      </div>

    </div>

  )
}