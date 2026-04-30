"use client"

import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { X, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export default function PatientDoctors() {

  const [doctors, setDoctors] = useState<any[]>([])
  const [groupedDoctors, setGroupedDoctors] = useState<any>({})
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)

  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState("")
  const [appointments, setAppointments] = useState<any[]>([])
  const [availability, setAvailability] = useState<any>(null)

  const [filter, setFilter] = useState("all")

  const [showPayment, setShowPayment] = useState(false)
  const [paymentMode, setPaymentMode] = useState("UPI")

  function generateSlots(start: string, end: string) {
    if (!start || !end) return []

    const slots = []
    let startMin = +start.split(":")[0] * 60 + +start.split(":")[1]
    let endMin = +end.split(":")[0] * 60 + +end.split(":")[1]

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

  useEffect(() => {
    if (!selectedDoctor?.id) return

    fetch(`/api/doctors/availability?doctorId=${selectedDoctor.id}`)
      .then(res => res.json())
      .then(data => setAvailability(data))
  }, [selectedDoctor])

  useEffect(() => {
    if (!selectedDoctor?.id || !date) return

    fetch(`/api/appointments/slots?doctorId=${selectedDoctor.id}&date=${date.toISOString()}`)
      .then(res => res.json())
      .then(data => setAppointments(Array.isArray(data) ? data : []))
  }, [selectedDoctor, date])

  useEffect(() => {
    setTime("")
  }, [date])

  const timeSlots = availability
    ? generateSlots(availability.start, availability.end)
    : []

  const isSlotBooked = (slot: string) => {
    return appointments.some((a: any) => a.time === slot)
  }

  const handleConfirm = () => {
    if (!time || !date) return
    setShowPayment(true)
  }

  const finalBooking = async () => {
    await fetch("/api/appointments", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId: selectedDoctor.id,
        date: date?.toISOString(),
        time,
        paymentMode,
        amount: 500
      })
    })

    toast.success("Booked ✅")
    setShowPayment(false)
    setSelectedDoctor(null)
  }

  const specializations = ["all", ...Object.keys(groupedDoctors)]

  return (

    <div className="space-y-5">

      <h1 className="text-xl font-semibold text-gray-900">Doctors</h1>

      {/* FILTER */}
      <div className="flex gap-2 overflow-x-auto pb-1">

        {specializations.map((sp) => (
          <button
            key={sp}
            onClick={() => setFilter(sp)}
            className={`px-4 py-1.5 text-xs rounded-full whitespace-nowrap
              ${filter === sp
                ? "bg-blue-600 text-white shadow"
                : "bg-white border text-gray-600"}
            `}
          >
            {sp}
          </button>
        ))}

      </div>

      {/* DOCTORS */}
      <div className="space-y-4">

        {Object.entries(groupedDoctors)
          .filter(([category]) => filter === "all" || filter === category)
          .map(([category, docs]: any) => (

            <div key={category}>

              <p className="text-xs text-gray-400 mb-2 px-1">{category}</p>

              <div className="space-y-3">

                {docs.map((doc: any) => (

                  <motion.div
                    key={doc.id}
                    whileTap={{ scale: 0.97 }}
                    className="bg-white rounded-2xl p-4 shadow-sm border flex justify-between items-center"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur-md border shadow flex items-center justify-center">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                          <User size={16} className="text-white" />
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.experience} yrs exp</p>
                      </div>

                    </div>

                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs shadow"
                    >
                      Book
                    </button>

                  </motion.div>

                ))}

              </div>

            </div>

          ))}

      </div>

      {/* BOOKING */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-0 bg-black/40 flex items-end z-50"
          >

            <div className="bg-white w-full rounded-t-3xl p-4 space-y-4 max-h-[80vh] overflow-y-auto">

              <div className="flex justify-between">
                <h2 className="font-semibold text-sm">{selectedDoctor.name}</h2>
                <X onClick={() => setSelectedDoctor(null)} />
              </div>

              {/* DATE */}
              <DatePicker
                selected={date}
                onChange={(d: Date | null) => setDate(d)}
                minDate={new Date()}
                placeholderText="Select date"
                className="w-full border p-3 rounded-xl text-sm"
                popperPlacement="top"
                popperClassName="z-50"
              />

              {/* SUMMARY */}
              {date && time && (
                <div className="text-xs bg-gray-100 px-3 py-2 rounded-lg">
                  {date.toDateString()} at {time}
                </div>
              )}

              {/* SLOTS */}
              <div className="flex flex-wrap gap-2">

                {timeSlots.map((slot) => {
                  const booked = isSlotBooked(slot.value)

                  return (
                    <button
                      key={slot.value}
                      disabled={booked}
                      onClick={() => setTime(slot.value)}
                      className={`px-3 py-1.5 text-xs rounded-lg border
                        ${booked
                          ? "bg-red-100 text-red-500 line-through"
                          : time === slot.value
                          ? "bg-blue-600 text-white"
                          : "bg-white"}
                      `}
                    >
                      {slot.label}
                    </button>
                  )
                })}

              </div>

              {/* CONTINUE */}
              <button
                disabled={!date || !time}
                onClick={handleConfirm}
                className={`w-full py-3 rounded-xl text-sm font-medium
                  ${date && time
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "bg-gray-200 text-gray-400"}
                `}
              >
                {!date ? "Select Date" : !time ? "Select Time" : "Continue"}
              </button>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* PAYMENT */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50">

          <div className="bg-white w-full rounded-t-3xl p-4 space-y-4">

            <h2 className="font-semibold text-sm">Payment</h2>

            <select
              className="w-full border p-2 rounded-xl"
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="UPI">UPI</option>
              <option value="CASH">Cash</option>
            </select>

            <button
              onClick={finalBooking}
              className="w-full bg-green-600 text-white py-2 rounded-xl"
            >
              Pay & Confirm
            </button>

          </div>

        </div>
      )}

    </div>
  )
}