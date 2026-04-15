"use client"

import { useEffect, useState } from "react"

export default function Page() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admissions")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPatients(data)
        } else {
          setPatients([])
        }
      })
      .catch(() => setPatients([]))
      .finally(() => setLoading(false))
  }, [])

  // 🔥 Loading state
  if (loading) {
    return <div className="p-6 text-sm">Loading patients...</div>
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* 🔥 TITLE */}
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
        Admitted Patients
      </h1>

      {/* ❌ Empty state */}
      {patients.length === 0 && (
        <p className="text-gray-500 text-sm">
          No admitted patients
        </p>
      )}

      {/* 🔥 GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {patients.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-2xl shadow border space-y-2 hover:shadow-md transition"
          >
            {/* NAME */}
            <h2 className="font-semibold text-sm sm:text-base truncate">
              {p.patient?.name || "Unknown Patient"}
            </h2>

            {/* DETAILS */}
            <p className="text-xs sm:text-sm text-gray-600">
              Ward: <span className="font-medium">{p.ward}</span>
            </p>

            <p className="text-xs sm:text-sm text-gray-600">
              Bed: <span className="font-medium">{p.bedId}</span>
            </p>

            {/* STATUS TAG */}
            <span className="inline-block text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
              Admitted
            </span>

          </div>
        ))}

      </div>

    </div>
  )
}