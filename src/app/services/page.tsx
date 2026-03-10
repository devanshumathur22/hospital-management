"use client"

import { motion } from "framer-motion"
import { FaAmbulance, FaHospital, FaFlask, FaXRay, FaPills, FaHeartbeat } from "react-icons/fa"

const services = [
  {
    name:"Emergency Care",
    icon:<FaHeartbeat/>
  },
  {
    name:"Ambulance",
    icon:<FaAmbulance/>
  },
  {
    name:"ICU",
    icon:<FaHospital/>
  },
  {
    name:"Pharmacy",
    icon:<FaPills/>
  },
  {
    name:"Radiology",
    icon:<FaXRay/>
  },
  {
    name:"Laboratory",
    icon:<FaFlask/>
  }
]

export default function Services(){

  return (

    <div className="py-20 bg-gradient-to-b from-blue-50 to-white">

      <h1 className="text-4xl font-bold text-center mb-16 text-blue-600">
        Our Services
      </h1>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">

        {services.map((s,i)=>(
          
          <motion.div
            key={i}
            initial={{opacity:0,y:40}}
            whileInView={{opacity:1,y:0}}
            whileHover={{scale:1.08}}
            transition={{duration:0.4}}
            className="relative group p-10 rounded-3xl shadow-xl cursor-pointer
            backdrop-blur-lg bg-white/60 border border-blue-100
            overflow-hidden"
          >

            {/* animated border */}

            <div className="absolute inset-0 rounded-3xl border-2 border-transparent 
            group-hover:border-blue-500 transition"/>

            {/* icon */}

            <motion.div
              animate={{y:[0,-5,0]}}
              transition={{repeat:Infinity,duration:2}}
              className="text-4xl text-blue-600 mb-4"
            >
              {s.icon}
            </motion.div>

            {/* title */}

            <h3 className="text-xl font-semibold mb-3">
              {s.name}
            </h3>

            {/* description */}

            <p className="text-gray-600">
              Advanced medical technology and expert doctors
              ensuring quality healthcare.
            </p>

            {/* emoji effect */}

            <motion.div
              initial={{scale:0}}
              whileHover={{scale:1}}
              className="absolute bottom-5 right-5 text-2xl"
            >
              🏥
            </motion.div>

          </motion.div>

        ))}

      </div>

    </div>
  )
}