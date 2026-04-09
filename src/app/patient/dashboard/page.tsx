"use client"

import { motion } from "framer-motion"
import { CalendarDays, FileText, ClipboardList, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PatientDashboard(){

const router = useRouter()

const handleLogout = async()=>{

await fetch("/api/auth/logout",{
method:"POST"
})

localStorage.removeItem("patient") // cleanup

router.push("/login")
}

const cards = [

{
title:"Book Appointment",
desc:"Schedule a new appointment with your preferred doctor.",
icon:<CalendarDays size={28}/>,
color:"from-blue-500 to-blue-600",
bg:"bg-blue-100",
link:"/patient/doctors"
},

{
title:"My Appointments",
desc:"View all upcoming and past appointments.",
icon:<ClipboardList size={28}/>,
color:"from-green-500 to-green-600",
bg:"bg-green-100",
link:"/patient/appointments"
},

{
title:"Prescriptions",
desc:"Check prescriptions provided by your doctors.",
icon:<FileText size={28}/>,
color:"from-purple-500 to-purple-600",
bg:"bg-purple-100",
link:"/patient/prescriptions"
},

{
title:"My Profile",
desc:"Manage your personal details and health profile.",
icon:<User size={28}/>,
color:"from-orange-500 to-orange-600",
bg:"bg-orange-100",
link:"/patient/profile"
}

]

return(

<div className="min-h-screen p-10 bg-gradient-to-br from-blue-50 via-white to-blue-100">

{/* HEADER */}

<div className="flex justify-between items-center mb-12">

<motion.div
initial={{opacity:0,y:-20}}
animate={{opacity:1,y:0}}
transition={{duration:0.6}}
>

<h1 className="text-4xl font-bold mb-2">
Patient Dashboard
</h1>

<p className="text-gray-600">
Manage your appointments, prescriptions and profile easily.
</p>

</motion.div>

{/* 🔥 LOGOUT BUTTON */}

{/* <button
onClick={handleLogout}
className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow"
>

<LogOut size={18}/>

Logout

</button> */}

</div>


{/* GRID */}

<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

{cards.map((card,i)=>(

<motion.div
key={i}
initial={{opacity:0,y:40}}
animate={{opacity:1,y:0}}
transition={{duration:0.5,delay:i*0.1}}
whileHover={{scale:1.05,y:-5}}
onClick={()=>router.push(card.link)}
className="cursor-pointer relative overflow-hidden backdrop-blur-xl bg-white/50 border border-white/40 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all"
>

<div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-3xl bg-gradient-to-r ${card.color}`}></div>

<div className={`w-14 h-14 flex items-center justify-center rounded-xl ${card.bg} mb-5 text-gray-700`}>
{card.icon}
</div>

<h2 className="text-xl font-bold mb-2">
{card.title}
</h2>

<p className="text-gray-600 text-sm">
{card.desc}
</p>

</motion.div>

))}

</div>


{/* FLOAT BUTTON */}

<motion.button
initial={{opacity:0,y:60}}
animate={{opacity:1,y:0}}
transition={{delay:0.6}}
onClick={()=>router.push("/patient/doctors")}
className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl hover:bg-blue-700 flex items-center gap-2"
>

<CalendarDays size={18}/>
Book Appointment

</motion.button>

</div>

)

}