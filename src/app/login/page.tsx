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
        headers:{ "Content-Type":"application/json" },
        credentials:"include",
        cache:"no-store",
        body: JSON.stringify({email,password})
      })

      const data = await res.json()

      if(!res.ok){
        alert(data.error || "Login failed")
        setLoading(false)
        return
      }

      router.refresh()

      if (data.role === "doctor") router.push("/doctor/dashboard")
      if (data.role === "patient") router.push("/patient/dashboard")
      if (data.role === "receptionist") router.push("/receptionist/dashboard")
      if (data.role === "nurse") router.push("/nurse/dashboard")
      if (data.role === "admin") router.push("/admin/dashboard")

    }catch(err){
      console.log(err)
      alert("Server error")
    }

    setLoading(false)
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-8">

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Hospital Login
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Please login to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={()=>router.push("/forgot-password")}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <span
            onClick={()=>router.push("/register")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </div>

    </div>
  )
}