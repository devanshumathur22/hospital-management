"use client"

import { useEffect, useState } from "react"
import {
  User,
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle,
  Search
} from "lucide-react"
import { motion } from "framer-motion"

export default function Appointments() {

  const [appointments, setAppointments] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])

  const [patientSearch, setPatientSearch] = useState("")
  const [doctorSearch, setDoctorSearch] = useState("")
  const [specialization, setSpecialization] = useState("")

  const [showPatients, setShowPatients] = useState(false)
  const [showDoctors, setShowDoctors] = useState(false)

  const [form, setForm] = useState({
    doctorId: "",
    patientId: "",
    date: "",
    time: ""
  })

  /* ===================== */
  /* FETCH DATA */
  /* ===================== */

  async function fetchData() {
    try {
      const [a, d, p] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/doctors"),
        fetch("/api/patients")
      ])

      const appointmentsData = await a.json()
      const doctorsData = await d.json()
      const patientsData = await p.json()

      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : [])
      setDoctors(Array.isArray(doctorsData) ? doctorsData : [])
      setPatients(Array.isArray(patientsData) ? patientsData : [])

    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  /* ===================== */
  /* FILTERS */
  /* ===================== */

  const filteredPatients = patients.filter(p =>
    p.name?.toLowerCase().includes(patientSearch.toLowerCase())
  )

  const specializations = [...new Set(doctors.map(d => d.specialization))]

  const filteredDoctors = doctors.filter(d =>
    (!specialization || d.specialization === specialization) &&
    d.name.toLowerCase().includes(doctorSearch.toLowerCase())
  )

  /* ===================== */
  /* TIME SLOTS */
  /* ===================== */

  const timeSlots = [
    "09:00 AM","09:30 AM","10:00 AM","10:30 AM",
    "11:00 AM","11:30 AM","12:00 PM","12:30 PM",
    "01:00 PM","02:00 PM","02:30 PM","03:00 PM",
    "03:30 PM","04:00 PM","04:30 PM","05:00 PM"
  ]

  /* ===================== */
  /* CREATE APPOINTMENT */
  /* ===================== */

  async function createAppointment() {

    if (!form.doctorId || !form.patientId || !form.date || !form.time) {
      alert("Fill all fields")
      return
    }

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed")
        return
      }

      // refresh list
      fetchData()

      // reset
      setForm({
        doctorId: "",
        patientId: "",
        date: "",
        time: ""
      })

      setPatientSearch("")
      setDoctorSearch("")
      setSpecialization("")

    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    }
  }

  /* ===================== */
  /* UI */
  /* ===================== */

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">

      {/* BOOK APPOINTMENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border rounded-2xl p-8 shadow-sm"
      >

        <h2 className="flex items-center gap-2 text-2xl font-semibold mb-8">
          <Calendar size={22} />
          Book Appointment
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* PATIENT */}
          <div className="relative">
            <label className="text-sm text-gray-500 mb-1 block">Patient</label>

            <div className="flex items-center border rounded-lg h-10 px-3 gap-2">
              <Search size={16} className="text-gray-400" />
              <input
                placeholder="Search patient"
                value={patientSearch}
                onChange={(e) => {
                  setPatientSearch(e.target.value)
                  setShowPatients(true)
                }}
                className="flex-1 outline-none"
              />
            </div>

            {showPatients && patientSearch && (
              <div className="absolute bg-white border w-full rounded-lg mt-1 shadow max-h-40 overflow-y-auto z-10">
                {filteredPatients.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setForm({ ...form, patientId: p.id })
                      setPatientSearch(p.name)
                      setShowPatients(false)
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {p.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SPECIALIZATION */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Category</label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="border rounded-lg h-10 px-3 w-full"
            >
              <option value="">Select</option>
              {specializations.map((s: any) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* DOCTOR */}
          <div className="relative">
            <label className="text-sm text-gray-500 mb-1 block">Doctor</label>

            <div className="flex items-center border rounded-lg h-10 px-3 gap-2">
              <Search size={16} className="text-gray-400" />
              <input
                placeholder="Search doctor"
                value={doctorSearch}
                onChange={(e) => {
                  setDoctorSearch(e.target.value)
                  setShowDoctors(true)
                }}
                className="flex-1 outline-none"
              />
            </div>

            {showDoctors && doctorSearch && (
              <div className="absolute bg-white border w-full rounded-lg mt-1 shadow max-h-40 overflow-y-auto z-10">
                {filteredDoctors.map(d => (
                  <div
                    key={d.id}
                    onClick={() => {
                      setForm({ ...form, doctorId: d.id })
                      setDoctorSearch(d.name)
                      setShowDoctors(false)
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {d.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DATE */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="border rounded-lg h-10 px-3 w-full"
            />
          </div>

          {/* TIME */}
          <div className="col-span-2">
            <label className="text-sm text-gray-500 mb-2 block">Time</label>

            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setForm({ ...form, time: slot })}
                  className={`text-sm border rounded-lg py-1 ${
                    form.time === slot
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

        </div>

        <button
          onClick={createAppointment}
          className="mt-8 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          <CheckCircle size={16} />
          Book Appointment
        </button>

      </motion.div>

      {/* APPOINTMENTS */}
      <div>
        <h2 className="text-2xl font-semibold mb-8">Appointments</h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {appointments.map(a => (
            <div key={a.id} className="bg-white border rounded-2xl p-6 shadow-sm">

              <p className="flex items-center gap-2 text-sm mb-1">
                <User size={14} />
                {a.patient?.name || "No Patient"}
              </p>

              <p className="flex items-center gap-2 text-sm mb-1">
                <Stethoscope size={14} />
                {a.doctor?.name || "No Doctor"}
              </p>

              <p className="flex items-center gap-2 text-sm mb-1">
                <Calendar size={14} />
                {new Date(a.date).toLocaleDateString()}
              </p>

              <p className="flex items-center gap-2 text-sm">
                <Clock size={14} />
                {a.time}
              </p>

            </div>
          ))}

        </div>
      </div>

    </div>
  )
}