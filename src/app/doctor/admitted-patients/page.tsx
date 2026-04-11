"use client"

import { useEffect, useState } from "react"

export default function Page() {
  const [patients, setPatients] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/admissions")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPatients(data)
        } else {
          setPatients([]) // ✅ safe fallback
        }
      })
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Admitted Patients
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        {patients.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-2xl shadow border"
          >
            <h2 className="font-semibold">
              {p.patient?.name}
            </h2>

            <p className="text-sm">
              Ward: {p.ward}
            </p>

            <p className="text-sm">
              Bed: {p.bedId}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}