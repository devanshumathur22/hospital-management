"use client"

import { useEffect, useState } from "react"
import { Pill, Search, AlertTriangle } from "lucide-react"

export default function Stock(){

const [data,setData] = useState<any[]>([])
const [search,setSearch] = useState("")
const [filtered,setFiltered] = useState<any[]>([])

useEffect(()=>{

fetch("/api/medicine",{ credentials:"include" })
.then(res=>res.json())
.then((res)=>{
setData(res)
setFiltered(res)
})

},[])



/* AUTO SEARCH */

useEffect(()=>{

const result = data.filter((m:any)=>
m.name?.toLowerCase().includes(search.toLowerCase())
)

setFiltered(result)

},[search,data])



return(

<div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

<h1 className="text-2xl font-semibold">
Medicine Stock
</h1>



{/* SEARCH */}

<div className="relative max-w-sm">

<Search
size={16}
className="absolute left-3 top-3 text-gray-400"
/>

<input
placeholder="Search medicine..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border rounded-lg h-10 pl-9 pr-3 w-full"
/>

</div>



{/* STOCK TABLE */}

<div className="bg-white border rounded-xl overflow-hidden">

<table className="w-full">

<thead className="bg-gray-100 text-sm text-gray-600">

<tr>

<th className="p-4 text-left">Medicine</th>
<th className="p-4 text-left">Stock</th>
<th className="p-4 text-left">Status</th>

</tr>

</thead>



<tbody>

{filtered.map((m:any)=>(

<tr
key={m.id}
className="border-t hover:bg-gray-50"
>

<td className="p-4 flex items-center gap-2">

<Pill size={15}/>

{m.name}

</td>



<td className="p-4">

{m.stock}

</td>



<td className="p-4">

{m.stock < 10 ? (

<span className="flex items-center gap-1 text-red-600 text-sm">

<AlertTriangle size={14}/>

Low Stock

</span>

) : (

<span className="text-green-600 text-sm">
Available
</span>

)}

</td>

</tr>

))}

</tbody>

</table>

</div>



{filtered.length === 0 && (

<p className="text-gray-500">
No medicines found
</p>

)}

</div>

)

}