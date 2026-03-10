"use client"

import { motion } from "framer-motion"
import ScrollReveal from "../../components/layout/ScrollReveal"
import { Heart, Brain, Bone, Baby, Stethoscope, Microscope } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
const departments = [
  {
    name: "Cardiology",
    desc: "Advanced heart care with modern diagnostic technology.",
    icon: Heart
  },
  {
    name: "Neurology",
    desc: "Expert treatment for brain and nervous system disorders.",
    icon: Brain
  },
  {
    name: "Orthopedic",
    desc: "Bone and joint treatment with modern surgical solutions.",
    icon: Bone
  },
  {
    name: "Pediatrics",
    desc: "Specialized healthcare services for infants and children.",
    icon: Baby
  },
  {
    name: "General Medicine",
    desc: "Comprehensive healthcare for overall medical conditions.",
    icon: Stethoscope
  },
  {
    name: "Laboratory",
    desc: "Modern diagnostic laboratory with accurate test reports.",
    icon: Microscope
  }
]

export default function Departments() {

  return (

    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-20 px-6">

      <ScrollReveal>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Hospital Departments
        </h1>
      </ScrollReveal>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

        {departments.map((dep, i) => {

          const Icon = dep.icon

          return (

            <ScrollReveal key={i}>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
                className="group p-10 rounded-3xl bg-gradient-to-br from-blue-100 to-white shadow-xl hover:shadow-2xl transition cursor-pointer"
              >

                <div className="mb-6 w-14 h-14 flex items-center justify-center rounded-xl bg-blue-500 text-white group-hover:rotate-12 transition">

                  <Icon size={28} />

                </div>

                <h2 className="text-2xl font-semibold mb-3">
                  {dep.name}
                </h2>

                <p className="text-gray-600">
                  {dep.desc}
                </p>

              </motion.div>

            </ScrollReveal>

          )
        })}

      </div>

    </div>

  )
}