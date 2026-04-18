"use client"

import { useEffect,useState } from "react"
import {
Users,
UserPlus,
Calendar,
Activity
} from "lucide-react"
import { motion } from "framer-motion"
import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"

export default function AdminReports(){

const [stats,setStats] = useState<any>(null)
const [loading,setLoading] = useState(true)

/* 🔥 CHART DATA (dummy for now) */
const chartData = [
{ day:"Mon", appointments:5 },
{ day:"Tue", appointments:8 },
{ day:"Wed", appointments:6 },
{ day:"Thu", appointments:10 },
{ day:"Fri", appointments:7 },
{ day:"Sat", appointments:4 },
{ day:"Sun", appointments:2 },
]

useEffect(()=>{

fetch("/api/stats",{ credentials:"include" })
.then(res=>res.json())
.then(data=>setStats(data))
.catch(()=>setStats(null))
.finally(()=>setLoading(false))

},[])

/* LOADING */
if(loading){
return(
<div className="flex items-center justify-center min-h-screen text-sm">
Loading reports...
</div>
)
}

return(

<div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">

{/* TITLE */}
<h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
Reports & Analytics
</h1>

{/* STATS */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">

{[
{
label:"Doctors",
value:stats?.doctors || 0,
icon:Users,
color:"bg-blue-100 text-blue-600"
},
{
label:"Patients",
value:stats?.patients || 0,
icon:UserPlus,
color:"bg-green-100 text-green-600"
},
{
label:"Appointments",
value:stats?.appointments || 0,
icon:Calendar,
color:"bg-purple-100 text-purple-600"
},
{
label:"Today",
value:stats?.today || 0,
icon:Activity,
color:"bg-orange-100 text-orange-600"
}
].map((card,i)=>{

const Icon = card.icon

return(

<motion.div
key={i}
whileHover={{y:-4}}
className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition"
>

<div className="flex items-center justify-between">

<div>
<p className="text-xs text-gray-500">{card.label}</p>
<h2 className="text-lg sm:text-2xl font-bold">{card.value}</h2>
</div>

<div className={`p-2 sm:p-3 rounded-lg ${card.color}`}>
<Icon size={18}/>
</div>

</div>

</motion.div>

)

})}

</div>

{/* 🔥 CHART SECTION */}
<div className="bg-white border rounded-2xl p-4 sm:p-6 shadow">

<h2 className="text-sm sm:text-lg font-semibold mb-4">
Appointments Trend (Weekly)
</h2>

<div className="h-[250px] sm:h-[300px]">

<ResponsiveContainer width="100%" height="100%">
<LineChart data={chartData}>
<XAxis dataKey="day" />
<YAxis />
<Tooltip />
<Line
type="monotone"
dataKey="appointments"
strokeWidth={3}
/>
</LineChart>
</ResponsiveContainer>

</div>

</div>

</div>

)
}