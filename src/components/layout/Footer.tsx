"use client"

import Link from "next/link"
import { HeartPulse, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer(){

return(

<footer className="bg-gray-900 text-gray-300 mt-0 ">

{/* TOP */}
<div className="max-w-7xl mx-auto px-6 py-4 grid md:grid-cols-4 gap-12">

{/* BRAND */}
<div>

<div className="flex items-center gap-2 mb-4">

<HeartPulse className="text-blue-500"/>

<h2 className="text-xl font-bold text-white">
HospitalCare
</h2>

</div>

<p className="text-gray-400 leading-relaxed">
Providing modern healthcare services with advanced
technology and compassionate care for every patient.
</p>

{/* SOCIAL */}
<div className="flex gap-4 mt-6">

<Facebook className="hover:text-blue-500 cursor-pointer transition"/>
<Twitter className="hover:text-blue-500 cursor-pointer transition"/>
<Instagram className="hover:text-blue-500 cursor-pointer transition"/>

</div>

</div>


{/* QUICK LINKS */}
<div>

<h3 className="text-white font-semibold mb-6">
Quick Links
</h3>

<ul className="space-y-3">

<li>
<Link href="/" className="hover:text-blue-400 transition">
Home
</Link>
</li>

<li>
<Link href="/about" className="hover:text-blue-400 transition">
About
</Link>
</li>

<li>
<Link href="/departments" className="hover:text-blue-400 transition">
Departments
</Link>
</li>

<li>
<Link href="/services" className="hover:text-blue-400 transition">
Services
</Link>
</li>

</ul>

</div>


{/* PAGES */}
<div>

<h3 className="text-white font-semibold mb-6">
Pages
</h3>

<ul className="space-y-3">

<li>
<Link href="/doctors" className="hover:text-blue-400 transition">
Doctors
</Link>
</li>

<li>
<Link href="/appointment" className="hover:text-blue-400 transition">
Appointment
</Link>
</li>

<li>
<Link href="/blog" className="hover:text-blue-400 transition">
Blog
</Link>
</li>

<li>
<Link href="/contact" className="hover:text-blue-400 transition">
Contact
</Link>
</li>

</ul>

</div>


{/* CONTACT */}
<div>

<h3 className="text-white font-semibold mb-6">
Contact
</h3>

<div className="space-y-4">

<div className="flex gap-3 items-center">
<Phone size={18}/>
<span>+91 9876543210</span>
</div>

<div className="flex gap-3 items-center">
<Mail size={18}/>
<span>support@hospital.com</span>
</div>

<div className="flex gap-3 items-center">
<MapPin size={18}/>
<span>Jaipur, Rajasthan</span>
</div>

</div>

{/* NEWSLETTER */}
<div className="mt-6">

<input
placeholder="Your email"
className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm"
/>

<button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg text-white text-sm">
Subscribe
</button>

</div>

</div>

</div>


{/* BOTTOM */}
<div className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">

© {new Date().getFullYear()} HospitalCare. All rights reserved.

</div>

</footer>

)
}