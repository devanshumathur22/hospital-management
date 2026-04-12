"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  User,
  HeartPulse,
  Thermometer,
  Activity,
  FileText
} from "lucide-react"

export default function VitalsContent() {

  const searchParams = useSearchParams()
  const router = useRouter()

  const patientId = searchParams?.get("patient") ?? null
  const appointmentId = searchParams?.get("appointment") ?? null // 🔥 ADD

  const [patient, setPatient] = useState<any>(null)

  const [form, setForm] = useState({
    patientId: "",
    bp: "",
    temperature: "",
    pulse: "",
    notes: ""
  })

  useEffect(() => {

    if (!patientId) return

    fetch(`/api/patients/${patientId}`)
      .then(res => res.json())
      .then(data => {
        setPatient(data)
        setForm(prev => ({
          ...prev,
          patientId: data.id
        }))
      })
      .catch(err => console.error("Patient fetch error:", err))

  }, [patientId])

  /* ====================== */
  /* SUBMIT */
  /* ====================== */

  const submit = async () => {

    try {

      await fetch("/api/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          appointmentId // 🔥 IMPORTANT
        })
      })

      alert("Vitals saved ✅")

      // 🔥 REDIRECT BACK
      router.push("/nurse/dashboard")

    } catch (err) {

      alert("Error saving vitals")
      console.error(err)

    }

  }

  return (

    <div className="max-w-3xl mx-auto px-6 py-10">

      <div className="bg-white border rounded-2xl p-8 shadow-sm">

        <h1 className="text-2xl font-semibold mb-6">
          Patient Vitals
        </h1>

        {/* PATIENT INFO */}
        {patient && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <p className="font-semibold">Patient: {patient.name}</p>
            <p className="text-sm text-gray-500">ID: {patient.id}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">

          {/* BP */}
          <div className="space-y-1">
            <label className="text-sm text-gray-500">Blood Pressure</label>
            <div className="flex items-center border rounded-lg px-3 h-11">
              <HeartPulse size={16} className="text-gray-400 mr-2" />
              <input
                placeholder="120 / 80"
                value={form.bp}
                onChange={e => setForm({ ...form, bp: e.target.value })}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>

          {/* Temperature */}
          <div className="space-y-1">
            <label className="text-sm text-gray-500">Temperature</label>
            <div className="flex items-center border rounded-lg px-3 h-11">
              <Thermometer size={16} className="text-gray-400 mr-2" />
              <input
                placeholder="98.6 °F"
                value={form.temperature}
                onChange={e => setForm({ ...form, temperature: e.target.value })}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>

          {/* Pulse */}
          <div className="space-y-1">
            <label className="text-sm text-gray-500">Pulse</label>
            <div className="flex items-center border rounded-lg px-3 h-11">
              <Activity size={16} className="text-gray-400 mr-2" />
              <input
                placeholder="72 bpm"
                value={form.pulse}
                onChange={e => setForm({ ...form, pulse: e.target.value })}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>

        </div>

        {/* NOTES */}
        <div className="mt-5 space-y-1">
          <label className="text-sm text-gray-500">Notes</label>
          <div className="flex items-start border rounded-lg px-3 py-2">
            <FileText size={16} className="text-gray-400 mr-2 mt-1" />
            <textarea
              placeholder="Additional notes..."
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              className="flex-1 outline-none text-sm min-h-[80px]"
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={submit}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Save Vitals
        </button>

      </div>

    </div>
  )
}