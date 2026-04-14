"use client"

import Link from "next/link"
import { HeartPulse, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="px-4 mt-10">

      {/* FLOATING GLASS CONTAINER */}
      <div className="max-w-7xl mx-auto 
      bg-white/30 backdrop-blur-2xl 
      border border-white/20 
      rounded-2xl 
      shadow-[0_8px_30px_rgba(0,0,0,0.08)]
      relative overflow-hidden">

        {/* GRADIENT GLOW */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none
        bg-gradient-to-r from-blue-400/20 via-white/10 to-purple-400/20 blur-xl opacity-60"></div>

        {/* TOP */}
        <div className="relative z-10 px-6 py-10 grid md:grid-cols-4 gap-10 text-gray-700">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HeartPulse className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                HospitalCare
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Providing modern healthcare services with advanced
              technology and compassionate care for every patient.
            </p>

            {/* SOCIAL */}
            <div className="flex gap-4 mt-6">
              <Facebook className="hover:text-blue-600 cursor-pointer transition" />
              <Twitter className="hover:text-blue-600 cursor-pointer transition" />
              <Instagram className="hover:text-blue-600 cursor-pointer transition" />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-semibold mb-6 text-gray-900">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-blue-600 transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-blue-600 transition">About</Link></li>
              <li><Link href="/departments" className="hover:text-blue-600 transition">Departments</Link></li>
              <li><Link href="/services" className="hover:text-blue-600 transition">Services</Link></li>
            </ul>
          </div>

          {/* PAGES */}
          <div>
            <h3 className="font-semibold mb-6 text-gray-900">
              Pages
            </h3>

            <ul className="space-y-3">
              <li><Link href="/doctors" className="hover:text-blue-600 transition">Doctors</Link></li>
              <li><Link href="/appointment" className="hover:text-blue-600 transition">Appointment</Link></li>
              <li><Link href="/blog" className="hover:text-blue-600 transition">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition">Contact</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-semibold mb-6 text-gray-900">
              Contact
            </h3>

            <div className="space-y-4 text-gray-700">
              <div className="flex gap-3 items-center">
                <Phone size={18} />
                <span>+91 9876543210</span>
              </div>

              <div className="flex gap-3 items-center">
                <Mail size={18} />
                <span>support@hospital.com</span>
              </div>

              <div className="flex gap-3 items-center">
                <MapPin size={18} />
                <span>Jaipur, Rajasthan</span>
              </div>
            </div>

            {/* NEWSLETTER */}
            <div className="mt-6">
              <input
                placeholder="Your email"
                className="w-full p-3 rounded-lg bg-white/40 border border-white/20 text-sm outline-none"
              />

              <button className="mt-3 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="relative z-10 border-t border-white/20 py-5 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} HospitalCare. All rights reserved.
        </div>

      </div>
    </footer>
  )
}