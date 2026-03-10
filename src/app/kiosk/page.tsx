"use client"

import { motion } from "framer-motion"
import { UserPlus, CalendarPlus, CreditCard, Wallet } from "lucide-react"

const cards = [

{
title:"Patient Registration",
icon:UserPlus,
color:"from-yellow-400 to-orange-400"
},

{
title:"Book Appointment",
icon:CalendarPlus,
color:"from-red-400 to-pink-500"
},

{
title:"Pending Payments",
icon:CreditCard,
color:"from-green-400 to-emerald-500"
},

{
title:"Advance Payment",
icon:Wallet,
color:"from-purple-400 to-indigo-500"
}

]

export default function Kiosk(){

return(

<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center">

<h1 className="text-white text-4xl font-bold mb-12">
Hospital Self Service
</h1>

<div className="grid grid-cols-2 gap-8">

{cards.map((card,i)=>{

const Icon = card.icon

return(

<motion.div
key={i}
whileHover={{scale:1.05}}
className={`bg-gradient-to-br ${card.color} p-10 rounded-2xl w-[240px] h-[200px] flex flex-col justify-center items-center shadow-xl cursor-pointer`}
>

<Icon size={40} className="mb-4 text-white"/>

<h2 className="text-white font-semibold text-lg text-center">
{card.title}
</h2>

</motion.div>

)

})}

</div>

</div>

)

}