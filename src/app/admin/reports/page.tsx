"use client"

import { useEffect,useState } from "react"
import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"

export default function AdminReports(){

const [data,setData] = useState<any[]>([])

useEffect(()=>{

fetch("/api/stats")
.then(res=>res.json())
.then(stats=>{

setData([
{ name:"Doctors", value: stats.doctors },
{ name:"Patients", value: stats.patients },
{ name:"Appointments", value: stats.appointments },
{ name:"Today", value: stats.today }
])

})

},[])



return(

<div className="p-8 space-y-8">

<h1 className="text-3xl font-bold">
Reports & Analytics
</h1>



<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-semibold mb-4">
Hospital Statistics
</h2>

<div className="h-[400px]">

<ResponsiveContainer width="100%" height="100%">

<BarChart data={data}>

<XAxis dataKey="name" />
<YAxis />
<Tooltip />

<Bar dataKey="value" fill="#3b82f6" />

</BarChart>

</ResponsiveContainer>

</div>

</div>

</div>

)

}