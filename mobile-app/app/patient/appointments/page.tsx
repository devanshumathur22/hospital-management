"use client"

import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { motion } from "framer-motion"
import { X, Calendar, Clock, User } from "lucide-react"
import toast from "react-hot-toast"

export default function PatientAdvancedAppointments() {

  const [appointments, setAppointments] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [newDate, setNewDate] = useState<Date | null>(null)
  const [newTime, setNewTime] = useState("")
  const [availability, setAvailability] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  function generateTimeSlots(start: string, end: string) {
    if (!start || !end) return []

    const slots: any[] = []
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

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/appointments", { credentials: "include" })
      const data = await res.json()
      setAppointments(Array.isArray(data) ? data : [])
    } catch {
      setAppointments([])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const openReschedule = async (a: any) => {
    setSelected(a)
    setNewDate(new Date(a.date))
    setNewTime(a.time)

    const res = await fetch(`/api/doctors/availability?doctorId=${a.doctorId}`, { credentials: "include" })
    const data = await res.json()
    setAvailability(data)
  }

  const timeSlots = availability
    ? generateTimeSlots(availability.start, availability.end)
    : []

  const isSlotBooked = (date: Date, time: string) => {
    return appointments.some((a) =>
      new Date(a.date).toDateString() === date.toDateString() &&
      a.time === time &&
      a.id !== selected?.id
    )
  }

  const isDoctorAvailable = (date: Date) => {
    if (!availability?.days) return true
    const day = date.toLocaleDateString("en-US", { weekday: "long" })
    return availability.days.includes(day)
  }

  const saveReschedule = async () => {
    if (!selected || !newDate || !newTime) {
      toast.error("Select date & time")
      return
    }

    const res = await fetch(`/api/appointments/${selected.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate, time: newTime })
    })

    if (res.ok) {
      toast.success("Rescheduled ✅")
      setSelected(null)
      await loadData()
    } else {
      toast.error("Failed")
    }
  }

  const cancelAppointment = async (id: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: "DELETE",
      credentials: "include"
    })

    toast.success("Cancelled ❌")
    await loadData()
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm">
        Loading...
      </div>
    )
  }

  return (

    <div className="space-y-5">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Appointments</h1>
        <p className="text-sm text-gray-500">Manage your bookings</p>
      </div>

      {appointments.length === 0 && (
        <p className="text-gray-500 text-sm">No appointments</p>
      )}

      {/* LIST */}
      <div className="space-y-4">

        {appointments.map((a: any) => (

          <motion.div
            key={a.id}
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
                    Dr. {a.doctor?.name || "-"}
                  </p>
                </div>

              </div>

              <span className={`text-[10px] px-2 py-1 rounded-full
                ${a.status === "completed" && "bg-green-100 text-green-700"}
                ${a.status === "cancelled" && "bg-red-100 text-red-700"}
                ${a.status === "pending" && "bg-yellow-100 text-yellow-700"}
              `}>
                {a.status}
              </span>

            </div>

            {/* INFO */}
            <div className="flex gap-4 text-xs text-gray-500">

              <div className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(a.date).toDateString()}
              </div>

              <div className="flex items-center gap-1">
                <Clock size={12} />
                {a.time}
              </div>

            </div>

            {/* ACTIONS */}
            {a.status === "pending" && (

              <div className="flex gap-2">

                <button
                  onClick={() => openReschedule(a)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg text-xs"
                >
                  Reschedule
                </button>

                <button
                  onClick={() => cancelAppointment(a.id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg text-xs"
                >
                  Cancel
                </button>

              </div>

            )}

          </motion.div>

        ))}

      </div>

      {/* 🔥 RESCHEDULE SHEET */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50">

          <div className="bg-white/80 backdrop-blur-md w-full rounded-t-3xl p-4 space-y-4 max-h-[80vh] overflow-y-auto">

            <div className="flex justify-between">
              <h2 className="font-semibold text-sm">Reschedule</h2>
              <X onClick={() => setSelected(null)} />
            </div>

            <DatePicker
              selected={newDate}
              onChange={(d: Date | null) => setNewDate(d)}
              filterDate={(d) => isDoctorAvailable(d)}
              className="w-full border p-3 rounded-xl"
              popperPlacement="top"
            />

            {/* SLOTS */}
            <div className="flex flex-wrap gap-2">

              {timeSlots.map((slot: any) => {
                const booked = newDate ? isSlotBooked(newDate, slot.value) : false

                return (
                  <button
                    key={slot.value}
                    disabled={booked}
                    onClick={() => setNewTime(slot.value)}
                    className={`px-3 py-1.5 text-xs rounded-lg border
                      ${booked
                        ? "bg-red-100 text-red-500 line-through"
                        : newTime === slot.value
                        ? "bg-blue-600 text-white"
                        : "bg-white"}
                    `}
                  >
                    {slot.label}
                  </button>
                )
              })}

            </div>

            {/* SAVE */}
            <button
              onClick={saveReschedule}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl"
            >
              Save Changes
            </button>

          </div>

        </div>
      )}

    </div>
  )
}