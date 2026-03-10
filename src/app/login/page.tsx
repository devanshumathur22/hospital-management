"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login(){

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)

  const handleLogin = async (e:any)=>{

    e.preventDefault()

    setLoading(true)

    try{

      const res = await fetch("/api/auth/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        cache:"no-store",
        body: JSON.stringify({email,password})
      })

      const data = await res.json()

      console.log("LOGIN DATA:", data)

      if(!res.ok){
        alert(data.error || "Login failed")
        setLoading(false)
        return
      }

      // important for cookie refresh
      router.refresh()

      if (data.role === "doctor") {
  router.push("/doctor/dashboard")
}

if (data.role === "patient") {
  router.push("/patient/dashboard")
}

if (data.role === "admin") {
  router.push("/admin/dashboard")
}
    }catch(err){

      console.log("LOGIN ERROR:",err)
      alert("Server error")

    }

    setLoading(false)

  }


  return(

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
      onSubmit={handleLogin}
      className="bg-white p-8 rounded-xl shadow w-[400px]"
      >

        <h1 className="text-2xl font-bold mb-6 text-center">
          Hospital Login
        </h1>

        <input
        type="email"
        placeholder="Email"
        className="border w-full p-3 mb-4 rounded"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        required
        />

        <input
        type="password"
        placeholder="Password"
        className="border w-full p-3 mb-6 rounded"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        required
        />

        <button
        disabled={loading}
        className="bg-blue-600 text-white w-full p-3 rounded hover:bg-blue-700 transition"
        >

          {loading ? "Logging in..." : "Login"}

        </button>

      </form>

    </div>

  )

}