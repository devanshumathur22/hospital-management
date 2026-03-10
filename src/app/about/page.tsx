"use client"

import { useState, useEffect } from "react"
import ScrollReveal from "../../components/layout/ScrollReveal"

export default function About() {

  const doctors = [
    {
      name: "Dr. John Smith",
      specialty: "Cardiologist",
      img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7"
    },
    {
      name: "Dr. Emily Clark",
      specialty: "Neurologist",
      img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2"
    },
    {
      name: "Dr. Robert Brown",
      specialty: "Orthopedic",
      img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e"
    }
  ]

  const [index,setIndex] = useState(0)

  useEffect(()=>{
    const interval = setInterval(()=>{
      setIndex((prev)=> (prev+1) % doctors.length)
    },3000)

    return ()=>clearInterval(interval)

  },[])

  return (
    <div className="bg-white">

      {/* HERO */}

      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">

        <h1 className="text-5xl font-bold mb-6 animate-pulse">
          About Our Hospital
        </h1>

        <p className="max-w-2xl mx-auto text-lg">
          Delivering world class healthcare with modern
          technology and experienced doctors.
        </p>

      </section>


      {/* HOSPITAL STORY */}

      <section className="py-20 px-6">

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          <ScrollReveal>
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
              className="rounded-3xl shadow-xl"
            />
          </ScrollReveal>

          <ScrollReveal>
            <div>

              <h2 className="text-3xl font-bold mb-4">
                Our Story
              </h2>

              <p className="text-gray-600 mb-4">
                Our hospital was founded with the mission
                of providing high quality healthcare to
                every patient with compassion and dedication.
              </p>

              <p className="text-gray-600">
                We combine advanced medical technology
                with expert doctors to ensure the best
                treatment and patient safety.
              </p>

            </div>
          </ScrollReveal>

        </div>

      </section>


      {/* SERVICES */}

      <section className="py-20 bg-gray-50 px-6">

        <h2 className="text-3xl font-bold text-center mb-12">
          Our Services
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {["Cardiology","Neurology","Orthopedics","Radiology","Emergency","Surgery"].map(service=>(
            <div
            key={service}
            className="bg-white p-8 rounded-2xl shadow hover:scale-105 transition"
            >
              <h3 className="text-xl font-semibold mb-2">
                {service}
              </h3>
              <p className="text-gray-500 text-sm">
                Advanced treatment with experienced doctors.
              </p>
            </div>
          ))}

        </div>

      </section>


      {/* FACILITIES */}

      <section className="py-20 px-6">

        <h2 className="text-3xl font-bold text-center mb-12">
          Hospital Facilities
        </h2>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto text-center">

          {["24/7 Emergency","Modern Equipment","ICU Care","Laboratory"].map(f=>(
            <div
            key={f}
            className="p-6 bg-white rounded-xl shadow hover:scale-105 transition"
            >
              {f}
            </div>
          ))}

        </div>

      </section>


      {/* STATS */}

      <section className="py-20 bg-blue-600 text-white">

        <div className="grid grid-cols-3 max-w-4xl mx-auto text-center gap-6">

          <div>
            <h2 className="text-4xl font-bold">50+</h2>
            <p>Doctors</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">10K+</h2>
            <p>Patients</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">25+</h2>
            <p>Departments</p>
          </div>

        </div>

      </section>


      {/* DOCTOR SLIDER */}

      <section className="py-20 px-6">

        <h2 className="text-3xl font-bold text-center mb-12">
          Our Doctors
        </h2>

        <div className="max-w-md mx-auto text-center">

          <img
            src={doctors[index].img}
            className="rounded-full w-40 h-40 object-cover mx-auto mb-4"
          />

          <h3 className="text-xl font-semibold">
            {doctors[index].name}
          </h3>

          <p className="text-gray-500">
            {doctors[index].specialty}
          </p>

        </div>

      </section>


      {/* GALLERY */}

      {/* <section className="py-20 bg-gray-50 px-6">

        <h2 className="text-3xl font-bold text-center mb-12">
          Hospital Gallery
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {[1,2,3,4,5,6].map(i=>(
            <img
              key={i}
              src={`https://source.unsplash.com/600x400/?hospital,${i}`}
              className="rounded-xl shadow hover:scale-105 transition"
            />
          ))}

        </div>

      </section> */}

    </div>
  )
}