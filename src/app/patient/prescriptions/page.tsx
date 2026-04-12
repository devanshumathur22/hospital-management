"use client"

import { useEffect, useState } from "react"

export default function PatientPrescriptions() {

  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)

  /* ====================== */
  /* FETCH */
  /* ====================== */

  useEffect(() => {
    fetch("/api/prescriptions")
      .then(res => {
        if (!res.ok) throw new Error("Failed")
        return res.json()
      })
      .then(data => {
        setPrescriptions(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError("Failed to load prescriptions")
        setLoading(false)
      })
  }, [])

  /* ====================== */
  /* SAFE FILTER */
  /* ====================== */

  const filtered = prescriptions.filter((p: any) => {

    const doctorName = p.doctor?.name?.toLowerCase() || ""
    const searchMatch = doctorName.includes(search.toLowerCase())

    if (!dateFilter) return searchMatch

    const d1 = new Date(p.createdAt)
    const d2 = new Date(dateFilter)

    const dateMatch =
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()

    return searchMatch && dateMatch
  })

  /* ====================== */
  /* SAFE MEDICINE PARSE */
  /* ====================== */

  const parseMedicine = (medicine: any) => {
    const meds = Array.isArray(medicine)
      ? medicine
      : medicine ? [medicine] : []

    return meds.map((m: any) => {
      if (typeof m === "string") {
        return { name: m, dosage: "-" }
      }
      return {
        name: m?.name || "Medicine",
        dosage: m?.dosage || "-"
      }
    })
  }

  /* ====================== */
  /* DOWNLOAD */
  /* ====================== */

  function downloadPrescription(p: any) {

    const win = window.open("", "", "width=800,height=700")

    if (!win) return

    const meds = parseMedicine(p.medicine)

    win.document.write(`
      <html>
      <head>
        <title>Prescription_${p.doctor?.name || "Doctor"}</title>
        <style>
          body { font-family: Arial; padding: 30px; }
          h2 { margin-bottom: 10px; }
          ul { padding-left: 20px; }
        </style>
      </head>
      <body>

        <h2>Hospital Prescription</h2>

        <p><b>Doctor:</b> ${p.doctor?.name || "N/A"}</p>
        <p><b>Date:</b> ${new Date(p.createdAt).toLocaleDateString()}</p>

        <h3>Medicines:</h3>
        <ul>
          ${meds.map((m:any)=>`
            <li>${m.name} - ${m.dosage}</li>
          `).join("")}
        </ul>

        <p><b>Notes:</b> ${p.notes || "-"}</p>

      </body>
      </html>
    `)

    win.document.close()
    setTimeout(()=>win.print(),500)
  }

  /* ====================== */
  /* STATES */
  /* ====================== */

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>
  }

  /* ====================== */
  /* UI */
  /* ====================== */

  return (

    <div className="max-w-6xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-8">
        Prescriptions
      </h1>

      {/* FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <input
          placeholder="Search by doctor..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full md:w-80"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e)=>setDateFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        />

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Doctor</th>
              <th className="p-4">Medicine</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-500">
                  No prescriptions found
                </td>
              </tr>
            )}

            {filtered.map((item:any)=>{

              const meds = parseMedicine(item.medicine)

              return (
                <tr key={item.id} className="border-t">

                  {/* DOCTOR */}
                  <td
                    className="p-4 text-blue-600 cursor-pointer"
                    onClick={()=>setSelectedDoctor(item.doctor)}
                  >
                    {item.doctor?.name || "N/A"}
                  </td>

                  {/* MEDICINE */}
                  <td className="p-4">
                    {meds.map((m:any,i:number)=>(
                      <div key={i}>
                        {m.name} ({m.dosage})
                      </div>
                    ))}
                  </td>

                  {/* DATE */}
                  <td className="p-4">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  {/* ACTION */}
                  <td className="p-4 flex gap-2">

                    <button
                      onClick={()=>setSelectedPrescription(item)}
                      className="bg-blue-600 text-white px-4 py-1 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={()=>downloadPrescription(item)}
                      className="bg-green-600 text-white px-4 py-1 rounded"
                    >
                      Download
                    </button>

                  </td>

                </tr>
              )
            })}

          </tbody>

        </table>

      </div>

      {/* MODAL */}
      {selectedPrescription && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="text-xl font-bold mb-4">
              Prescription
            </h2>

            <p>Doctor: {selectedPrescription.doctor?.name}</p>

            <ul className="mt-3">
              {parseMedicine(selectedPrescription.medicine).map((m:any,i:number)=>(
                <li key={i}>
                  {m.name} - {m.dosage}
                </li>
              ))}
            </ul>

            <button
              onClick={()=>setSelectedPrescription(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  )
}