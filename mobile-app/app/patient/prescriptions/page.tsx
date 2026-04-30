"use client"

import { useEffect, useState } from "react"
import jsPDF from "jspdf"
import { Search, User, FileText, Download } from "lucide-react"
import { motion } from "framer-motion"

export default function PatientPrescriptions() {

  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)

  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/prescriptions", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setPrescriptions(data || [])
        setFiltered(data || [])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const s = search.toLowerCase()

    const f = prescriptions.filter((p: any) => {
      const doctor = p.doctor?.name?.toLowerCase() || ""
      return doctor.includes(s)
    })

    setFiltered(f)
  }, [search, prescriptions])

  const downloadPDF = (p: any) => {
    const doc = new jsPDF()

    doc.setFontSize(14)
    doc.text(`Prescription`, 20, 20)

    doc.setFontSize(11)
    doc.text(`Doctor: ${p.doctor?.name}`, 20, 30)

    let y = 45

    p.medicine?.forEach((m: any, i: number) => {
      doc.text(`${i + 1}. ${m.name} - ${m.dosage}`, 20, y)
      y += 8
    })

    doc.save("prescription.pdf")
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

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Prescriptions
        </h1>
        <p className="text-sm text-gray-500">
          Your medicines & history
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative">

        <Search size={16} className="absolute left-3 top-3 text-gray-400" />

        <input
          placeholder="Search doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        />

      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <p className="text-gray-400 text-sm">
          No prescriptions
        </p>
      )}

      {/* LIST */}
      <div className="space-y-4">

        {filtered.map((p: any) => (

          <motion.div
            key={p.id}
            whileTap={{ scale: 0.97 }}
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
                    Dr. {p.doctor?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(p.createdAt).toDateString()}
                  </p>
                </div>

              </div>

            </div>

            {/* MEDICINES PREVIEW */}
            <div className="text-xs text-gray-600 space-y-1">

              {p.medicine?.slice(0, 2).map((m: any, i: number) => (
                <div key={i}>
                  {m.name} - {m.dosage}
                </div>
              ))}

            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 pt-2">

              <button
                onClick={() => setSelected(p)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-xl text-xs"
              >
                View
              </button>

              <button
                onClick={() => downloadPDF(p)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-xl text-xs flex items-center justify-center gap-1"
              >
                <Download size={12} />
                PDF
              </button>

            </div>

          </motion.div>

        ))}

      </div>

      {/* 🔥 BOTTOM SHEET */}
      {selected && (

        <div className="fixed inset-0 bg-black/40 flex items-end z-50">

          <div className="bg-white/80 backdrop-blur-md w-full rounded-t-3xl p-4 space-y-4 max-h-[80vh] overflow-y-auto">

            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-sm">
                Dr. {selected.doctor?.name}
              </h2>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>

            {/* MED LIST */}
            <div className="space-y-2">

              {selected.medicine?.map((m: any, i: number) => (

                <div
                  key={i}
                  className="bg-white rounded-xl p-3 border text-sm flex justify-between items-center"
                >

                  <div className="flex items-center gap-2">
                    <FileText size={14} />
                    {m.name}
                  </div>

                  <span className="text-xs text-gray-500">
                    {m.dosage}
                  </span>

                </div>

              ))}

            </div>

            {/* ACTIONS */}
            <button
              onClick={() => downloadPDF(selected)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 rounded-xl"
            >
              Download PDF
            </button>

            <button
              onClick={() => setSelected(null)}
              className="w-full bg-gray-200 py-2.5 rounded-xl"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  )
}