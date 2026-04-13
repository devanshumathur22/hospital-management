"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

export default function ResetPassword(){

  const params = useSearchParams()
  const token = params.get("token")

  const [password,setPassword] = useState("")

  const handleSubmit = async (e:any)=>{
    e.preventDefault()

    const res = await fetch("/api/auth/reset-password",{
      method:"POST",
      body: JSON.stringify({ token, password })
    })

    const data = await res.json()
    alert(data.message || data.error)
  }

  return(
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded space-y-4">
        <h1 className="text-xl font-bold">Reset Password</h1>
        <input
          type="password"
          placeholder="New Password"
          className="border p-2 w-full"
          onChange={(e)=>setPassword(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 py-2 w-full">
          Update Password
        </button>
      </form>
    </div>
  )
}