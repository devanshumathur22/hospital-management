"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BedDouble, Search, LogOut } from "lucide-react"

export default function AdmissionsPage() {
  const [data, setData] = useState<any[]>([])
  const [search, setSearch] = useState("")

  const fetchData = async () => {
    const res = await fetch("/api/admissions")
    const result = await res.json()
    setData(Array.isArray(result) ? result : [])
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 🔍 SEARCH FILTER
  const filtered = data.filter((item) =>
    item.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.doctor?.name?.toLowerCase().includes(search.toLowerCase())
  )

  // 🔥 DISCHARGE
 const handleDischarge = async (id: string) => {
  try {
    const res = await fetch(`/api/admissions/${id}`, {
      method: "PUT"
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Failed to discharge")
      return
    }

    // 🔥 success
    fetchData()

  } catch (error) {
    console.log(error)
    alert("Something went wrong")
  }
}

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-blue-700">
          <BedDouble /> Admissions
        </h1>

        <div className="flex gap-3">
          <div className="flex items-center border rounded px-3">
            <Search size={18} />
            <input
              placeholder="Search..."
              className="p-2 outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Link
            href="/admin/admissions/create"
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            + Add
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">Patient</th>
              <th className="p-3 text-left">Doctor</th>
              <th className="p-3">Ward</th>
              <th className="p-3">Bed</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">

                <td className="p-3">{item.patient?.name}</td>
                <td className="p-3">{item.doctor?.name}</td>
                <td className="p-3 text-center">{item.ward}</td>
                <td className="p-3 text-center">{item.bed?.number}</td>

                {/* STATUS */}
                <td className="p-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${
                    item.status === "discharged" ? "bg-gray-500" : "bg-green-600"
                  }`}>
                    {item.status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="p-3 text-center">
                  {item.status !== "discharged" && (
                   <button
  onClick={() => {
    if (confirm("Are you sure to discharge this patient?")) {
      handleDischarge(item.id)
    }
  }}
  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
>
  Discharge
</button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}