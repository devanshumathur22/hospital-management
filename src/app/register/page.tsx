"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Register(){

  const router = useRouter()

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    role:"patient",
    specialization:"",
    experience:"",
    degree:"",
    phone:""
  })

  const specializations = [
    "General Physician",
    "Cardiologist",
    "Dentist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Psychiatrist",
    "Radiologist"
  ]

  const handleChange = (e:any)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async (e:any)=>{
    e.preventDefault()

    const res = await fetch("/api/auth/register",{
      method:"POST",credentials:"include",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(form)
    })

    const data = await res.json()

    if(res.ok){
      alert("Account created")
      router.push("/login")
    }else{
      alert(data.error)
    }
  }

  return(

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
      onSubmit={handleSubmit}
      className="bg-white w-[420px] p-8 rounded-2xl shadow-lg space-y-4"
      >

        <h1 className="text-3xl font-bold text-center">
          🏥 Register
        </h1>

        {/* Name */}

        <div className="relative">
          <span className="absolute left-3 top-3">👤</span>
          <input
          name="name"
          placeholder="Full Name"
          className="border w-full p-3 pl-10 rounded-lg"
          onChange={handleChange}
          />
        </div>

        {/* Email */}

        <div className="relative">
          <span className="absolute left-3 top-3">📧</span>
          <input
          name="email"
          placeholder="Email"
          className="border w-full p-3 pl-10 rounded-lg"
          onChange={handleChange}
          />
        </div>

        {/* Password */}

        <div className="relative">
          <span className="absolute left-3 top-3">🔒</span>
          <input
          type="password"
          name="password"
          placeholder="Password"
          className="border w-full p-3 pl-10 rounded-lg"
          onChange={handleChange}
          />
        </div>

        {/* Role */}

        <select
        name="role"
        className="border w-full p-3 rounded-lg"
        onChange={handleChange}
        >
          <option value="patient">🧑 Patient</option>
          <option value="doctor">👨‍⚕️ Doctor</option>
          <option value="nurse">👩‍⚕️ Nurse</option>
          <option value="receptionist">📋 Receptionist</option>
          <option value="admin">🛠 Admin</option>
          
        </select>


        {/* Doctor Fields */}

        {form.role === "doctor" && (

          <>

          {/* Specialization */}

          <input
          name="specialization"
          list="specializations"
          placeholder="🩺 Specialization"
          className="border w-full p-3 rounded-lg"
          onChange={handleChange}
          />

          <datalist id="specializations">
            {specializations.map((sp,i)=>(
              <option key={i} value={sp}/>
            ))}
          </datalist>


          <input
          type="number"
          name="experience"
          placeholder="📅 Experience (years)"
          className="border w-full p-3 rounded-lg"
          onChange={handleChange}
          />

          <input
          name="degree"
          placeholder="🎓 Degree"
          className="border w-full p-3 rounded-lg"
          onChange={handleChange}
          />

          <input
          name="phone"
          placeholder="📞 Phone"
          className="border w-full p-3 rounded-lg"
          onChange={handleChange}
          />

          </>

        )}

        <button
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Register
        </button>

      </form>

    </div>

  )
}