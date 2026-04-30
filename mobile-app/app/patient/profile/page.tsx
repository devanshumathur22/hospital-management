"use client"

import { useEffect, useState } from "react"
import { User } from "lucide-react"
import { motion } from "framer-motion"

export default function PatientProfile() {

  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    address: "",
    emergencyContact: ""
  })

  const getAge = (dob: string) => {
    if (!dob) return "-"
    const birth = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  const load = async () => {
    const res = await fetch("/api/auth/me", {
      cache: "no-store",
      credentials: "include"
    })
    const data = await res.json()

    if (data.user) {
      setForm({
        name: data.user.name || "",
        phone: data.user.phone || "",
        gender: data.user.gender || "",
        dob: data.user.dob ? data.user.dob.split("T")[0] : "",
        bloodGroup: data.user.bloodGroup || "",
        address: data.user.address || "",
        emergencyContact: data.user.emergencyContact || ""
      })
    }

    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const save = async () => {
    await fetch("/api/profile", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    setEditing(false)
    load()
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    )
  }

  return (

    <div className="space-y-5">

      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-4">

        <div className="w-14 h-14 rounded-xl bg-white/40 backdrop-blur-md border flex items-center justify-center">

          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>

        </div>

        <div>
          <p className="text-base font-semibold text-gray-900">
            {form.name || "Patient"}
          </p>
          <p className="text-xs text-gray-500">
            {form.phone || "-"}
          </p>
        </div>

      </div>

      {/* ACTION BUTTONS */}
      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl text-sm"
        >
          Edit Profile
        </button>
      ) : (
        <div className="flex gap-2">

          <button
            onClick={save}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 rounded-xl text-sm"
          >
            Save
          </button>

          <button
            onClick={() => { setEditing(false); load() }}
            className="flex-1 bg-gray-200 py-2.5 rounded-xl text-sm"
          >
            Cancel
          </button>

        </div>
      )}

      {/* INFO CARD */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border space-y-4 text-sm">

        {/* FIELD COMPONENT */}
        {[
          { label: "Name", key: "name" },
          { label: "Phone", key: "phone" },
          { label: "Blood Group", key: "bloodGroup" },
          { label: "Emergency", key: "emergencyContact" },
          { label: "Address", key: "address" }
        ].map((field) => (

          <div key={field.key}>
            <p className="text-xs text-gray-400">{field.label}</p>

            {editing ? (
              <input
                name={field.key}
                value={(form as any)[field.key]}
                onChange={handleChange}
                className="w-full mt-1 border p-2 rounded-xl"
              />
            ) : (
              <p>{(form as any)[field.key] || "-"}</p>
            )}
          </div>

        ))}

        {/* GENDER */}
        <div>
          <p className="text-xs text-gray-400">Gender</p>

          {editing ? (
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full mt-1 border p-2 rounded-xl"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          ) : (
            <p>{form.gender || "-"}</p>
          )}
        </div>

        {/* DOB */}
        <div>
          <p className="text-xs text-gray-400">DOB</p>

          {editing ? (
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full mt-1 border p-2 rounded-xl"
            />
          ) : (
            <p>{form.dob || "-"}</p>
          )}
        </div>

        {/* AGE */}
        <div>
          <p className="text-xs text-gray-400">Age</p>
          <p>{getAge(form.dob)}</p>
        </div>

      </div>

    </div>
  )
}