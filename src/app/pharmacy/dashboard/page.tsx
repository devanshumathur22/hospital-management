"use client"

import Link from "next/link"
import { Package, List, Receipt, Pill } from "lucide-react"
import { motion } from "framer-motion"

export default function PharmacyDashboard(){

const items = [
{
title:"Add Medicine",
href:"/pharmacy/add-medicine",
icon:Package
},
{
title:"Medicine List",
href:"/pharmacy/medicine-list",
icon:List
},
{
title:"Billing",
href:"/pharmacy/billing",
icon:Receipt
},
{
title:"Stock",
href:"/pharmacy/stock",
icon:Pill
}
]

return(

<div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

<h1 className="text-3xl font-semibold">
Pharmacy Dashboard
</h1>

<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

{items.map((item)=>{

const Icon = item.icon

return(

<motion.div
key={item.title}
whileHover={{y:-4}}
className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition"
>

<Link
href={item.href}
className="p-6 flex flex-col items-center gap-3"
>

<div className="bg-blue-100 p-3 rounded-full">
<Icon size={22} className="text-blue-600"/>
</div>

<p className="font-medium text-center">
{item.title}
</p>

</Link>

</motion.div>

)

})}

</div>

</div>

)

}