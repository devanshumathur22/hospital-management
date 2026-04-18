"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

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

  /* 🔥 FILTERS FIX */
  const filteredPatients = patients.filter(p =>
    p.name?.toLowerCase().includes(patientSearch.toLowerCase())
  )

  const filteredDoctors = doctors.filter(d =>
    d.name?.toLowerCase().includes(doctorSearch.toLowerCase())
  )

  /* 🔥 FORMAT */
  function formatTimeTo12H(time:string){
    const [h,m] = time.split(":").map(Number)
    const ampm = h >= 12 ? "PM" : "AM"
    const hour = h % 12 || 12
    return `${hour.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")} ${ampm}`
  }

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
        fetch("/api/patients",{credentials:"include"}),
        fetch("/api/doctors",{credentials:"include"})
      ])

      const patientsData = await p.json()
      const doctorsData = await d.json()

      setPatients(patientsData.data || [])
      setDoctors(doctorsData || [])

      setLoading(false)
    }
    load()
  },[])

  /* AUTO SELECT */
  useEffect(()=>{
    if(patientIdFromURL && patients.length>0){
      const found = patients.find(p=>p.id===patientIdFromURL)
      if(found){
        setForm(prev=>({...prev,patientId:found.id}))
        setPatientSearch(found.name)
      }
    }
  },[patientIdFromURL,patients])

  /* 🔥 AVAILABILITY */
  useEffect(()=>{
    if(!form.doctorId) return

    fetch(`/api/doctors/availability?doctorId=${form.doctorId}`,{
      credentials:"include"
    })
      .then(res=>res.json())
      .then(setAvailability)

  },[form.doctorId])

  /* 🔥 BOOKED */
  useEffect(()=>{
    if(!form.doctorId || !form.date) return

    fetch(`/api/appointments?doctorId=${form.doctorId}&date=${form.date}`,{
      credentials:"include"
    })
      .then(res=>res.json())
      .then(data=>{
        const times = Array.isArray(data)
          ? data.map((a:any)=>formatTimeTo12H(a.time))
          : []
        setBookedSlots(times)
      })
      .catch(()=>setBookedSlots([]))

  },[form.doctorId,form.date])

  const timeSlots = availability
    ? generateSlots(availability.start, availability.end)
    : []

  const isAvailableDay = (date:string)=>{
    if(!availability?.days) return true
    const d = new Date(date)
    const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]
    return availability.days.includes(day)
  }

  /* 🔥 CREATE */
  async function createAppointment(){

    if(!form.doctorId || !form.patientId || !form.date || !form.time){
      toast.error("Fill all fields")
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
      toast.error(data.error || "Failed")
      return
    }

    toast.success("Appointment booked ✅")
  }

  if(loading){
    return <div className="p-10 text-center">Loading...</div>
  }

  return(
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Book Appointment</h1>

      {/* Patient */}
      <input
        value={patientSearch}
        onChange={(e)=>{
          setPatientSearch(e.target.value)
          setShowPatients(true)
        }}
        placeholder="Search patient"
        className="border p-2 w-full"
      />

      {showPatients && (
        <div>
          {filteredPatients.map(p=>(
            <div key={p.id}
              onClick={()=>{
                setForm(prev=>({...prev,patientId:p.id}))
                setPatientSearch(p.name)
                setShowPatients(false)
              }}>
              {p.name}
            </div>
          ))}
        </div>
      )}

      {/* Doctor */}
      <input
        value={doctorSearch}
        onChange={(e)=>{
          setDoctorSearch(e.target.value)
          setShowDoctors(true)
        }}
        placeholder="Search doctor"
        className="border p-2 w-full mt-3"
      />

      {showDoctors && (
        <div>
          {filteredDoctors.map(d=>(
            <div key={d.id}
              onClick={()=>{
                setForm(prev=>({...prev,doctorId:d.id}))
                setDoctorSearch(d.name)
                setShowDoctors(false)
              }}>
              {d.name}
            </div>
          ))}
        </div>
      )}

      {/* DATE */}
      <input
        type="date"
        value={form.date}
        onChange={(e)=>setForm(prev=>({...prev,date:e.target.value}))}
        className="border p-2 w-full mt-3"
      />

      {/* TIME */}
      <div className="grid grid-cols-4 gap-2 mt-3">
        {timeSlots.map(slot=>(
          <button key={slot}
            onClick={()=>setForm(prev=>({...prev,time:slot}))}
            className="border p-2">
            {slot}
          </button>
        ))}
      </div>

      <button
        onClick={createAppointment}
        className="bg-blue-600 text-white p-2 mt-4 w-full"
      >
        Book
      </button>

    </div>
  )
}