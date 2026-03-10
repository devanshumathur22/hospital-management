"use client"

import { motion } from "framer-motion"
import { FaPhoneAlt, FaAmbulance, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa"

export default function Contact(){

  return(

    <div className="py-20 px-6 bg-gray-50">

      <h1 className="text-4xl font-bold text-center mb-16 text-blue-600">
        Contact & Emergency
      </h1>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">

        {/* Contact Info */}

        <motion.div
        initial={{opacity:0,x:-40}}
        animate={{opacity:1,x:0}}
        className="bg-white p-10 rounded-3xl shadow-xl"
        >

          <h2 className="text-2xl font-bold mb-6">
            Hospital Information
          </h2>

          <div className="space-y-6">

            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-blue-600 text-xl"/>
              <p>Reception: +91 98765 43210</p>
            </div>

            <div className="flex items-center gap-4">
              <FaAmbulance className="text-red-500 text-xl"/>
              <p>Emergency: +91 99999 00000</p>
            </div>

            <div className="flex items-center gap-4">
              <FaEnvelope className="text-blue-600 text-xl"/>
              <p>hospital@email.com</p>
            </div>

            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-green-600 text-xl"/>
              <p>123 Health Street, Medical City, India</p>
            </div>

            <div className="flex items-center gap-4">
              <FaClock className="text-purple-600 text-xl"/>
              <p>Open 24/7 for Emergency</p>
            </div>

          </div>

        </motion.div>


        {/* Emergency Notice */}

        <motion.div
        initial={{opacity:0,x:40}}
        animate={{opacity:1,x:0}}
        className="bg-red-50 border border-red-200 p-10 rounded-3xl shadow-xl"
        >

          <h2 className="text-2xl font-bold mb-6 text-red-600">
            Emergency Notice
          </h2>

          <p className="text-gray-700 mb-4">
            For any medical emergency please contact our
            ambulance service immediately.
          </p>

          <p className="text-gray-700 mb-4">
            Our hospital provides 24/7 emergency care
            with advanced ICU and trauma facilities.
          </p>

          <div className="bg-red-600 text-white text-xl font-bold px-6 py-4 rounded-xl text-center mt-6">
            🚑 Emergency Helpline: 99999 00000
          </div>

        </motion.div>

      </div>


      {/* Map */}

      <div className="max-w-6xl mx-auto mt-16">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Our Location
        </h2>

        <iframe
          src="https://maps.google.com/maps?q=hospital&t=&z=13&ie=UTF8&iwloc=&output=embed"
          className="w-full h-96 rounded-3xl shadow-lg"
        />

      </div>

    </div>
  )
}