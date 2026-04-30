"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, FileText } from "lucide-react"

export default function PatientBills() {

  const router = useRouter()

  const [bills, setBills] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("ALL")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch("/api/patient/bills", {
          credentials: "include"
        })

        const data = await res.json()
        setBills(Array.isArray(data) ? data : [])
      } catch {
        setBills([])
      } finally {
        setLoading(false)
      }
    }

    fetchBills()
  }, [])

  const filtered = bills.filter((b) => {
    const name = (b.title || "bill").toLowerCase()
    const matchSearch = name.includes(search.toLowerCase())
    const matchFilter = filter === "ALL" || b.type === filter
    return matchSearch && matchFilter
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
          My Bills
        </h1>
        <p className="text-sm text-gray-500">
          Track your payments
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative">

        <Search size={16} className="absolute left-3 top-3 text-gray-400" />

        <input
          placeholder="Search bills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        />

      </div>

      {/* FILTER */}
      <div className="flex gap-2 overflow-x-auto pb-1">

        {["ALL", "DOCTOR", "LAB", "PHARMACY", "ADMISSION"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs rounded-full whitespace-nowrap transition
              ${filter === f
                ? "bg-blue-600 text-white shadow"
                : "bg-white border text-gray-600"}
            `}
          >
            {f}
          </button>
        ))}

      </div>

      {/* LIST */}
      <div className="space-y-4">

        {filtered.map((bill) => (

          <motion.div
            key={bill.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/patient/invoice/${bill.id}`)}
            className="bg-white rounded-2xl p-4 shadow-sm border space-y-3"
          >

            {/* TOP */}
            <div className="flex justify-between items-center">

              <div className="flex items-center gap-3">

                {/* ICON */}
                <div className="w-10 h-10 rounded-xl bg-white/40 backdrop-blur-md border shadow flex items-center justify-center">

                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <FileText size={14} className="text-white" />
                  </div>

                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {bill.title || "Hospital Bill"}
                  </p>
                </div>

              </div>

              <span
                className={`text-[10px] px-2 py-1 rounded-full
                  ${bill.status === "paid" && "bg-green-100 text-green-700"}
                  ${bill.status === "partial" && "bg-blue-100 text-blue-700"}
                  ${bill.status === "pending" && "bg-yellow-100 text-yellow-700"}
                `}
              >
                {bill.status}
              </span>

            </div>

            {/* INFO */}
            <div className="flex justify-between text-xs text-gray-500">

              <span>{bill.type}</span>

              <span>
                {new Date(bill.createdAt).toDateString()}
              </span>

            </div>

            {/* AMOUNT + ACTION */}
            <div className="flex justify-between items-center">

              <p className="text-base font-semibold text-blue-600">
                ₹{bill.totalAmount}
              </p>

              {bill.status === "pending" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/patient/invoice/${bill.id}`)
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs"
                >
                  Pay
                </button>
              )}

            </div>

          </motion.div>

        ))}

        {filtered.length === 0 && (
          <p className="text-gray-400 text-sm">
            No bills found
          </p>
        )}

      </div>

    </div>
  )
}