"use client"

import { useEffect, useState } from "react"
import { User, Clock, BedDouble } from "lucide-react"

export default function Page() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/doctor/admissions", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setPatients(Array.isArray(data) ? data : [])
      })
      .catch(() => setPatients([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-6 text-sm">Loading patients...</div>
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-6">

      {/* 🔥 HEADER */}
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
        My Admitted Patients
      </h1>

      {/* EMPTY */}
      {patients.length === 0 && (
        <p className="text-gray-500">No admitted patients</p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {patients.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl shadow-md border p-5 hover:shadow-lg transition space-y-4"
          >

            {/* 👤 PATIENT NAME */}
            <div className="flex items-center gap-2">
              <User className="text-blue-500" size={18} />
              <h2 className="font-semibold text-lg text-blue-600">
                {p.patient?.name || "Unknown"}
              </h2>
            </div>

            {/* 📞 PHONE */}
            {p.patient?.phone && (
              <p className="text-sm text-gray-600">
                📞 {p.patient.phone}
              </p>
            )}

            {/* 🛏️ BED + WARD */}
            <div className="flex items-center justify-between text-sm text-gray-700">
              <span className="flex items-center gap-1">
                <BedDouble size={16} />
                Ward {p.ward}
              </span>

              <span>
                Bed {p.bed?.number}
              </span>
            </div>

            {/* ⏰ DATE TIME */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>
                {new Date(p.admitDate).toLocaleDateString()} •{" "}
                {new Date(p.admitDate).toLocaleTimeString()}
              </span>
            </div>

            {/* 🟢 STATUS */}
            <div>
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                Admitted
              </span>
            </div>

            {/* 📝 REASON */}
            {p.reason && (
              <div className="text-sm text-gray-700">
                <span className="font-medium">Reason:</span> {p.reason}
              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  )
}