"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import { useEffect, useState } from "react"
import { HeartPulse, Ambulance, Activity, Stethoscope } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { MonitorSmartphone, UserCheck, Ticket } from "lucide-react"
import Link from "next/link"

export default function Home(){

const {scrollYProgress} = useScroll()

const scaleX = useSpring(scrollYProgress,{
stiffness:100,
damping:30
})

const [loading,setLoading] = useState(true)

const [count,setCount] = useState({
years:0,
staff:0,
patients:0
})

useEffect(()=>{

setTimeout(()=>{
setLoading(false)
},2000)

let y=0
let s=0
let p=0

const interval=setInterval(()=>{

if(y<15) y++
if(s<50) s+=2
if(p<10000) p+=200

setCount({
years:y,
staff:s,
patients:p
})

},40)

return ()=>clearInterval(interval)

},[])


if(loading){

return(

<div className="fixed inset-0 bg-white flex items-center justify-center z-50">

<div className="flex flex-col items-center">

<div className="text-red-500 animate-pulse">

<HeartPulse size={80}/>

</div>

<div className="w-40 h-1 bg-gray-200 mt-6 overflow-hidden rounded-full">

<div className="h-full bg-red-500 animate-[heartbeat_1.2s_linear_infinite]"/>

</div>

<p className="mt-5 text-gray-500">
Loading Medical Services...
</p>

</div>

<style jsx>{`

@keyframes heartbeat {
0%{transform:translateX(-100%)}
50%{transform:translateX(20%)}
100%{transform:translateX(100%)}
}

`}</style>

</div>

)

}

return(

<div className="bg-white overflow-hidden">


{/* SCROLL BAR */}

<motion.div
style={{scaleX}}
className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 origin-left z-50"
/>



{/* HERO */}

<section className="relative h-[90vh] flex items-center justify-center text-white">

<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3')] bg-cover bg-center"/>

<div className="absolute inset-0 bg-black/60"/>

<motion.div
initial={{opacity:0,y:50}}
animate={{opacity:1,y:0}}
transition={{duration:1}}
className="relative text-center max-w-3xl px-6"
>

<h1 className="text-5xl md:text-6xl font-bold mb-6">
Advanced Healthcare For Everyone
</h1>

<p className="text-lg mb-8 opacity-90">
Modern technology and trusted healthcare services.
</p>

<button className="px-10 py-4 bg-blue-600 rounded-full hover:bg-blue-700 transition hover:scale-105 shadow-xl">
Book Appointment
</button>

</motion.div>

</section>



{/* DEPARTMENTS */}

<section className="py-24 max-w-6xl mx-auto px-6">

<h2 className="text-4xl font-bold text-center mb-16">
Hospital Departments
</h2>

<div className="grid md:grid-cols-3 gap-8">

{["Cardiology","Neurology","Orthopedic"].map((item,i)=>(

<motion.div
key={i}
whileHover={{y:-8}}
className="p-10 bg-white border rounded-2xl shadow-lg hover:shadow-2xl transition"
>

<h3 className="text-xl font-semibold text-blue-600 mb-3">
{item}
</h3>

<p className="text-gray-600">
Expert treatment with advanced equipment.
</p>

</motion.div>

))}

</div>

</section>



{/* SERVICES */}

<section className="py-24 bg-gray-50">

<h2 className="text-4xl font-bold text-center mb-16">
Hospital Services
</h2>

<div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">

{[
{icon:HeartPulse,title:"Heart Care"},
{icon:Ambulance,title:"Emergency"},
{icon:Activity,title:"Diagnostics"},
{icon:Stethoscope,title:"Consultation"}
].map((s,i)=>{

const Icon=s.icon

return(

<motion.div
key={i}
whileHover={{scale:1.05}}
className="p-8 bg-white rounded-2xl shadow-lg text-center hover:shadow-2xl transition"
>

<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">

<Icon className="text-blue-600"/>

</div>

<h3 className="font-semibold">
{s.title}
</h3>

</motion.div>

)

})}

</div>

</section>

{/* STATS */}

<section className="py-24 bg-blue-600 text-white">

<div className="grid md:grid-cols-4 gap-10 max-w-6xl mx-auto text-center">

<div>
<h2 className="text-4xl font-bold">{count.years}+</h2>
<p>Years Experience</p>
</div>

<div>
<h2 className="text-4xl font-bold">{count.staff}+</h2>
<p>Medical Staff</p>
</div>

<div>
<h2 className="text-4xl font-bold">{count.patients}+</h2>
<p>Patients</p>
</div>

<div>
<h2 className="text-4xl font-bold">24/7</h2>
<p>Emergency</p>
</div>

</div>

</section>

{/* TESTIMONIALS */}

<section className="py-24">

<h2 className="text-4xl font-bold text-center mb-16">
What Our Patients Say
</h2>

<div className="max-w-5xl mx-auto px-6">

<Swiper
spaceBetween={30}
slidesPerView={1}
loop={true}
>

{[
{
name:"Rahul Sharma",
review:"The doctors were very professional and caring. Highly recommended!"
},
{
name:"Anjali Verma",
review:"Excellent facilities and friendly staff. Great experience."
},
{
name:"Rohit Mehta",
review:"Quick diagnosis and very supportive doctors."
}
].map((item,i)=>(

<SwiperSlide key={i}>

<div className="bg-white shadow-xl rounded-2xl p-10 text-center">

<p className="text-lg text-gray-600 mb-6">
“{item.review}”
</p>

<h4 className="font-semibold text-blue-600">
{item.name}
</h4>

</div>

</SwiperSlide>

))}

</Swiper>

</div>

</section>



{/* FACILITIES */}

<section className="py-24 bg-white">

<h2 className="text-4xl font-bold text-center mb-16">
Hospital Facilities
</h2>

<div className="grid md:grid-cols-4 gap-10 max-w-6xl mx-auto px-6">

{[
{icon:"💉",title:"ICU Care"},
{icon:"🧪",title:"Pathology Lab"},
{icon:"💊",title:"Pharmacy"},
{icon:"🚑",title:"Ambulance"}
].map((item,i)=>(

<motion.div
key={i}
whileHover={{scale:1.08}}
className="p-8 rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 to-white text-center hover:shadow-2xl transition"
>

<div className="text-4xl mb-4">
{item.icon}
</div>

<h3 className="font-semibold text-lg">
{item.title}
</h3>

</motion.div>

))}

</div>

</section>

{/* INSURANCE */}

{/* <section className="py-24 bg-gray-50 text-center">

<h2 className="text-4xl font-bold mb-16">
Insurance Partners
</h2>

<div className="flex flex-wrap justify-center gap-12">

<img src="/insurance1.png" className="h-12"/>
<img src="/insurance2.png" className="h-12"/>
<img src="/insurance3.png" className="h-12"/>
<img src="/insurance4.png" className="h-12"/>

</div>

</section>
 */}


{/* EMERGENCY */}

{/* <section className="py-20 bg-red-600 text-white text-center">

<h2 className="text-3xl font-bold mb-4">
Emergency?
</h2>

<p className="mb-6">
Call immediately for urgent medical help.
</p>

<a
href="tel:+919876543210"
className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold"
>
Call Now
</a>

</section> */}

{/* HOSPITAL SYSTEM */}

<section className="py-24 bg-gradient-to-b from-blue-50 to-white">

<h2 className="text-4xl font-bold text-center mb-16">
Hospital Smart Services
</h2>

<div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto px-6">

{/* KIOSK */}

<Link href="/kiosk">

<motion.div
whileHover={{scale:1.05}}
whileTap={{scale:0.97}}
className="group cursor-pointer p-10 rounded-3xl shadow-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-center transition-all duration-300 hover:shadow-2xl"
>

<div className="flex justify-center mb-6">

<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition">

<MonitorSmartphone size={30}/>

</div>

</div>

<h3 className="text-xl font-semibold mb-2">
Self Service Kiosk
</h3>

<p className="text-sm opacity-90">
Register patients, book appointments and manage payments
</p>

</motion.div>

</Link>



{/* SELF CHECK IN */}

<Link href="/self-checkin">

<motion.div
whileHover={{scale:1.05}}
whileTap={{scale:0.97}}
className="group cursor-pointer p-10 rounded-3xl shadow-xl bg-gradient-to-br from-green-500 to-emerald-400 text-white text-center transition-all duration-300 hover:shadow-2xl"
>

<div className="flex justify-center mb-6">

<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition">

<UserCheck size={30}/>

</div>

</div>

<h3 className="text-xl font-semibold mb-2">
Self Check-In
</h3>

<p className="text-sm opacity-90">
Patients can quickly check-in using their mobile number
</p>

</motion.div>

</Link>

</div>

</section>

</div>

)
}