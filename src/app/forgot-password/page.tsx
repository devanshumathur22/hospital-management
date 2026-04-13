"use client"

import { useState } from "react"

export default function ForgotPassword(){

  const [email,setEmail] = useState("")

  const handleSubmit = async (e:any)=>{
    e.preventDefault()

    const res = await fetch("/api/auth/forgot-password",{
      method:"POST",
      body: JSON.stringify({ email })
    })

    const data = await res.json()
    alert(data.message || data.error)
  }

  return(
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded space-y-4">
        <h1 className="text-xl font-bold">Forgot Password</h1>
        <input
          placeholder="Email"
          className="border p-2 w-full"
          onChange={(e)=>setEmail(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 w-full">
          Send Link
        </button>
      </form>
    </div>
  )
}