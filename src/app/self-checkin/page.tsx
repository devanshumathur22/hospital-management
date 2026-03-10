"use client"

import { motion } from "framer-motion"
import { Smartphone } from "lucide-react"
import { useState } from "react"

export default function SelfCheckIn() {

const [loading,setLoading] = useState(false)

const handleSubmit = () =>{
setLoading(true)

setTimeout(()=>{
setLoading(false)
alert("Token Generated")
},2000)

}

return(

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">

<motion.div
initial={{opacity:0,scale:.9}}
animate={{opacity:1,scale:1}}
transition={{duration:.4}}
className="bg-white p-10 rounded-2xl shadow-xl w-[420px]"
>

<div className="flex items-center gap-3 mb-6">

<div className="p-3 bg-blue-100 rounded-xl">
<Smartphone className="text-blue-600"/>
</div>

<h1 className="text-2xl font-bold text-gray-800">
Self Check-In
</h1>

</div>

<input
type="text"
placeholder="Enter Mobile Number"
className="w-full border rounded-xl p-3 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
/>

<button
onClick={handleSubmit}
className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
>

{loading ? (
<div className="flex justify-center">
<div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
</div>
) : "Generate Token"}

</button>

</motion.div>

</div>

)

}