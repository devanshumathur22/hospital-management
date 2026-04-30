"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  User
} from "lucide-react"

export default function AppointmentHistory() {

  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  useEffect(() => {
    fetch("/api/appointments?type=history", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setAppointments(Array.isArray(data) ? data : [])
      })
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = appointments.filter((a) => {

    const doctor = a.doctor?.name?.toLowerCase() || ""

    const searchMatch = doctor.includes(search.toLowerCase())

    const dateMatch = dateFilter
      ? new Date(a.date).toLocaleDateString() ===
        new Date(dateFilter).toLocaleDateString()
      : true

    return searchMatch && dateMatch
  })

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    )
  }

  return (

    <div className="space-y-5">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Appointment History
        </h1>
        <p className="text-sm text-gray-500">
          View your past visits
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex gap-2">

        <div className="relative flex-1">

          <Search size={16} className="absolute left-3 top-3 text-gray-400" />

          <input
            placeholder="Search doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="text-sm border rounded-xl px-2 bg-white"
        />

      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <p className="text-gray-400 text-sm">
          No history found
        </p>
      )}

      {/* LIST */}
      <div className="space-y-4">

        {filtered.map((a: any) => (

          <motion.div
            key={a.id}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm border space-y-3"
          >

            {/* TOP */}
            <div className="flex justify-between items-center">

              <div className="flex items-center gap-3">

                {/* ICON */}
                <div className="w-10 h-10 rounded-xl bg-white/40 backdrop-blur-md border shadow flex items-center justify-center">

                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>

                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Dr. {a.doctor?.name || "Unknown"}
                  </p>
                </div>

              </div>

              <span className={`text-[10px] px-2 py-1 rounded-full flex items-center gap-1
                ${a.status === "completed" && "bg-green-100 text-green-700"}
                ${a.status === "cancelled" && "bg-red-100 text-red-700"}
              `}>

                {a.status === "completed" && <CheckCircle size={10} />}
                {a.status === "cancelled" && <XCircle size={10} />}

                {a.status}

              </span>

            </div>

            {/* INFO */}
            <div className="flex justify-between text-xs text-gray-500">

              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(a.date).toDateString()}
              </span>

              <span className="flex items-center gap-1">
                <Clock size={12} />
                {a.time}
              </span>

            </div>

          </motion.div>

        ))}

      </div>

    </div>
  )
}