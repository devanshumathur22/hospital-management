"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
       
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        })
      })

      const text = await res.text()
      console.log("RAW RESPONSE:", text)

      let data: any

      try {
        data = JSON.parse(text)
      } catch {
        setError("Invalid server response")
        return
      }

      console.log("PARSED RESPONSE:", data)
      console.log("ROLE FROM API:", data.role)

      if (!res.ok) {
        setError(data?.error || "Login failed")
        return
      }

      // 🔥 normalize role
      const role = data.role?.toUpperCase()

      // 🔥 save
      localStorage.setItem("token", data.token)
      localStorage.setItem("role", role)

      // 🔥 redirect
      if (role === "PATIENT") {
        router.push("/patient/dashboard")
      } else if (role === "DOCTOR") {
        router.push("/doctor/dashboard")
      } else {
        console.log("UNKNOWN ROLE:", data.role)
        setError("Invalid role")
      }

    } catch (err) {
      console.log("FETCH ERROR:", err)
      setError("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow space-y-4"
      >

        <h1 className="text-xl font-bold text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded-lg text-sm"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded-lg text-sm"
          required
        />

        {error && (
          <p className="text-red-500 text-xs text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  )
}