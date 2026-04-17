"use client"

import { useEffect, useState } from "react"
import { Search, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"

export default function BookPage() {

  const params = useSearchParams()
  const patientIdFromURL = params.get("patientId")

  const [patients,setPatients] = useState<any[]>([])
  const [doctors,setDoctors] = useState<any[]>([])
  const [availability,setAvailability] = useState<any>(null)
  const [bookedSlots,setBookedSlots] = useState<string[]>([])

  const [loading,setLoading] = useState(true)

  const [patientSearch,setPatientSearch] = useState("")
  const [doctorSearch,setDoctorSearch] = useState("")

  const [showPatients,setShowPatients] = useState(false)
  const [showDoctors,setShowDoctors] = useState(false)

  const [form,setForm] = useState({
    doctorId:"",
    patientId:"",
    date:"",
    time:""
  })

  /* 🔥 SLOT GENERATOR */
  function generateSlots(start="09:00",end="17:00",interval=15){
    const slots:any[]=[]
    let [h,m]=start.split(":").map(Number)
    let [eh,em]=end.split(":").map(Number)

    let current=new Date()
    current.setHours(h,m,0,0)

    const endTime=new Date()
    endTime.setHours(eh,em,0,0)

    while(current<=endTime){
      let hrs=current.getHours()
      let mins=current.getMinutes()
      const ampm=hrs>=12?"PM":"AM"
      hrs=hrs%12||12

      slots.push(
        `${hrs.toString().padStart(2,"0")}:${mins
          .toString()
          .padStart(2,"0")} ${ampm}`
      )

      current.setMinutes(current.getMinutes()+interval)
    }

    return slots
  }

  /* 🔥 FETCH DATA */
  useEffect(()=>{

    const load = async()=>{

      const [p,d]=await Promise.all([
        fetch("/api/patients"),
        fetch("/api/doctors")
      ])

      const patientsData = await p.json()
      const doctorsData = await d.json()

      setPatients(patientsData.data || [])
      setDoctors(doctorsData || [])

      setLoading(false)
    }

    load()

  },[])

  /* 🔥 AUTO SELECT PATIENT */
  useEffect(()=>{
    if(patientIdFromURL && patients.length>0){
      const found = patients.find(p=>p.id===patientIdFromURL)
      if(found){
        setForm(prev=>({...prev,patientId:found.id}))
        setPatientSearch(found.name)
      }
    }
  },[patientIdFromURL,patients])

  /* 🔥 FETCH AVAILABILITY */
  useEffect(()=>{
    if(!form.doctorId) return

    const loadAvailability = async()=>{
      try{
        const res = await fetch(`/api/doctors/availability?doctorId=${form.doctorId}`)
        const data = await res.json()
        setAvailability(data)
      }catch(err){
        console.log(err)
      }
    }

    loadAvailability()

  },[form.doctorId])

  /* 🔥 FETCH BOOKED SLOTS */
  useEffect(()=>{
    if(!form.doctorId || !form.date) return

    const loadBooked = async()=>{
      try{
        const res = await fetch(
          `/api/appointments?doctorId=${form.doctorId}&date=${form.date}`
        )
        const data = await res.json()

        const times = data.map((a:any)=>a.time)
        setBookedSlots(times)

      }catch(err){
        console.log(err)
      }
    }

    loadBooked()

  },[form.doctorId,form.date])

  /* 🔥 TIME SLOTS */
  const timeSlots = availability
    ? generateSlots(availability.start, availability.end)
    : []

  /* 🔥 FILTERS */
  const filteredPatients = patients.filter(p =>
    p.name?.toLowerCase().includes(patientSearch.toLowerCase())
  )

  const filteredDoctors = doctors.filter(d =>
    d.name?.toLowerCase().includes(doctorSearch.toLowerCase())
  )

  /* 🔥 DAY CHECK */
  const isAvailableDay = (date:string)=>{
    if(!availability?.days) return true
    const d = new Date(date)
    const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]
    return availability.days.includes(day)
  }

  /* 🔥 CREATE */
  async function createAppointment(){

    if(!form.doctorId || !form.patientId || !form.date || !form.time){
      alert("Fill all fields")
      return
    }

    const res = await fetch("/api/appointments",{
      method:"POST",
      credentials:"include",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(form)
    })

    const data = await res.json()

    if(!res.ok){
      alert(data.error || "Failed")
      return
    }

    alert("Appointment booked ✅")

    setForm({doctorId:"",patientId:"",date:"",time:""})
    setPatientSearch("")
    setDoctorSearch("")
    setAvailability(null)
    setBookedSlots([])
  }

  if(loading){
    return <div className="p-10 text-center">Loading...</div>
  }

  return(

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">

      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          className="bg-white rounded-3xl p-8 shadow-xl space-y-6"
        >

          <h1 className="text-2xl font-bold">
            Book Appointment
          </h1>

          {/* FORM */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* PATIENT */}
            <div className="relative">
              <label className="text-sm mb-1 block">Patient</label>

              <div className="flex items-center border rounded-xl px-3 h-11 bg-gray-50">
                <Search size={16}/>
                <input
                  value={patientSearch}
                  onChange={(e)=>{
                    setPatientSearch(e.target.value)
                    setShowPatients(true)
                  }}
                  className="flex-1 outline-none bg-transparent ml-2"
                />
              </div>

              {showPatients && (
                <div className="absolute bg-white w-full mt-1 border rounded-xl shadow max-h-40 overflow-y-auto z-10">
                  {filteredPatients.map(p=>(
                    <div
                      key={p.id}
                      onClick={()=>{
                        setForm(prev=>({...prev,patientId:p.id}))
                        setPatientSearch(p.name)
                        setShowPatients(false)
                      }}
                      className="p-2 hover:bg-blue-50 cursor-pointer"
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DOCTOR */}
            <div className="relative">
              <label className="text-sm mb-1 block">Doctor</label>

              <div className="flex items-center border rounded-xl px-3 h-11 bg-gray-50">
                <Search size={16}/>
                <input
                  value={doctorSearch}
                  onChange={(e)=>{
                    setDoctorSearch(e.target.value)
                    setShowDoctors(true)
                  }}
                  className="flex-1 outline-none bg-transparent ml-2"
                />
              </div>

              {showDoctors && (
                <div className="absolute bg-white w-full mt-1 border rounded-xl shadow max-h-40 overflow-y-auto z-10">
                  {filteredDoctors.map(d=>(
                    <div
                      key={d.id}
                      onClick={()=>{
                        setForm(prev=>({...prev,doctorId:d.id}))
                        setDoctorSearch(d.name)
                        setShowDoctors(false)
                      }}
                      className="p-2 hover:bg-purple-50 cursor-pointer"
                    >
                      {d.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DATE */}
            <div>
              <label className="text-sm mb-1 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e=>{
                  const value = e.target.value

                  if(!isAvailableDay(value)){
                    alert("Doctor not available this day")
                    return
                  }

                  setForm(prev=>({...prev,date:value}))
                }}
                className="border rounded-xl px-3 h-11 w-full"
              />
            </div>

          </div>

          {/* TIME SLOTS */}
          <div>
            <label className="text-sm mb-2 block">Select Time</label>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">

              {timeSlots.map(slot=>{

                const selected = form.time === slot
                const isBooked = bookedSlots.includes(slot)

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={()=>!isBooked && setForm(prev=>({...prev,time:slot}))}
                    className={`py-2 rounded-xl text-sm font-medium transition

                      ${isBooked
                        ? "bg-red-100 text-red-500 cursor-not-allowed line-through"
                        : selected
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105 ring-2 ring-blue-400"
                          : "bg-white border hover:bg-gray-100"
                      }

                    `}
                  >
                    {isBooked ? `✕ ${slot}` : slot}
                  </button>
                )
              })}

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={createAppointment}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl shadow-lg hover:scale-105 transition"
          >
            <CheckCircle size={18}/>
            Book Appointment
          </button>

        </motion.div>

      </div>

    </div>
  )
}