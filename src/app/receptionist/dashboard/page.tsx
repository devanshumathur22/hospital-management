"use client"

import { useEffect, useState } from "react"
import {
  Users,
  Calendar,
  Activity,
  Plus,
  Tv
} from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

/* 🔥 ADD PATIENT MODAL */
function AddPatientModal({open,setOpen}:any){

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
    phone:""
  })

  const [loading,setLoading] = useState(false)

  const handleSubmit = async()=>{

    if(!form.name || !form.email || !form.password){
      alert("Fill required fields")
      return
    }

    if(form.password !== form.confirmPassword){
      alert("Passwords do not match")
      return
    }

    setLoading(true)

    try{

      const res = await fetch("/api/patients",{
        method:"POST",
        credentials:"include",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          name:form.name,
          email:form.email,
          password:form.password,
          phone:form.phone
        })
      })

      const data = await res.json()

      if(!res.ok){
        alert(data.error || "Failed")
        return
      }

      alert("Patient created ✅")

      setForm({
        name:"",
        email:"",
        password:"",
        confirmPassword:"",
        phone:""
      })

      setOpen(false)

    }catch(err){
      alert("Error creating patient")
    }

    setLoading(false)
  }

  if(!open) return null

  return(

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Add Patient</h2>
          <button onClick={()=>setOpen(false)}>✕</button>
        </div>

        {/* INPUTS */}
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={e=>setForm({...form,name:e.target.value})}
          className="border p-2 w-full rounded"
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={e=>setForm({...form,email:e.target.value})}
          className="border p-2 w-full rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e=>setForm({...form,password:e.target.value})}
          className="border p-2 w-full rounded"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={e=>setForm({...form,confirmPassword:e.target.value})}
          className="border p-2 w-full rounded"
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={e=>setForm({...form,phone:e.target.value})}
          className="border p-2 w-full rounded"
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-xl hover:scale-105 transition"
        >
          {loading ? "Creating..." : "Create Patient"}
        </button>

      </div>

    </div>

  )
}

export default function ReceptionDashboard() {

  const router = useRouter()

  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [open,setOpen] = useState(false)

  useEffect(() => {

    const load = async () => {
      try {

        const res = await fetch("/api/stats", {
          credentials: "include"
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "Error")
        } else {
          setStats(data)
        }

      } catch {
        setError("Something went wrong")
      }

      setLoading(false)
    }

    load()

  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (error) {
    return <div className="p-10 text-red-500">{error}</div>
  }

  const cards = [
    {
      title:"Patients",
      value:stats.patients,
      icon:<Users size={20}/>,
      gradient:"from-blue-500 to-blue-600"
    },
    {
      title:"Appointments",
      value:stats.appointments,
      icon:<Calendar size={20}/>,
      gradient:"from-purple-500 to-purple-600"
    },
    {
      title:"Today",
      value:stats.today,
      icon:<Activity size={20}/>,
      gradient:"from-orange-500 to-orange-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Reception Dashboard
          </h1>

          <button
            onClick={()=>setOpen(true)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            <Plus size={16}/>
            Add Patient
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {cards.map((card,i)=>(
            <motion.div
              key={i}
              initial={{opacity:0,y:20}}
              animate={{opacity:1,y:0}}
              transition={{delay:i*0.1}}
              whileHover={{scale:1.05}}
              className={`rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r ${card.gradient}`}
            >
              <div className="flex justify-between mb-4">
                <span>{card.title}</span>
                {card.icon}
              </div>

              <h2 className="text-3xl font-bold">{card.value}</h2>
            </motion.div>
          ))}

        </div>

      </div>

      {/* MODAL */}
      <AddPatientModal open={open} setOpen={setOpen}/>
    </div>
  )
}