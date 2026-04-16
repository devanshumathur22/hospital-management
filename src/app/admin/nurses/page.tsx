"use client"

import { useEffect, useState } from "react"
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Phone,
  Briefcase
} from "lucide-react"

export default function AdminNurses(){

  const [nurses,setNurses] = useState<any[]>([])
  const [loading,setLoading] = useState(true)
  const [adding,setAdding] = useState(false)

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    phone:"",
    department:"",
    experience:""
  })

  /* LOAD */
  useEffect(()=>{
    loadNurses()
  },[])

  const loadNurses = async () => {
    try{
      const res = await fetch("/api/nurses")
      const data = await res.json()
      setNurses(data || [])
    }catch{
      setNurses([])
    }
    setLoading(false)
  }

  /* ADD */
  async function addNurse(){

    if(!form.name || !form.email || !form.password){
      alert("Name, email, password required")
      return
    }

    setAdding(true)

    const res = await fetch("/api/nurses",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        ...form,
        experience:Number(form.experience)
      })
    })

    const data = await res.json()

    setAdding(false)

    if(res.ok){
      await loadNurses()

      setForm({
        name:"",
        email:"",
        password:"",
        phone:"",
        department:"",
        experience:""
      })

    }else{
      alert(data.error)
    }
  }

  if(loading){
    return(
      <div className="flex items-center justify-center min-h-screen text-sm">
        Loading nurses...
      </div>
    )
  }

  return(

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">

      {/* ADD FORM */}
      <div className="bg-white border rounded-2xl p-5 sm:p-8 shadow space-y-6">

        <h1 className="flex items-center gap-2 text-lg sm:text-2xl font-semibold">
          <UserPlus size={20}/>
          Add Nurse
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

          {/* NAME */}
          <Input icon={<User size={14}/>} label="Nurse Name"
            value={form.name}
            onChange={(v)=>setForm({...form,name:v})}
            placeholder="Enter name"
          />

          {/* EMAIL */}
          <Input icon={<Mail size={14}/>} label="Email"
            value={form.email}
            onChange={(v)=>setForm({...form,email:v})}
            placeholder="Enter email"
          />

          {/* PASSWORD */}
          <Input icon={<Lock size={14}/>} label="Password"
            type="password"
            value={form.password}
            onChange={(v)=>setForm({...form,password:v})}
            placeholder="Create password"
          />

          {/* PHONE */}
          <Input icon={<Phone size={14}/>} label="Phone"
            value={form.phone}
            onChange={(v)=>setForm({...form,phone:v})}
            placeholder="Phone number"
          />

          {/* DEPARTMENT */}
          <Input icon={<Briefcase size={14}/>} label="Department"
            value={form.department}
            onChange={(v)=>setForm({...form,department:v})}
            placeholder="ICU / Ward"
          />

          {/* EXPERIENCE */}
          <Input label="Experience"
            value={form.experience}
            onChange={(v)=>setForm({...form,experience:v})}
            placeholder="Years"
          />

        </div>

        <button
          onClick={addNurse}
          disabled={adding}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm disabled:opacity-60"
        >
          {adding ? "Adding..." : "Add Nurse"}
        </button>

      </div>

      {/* LIST */}
      <div className="space-y-4">

        <h2 className="text-lg sm:text-xl font-semibold">
          Nurses
        </h2>

        {nurses.length === 0 && (
          <p className="text-sm text-gray-500">
            No nurses found
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {nurses.map((n:any)=>(

            <div
              key={n.id}
              className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition space-y-1"
            >

              <p className="font-semibold text-sm">
                {n.name}
              </p>

              <p className="text-xs text-gray-500">
                {n.email}
              </p>

              <p className="text-xs text-gray-500">
                Dept: {n.department || "-"}
              </p>

              <p className="text-xs text-gray-500">
                Exp: {n.experience || 0} yrs
              </p>

              <p className="text-xs text-gray-500">
                Doctor: {n.doctor?.name || "Not Assigned"}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  )
}

/* 🔥 REUSABLE INPUT */
function Input({label,icon,value,onChange,placeholder,type="text"}:any){
  return(
    <div className="space-y-1">
      <label className="text-xs sm:text-sm text-gray-500">{label}</label>
      <div className="flex items-center border rounded-lg px-3 h-10 text-sm focus-within:ring-2 focus-within:ring-blue-500">
        {icon && <span className="mr-2 text-gray-400">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e)=>onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm"
        />
      </div>
    </div>
  )
}