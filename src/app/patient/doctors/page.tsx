"use client"

import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function PatientDoctors() {

  const [doctors, setDoctors] = useState<any[]>([])
  const [groupedDoctors, setGroupedDoctors] = useState<any>({})
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)

  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState("")
  const [appointments, setAppointments] = useState<any[]>([])
  const [availability, setAvailability] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("all")

  /* 🔥 SLOT GENERATOR */
  function generateSlots(start: string, end: string) {
    if (!start || !end) return []

    const slots: { value: string; label: string }[] = []

    const [sh, sm] = start.split(":").map(Number)
    const [eh, em] = end.split(":").map(Number)

    let startMin = sh * 60 + sm
    let endMin = eh * 60 + em

    for (let i = startMin; i < endMin; i += 15) {
      const h = Math.floor(i / 60)
      const m = i % 60

      const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`

      const label = new Date(`1970-01-01T${value}`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })

      slots.push({ value, label })
    }

    return slots
  }

  /* 🔥 FETCH DOCTORS */
  useEffect(() => {
    fetch("/api/doctors")
      .then(res => res.json())
      .then(data => {

        setDoctors(data || [])

        const grouped = (data || []).reduce((acc: any, doc: any) => {
          if (!acc[doc.specialization]) acc[doc.specialization] = []
          acc[doc.specialization].push(doc)
          return acc
        }, {})

        setGroupedDoctors(grouped)
      })
  }, [])

  /* 🔥 FETCH AVAILABILITY */
  useEffect(() => {

    if (!selectedDoctor?.id) return

    setAvailability(null)

    fetch(`/api/doctors/availability?doctorId=${selectedDoctor.id}`)
      .then(res => res.json())
      .then(data => setAvailability(data))

  }, [selectedDoctor])

  /* 🔥 FETCH BOOKED */
  useEffect(() => {

    if (!selectedDoctor?.id || !date) return

    setAppointments([])

    fetch(`/api/appointments?doctorId=${selectedDoctor.id}&date=${date.toISOString()}`)
      .then(res => res.json())
      .then(data => setAppointments(data || []))

  }, [selectedDoctor, date])

  const timeSlots = availability
    ? generateSlots(availability.start, availability.end)
    : []

  /* 🔥 DAY CHECK */
  const isDoctorAvailable = (date: Date) => {
    if (!availability?.days) return false
    const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][date.getDay()]
    return availability.days.includes(day)
  }

  /* 🔥 SLOT BOOK CHECK */
  const isSlotBooked = (slot: string) => {
    return appointments.some((a: any) => a.time === slot)
  }

  /* 🔥 BOOK */
  const handleBook = async () => {

    if (!date || !time) {
      alert("Select date & time")
      return
    }

    setLoading(true)

    const res = await fetch("/api/appointments", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId: selectedDoctor.id,
        date: date.toISOString(),
        time
      })
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {

      alert("Appointment Booked ✅")

      /* 🔥 REFRESH BOOKED SLOTS */
      const updated = await fetch(
        `/api/appointments?doctorId=${selectedDoctor.id}&date=${date.toISOString()}`
      )

      const updatedData = await updated.json()
      setAppointments(updatedData)

      /* 🔥 CLOSE MODAL (MAIN FIX) */
      setSelectedDoctor(null)

      /* 🔥 RESET STATE */
      setTime("")
      setDate(null)

    } else {
      alert(data.error || "Booking failed")
    }
  }

  const specializations = ["all", ...Object.keys(groupedDoctors)]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      <h1 className="text-2xl font-bold">Find Doctors</h1>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2">
        {specializations.map((sp) => (
          <button
            key={sp}
            onClick={() => setFilter(sp)}
            className={`px-3 py-1 rounded-full border ${
              filter === sp
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            {sp}
          </button>
        ))}
      </div>

      {/* DOCTORS */}
      {Object.entries(groupedDoctors)
        .filter(([category]) => filter === "all" || filter === category)
        .map(([category, docs]: any) => (

          <div key={category} className="space-y-4">

            <h2 className="font-semibold">🏥 {category}</h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

              {docs.map((doc: any) => (

                <div key={doc.id} className="bg-white p-4 rounded-xl shadow space-y-2">

                  <h3 className="font-semibold">{doc.name}</h3>

                  <p className="text-sm text-gray-500">
                    {doc.experience} yrs experience
                  </p>

                  <button
                    onClick={() => {
                      setSelectedDoctor(doc)
                      setDate(null)
                      setTime("")
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded"
                  >
                    Book
                  </button>

                </div>

              ))}

            </div>

          </div>

        ))}

      {/* MODAL */}
      <AnimatePresence>
        {selectedDoctor && (

          <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <motion.div className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4">

              <div className="flex justify-between">
                <h2 className="font-bold">Book Appointment</h2>
                <button onClick={() => setSelectedDoctor(null)}>
                  <X size={18} />
                </button>
              </div>

              <DatePicker
                selected={date}
                onChange={(d) => setDate(d)}
                filterDate={(d) => isDoctorAvailable(d)}
                className="w-full border p-2 rounded"
              />

              {!availability ? (
                <p className="text-sm text-gray-500">Loading slots...</p>
              ) : (
                <div className="flex flex-wrap gap-2">

                  {timeSlots.map((slot) => {

                    const booked = isSlotBooked(slot.value)

                    return (
                      <button
                        key={slot.value}
                        disabled={booked}
                        onClick={() => setTime(slot.value)}
                        className={`px-3 py-1 rounded border text-sm ${
                          booked
                            ? "bg-red-200 text-red-600 line-through cursor-not-allowed opacity-80"
                            : time === slot.value
                            ? "bg-blue-600 text-white"
                            : "bg-white hover:bg-blue-50"
                        }`}
                      >
                        {booked ? "Booked ❌" : slot.label}
                      </button>
                    )
                  })}

                </div>
              )}

              <button
                onClick={handleBook}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                {loading ? "Booking..." : "Confirm"}
              </button>

            </motion.div>

          </motion.div>

        )}
      </AnimatePresence>

    </div>
  )
}