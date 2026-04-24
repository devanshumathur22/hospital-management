"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export default function CreateAdmission() {
  const router = useRouter()

  const [patients, setPatients] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [beds, setBeds] = useState<any[]>([])

  const [searchPatient, setSearchPatient] = useState("")
  const [searchDoctor, setSearchDoctor] = useState("")
  const [searchBed, setSearchBed] = useState("")

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    bedId: "",
    ward: "",
    reason: ""
  })

  // 🔥 FETCH
  useEffect(() => {
    const fetchData = async () => {
      const [p, d, b] = await Promise.all([
        fetch("/api/patients").then(res => res.json()),
        fetch("/api/doctors").then(res => res.json()),
        fetch("/api/beds").then(res => res.json())
      ])

      setPatients(Array.isArray(p) ? p : p.data || [])
      setDoctors(Array.isArray(d) ? d : d.data || [])
      setBeds(Array.isArray(b) ? b : b.data || [])
    }

    fetchData()
  }, [])

  // 🔍 FILTERS
  const filteredPatients = patients.filter(p =>
    p.name?.toLowerCase().includes(searchPatient.toLowerCase())
  )

  const filteredDoctors = doctors.filter(d =>
    d.name?.toLowerCase().includes(searchDoctor.toLowerCase())
  )

  const filteredBeds = beds.filter(b =>
    `${b.ward} ${b.number}`.toLowerCase().includes(searchBed.toLowerCase())
  )

  // 🔥 SUBMIT
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!form.patientId || !form.doctorId || !form.bedId) {
      alert("Please fill all required fields")
      return
    }

    const res = await fetch("/api/admissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      router.push("/admin/admissions")
    } else {
      alert("Failed to create admission")
    }
  }

  return (
    <div className="p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6">

        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700">
          Create Admission
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* PATIENT */}
          <div>
            <div className="flex items-center border rounded px-2 mb-2">
              <Search size={16} />
              <input
                placeholder="Search Patient"
                className="p-2 outline-none w-full"
                onChange={(e) => setSearchPatient(e.target.value)}
              />
            </div>

            <select
              value={form.patientId}
              className="w-full border p-2 rounded"
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            >
              <option value="">Select Patient</option>
              {filteredPatients.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* DOCTOR */}
          <div>
            <div className="flex items-center border rounded px-2 mb-2">
              <Search size={16} />
              <input
                placeholder="Search Doctor"
                className="p-2 outline-none w-full"
                onChange={(e) => setSearchDoctor(e.target.value)}
              />
            </div>

            <select
              value={form.doctorId}
              className="w-full border p-2 rounded"
              onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            >
              <option value="">Select Doctor</option>
              {filteredDoctors.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* BED */}
          <div>
            <div className="flex items-center border rounded px-2 mb-2">
              <Search size={16} />
              <input
                placeholder="Search Bed"
                className="p-2 outline-none w-full"
                onChange={(e) => setSearchBed(e.target.value)}
              />
            </div>

            <select
              value={form.bedId}
              className="w-full border p-2 rounded"
              onChange={(e) => {
                const selected = beds.find(b => b.id === e.target.value)

                setForm({
                  ...form,
                  bedId: e.target.value,
                  ward: selected?.ward || ""
                })
              }}
            >
              <option value="">Select Bed</option>
              {filteredBeds.map(b => (
                <option key={b.id} value={b.id}>
                  Ward {b.ward} - Bed {b.number}
                </option>
              ))}
            </select>
          </div>

          {/* WARD */}
          <input
            value={form.ward}
            className="w-full border p-2 rounded bg-gray-100"
            readOnly
          />

          {/* REASON */}
          <input
            placeholder="Reason"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />

          {/* BUTTON */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">
            Create Admission
          </button>

        </form>
      </div>
    </div>
  )
}