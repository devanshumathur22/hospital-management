"use client"

import { useEffect, useState } from "react"
import { Search, Stethoscope, User } from "lucide-react"
import { useRouter } from "next/navigation"

/* 🔥 HIGHLIGHT */
function highlight(text:string, query:string){

if(!text) return ""

const parts = text.split(new RegExp(`(${query})`, "gi"))

return parts.map((part,i)=>
part.toLowerCase() === query.toLowerCase()
? <span key={i} className="bg-yellow-200">{part}</span>
: part
)

}

export default function GlobalSearch(){

const [query,setQuery] = useState("")
const [results,setResults] = useState<any[]>([])
const [loading,setLoading] = useState(false)

const router = useRouter()

/* 🔥 DEBOUNCE */
useEffect(()=>{

if(!query){
setResults([])
return
}

const timer = setTimeout(async()=>{

setLoading(true)

const res = await fetch(`/api/search?q=${query}`)
const data = await res.json()

setResults(data || [])
setLoading(false)

},400)

return ()=>clearTimeout(timer)

},[query])

return(

<div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

{/* TITLE */}
<h1 className="text-xl sm:text-2xl font-bold">
Global Search
</h1>

{/* INPUT */}
<div className="relative">

<Search size={16} className="absolute left-3 top-2.5 text-gray-400"/>

<input
value={query}
onChange={(e)=>setQuery(e.target.value)}
placeholder="Search name / phone / MRN..."
className="pl-9 pr-3 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
/>

</div>

{/* LOADING */}
{loading && (
<p className="text-sm text-gray-500">Searching...</p>
)}

{/* EMPTY */}
{!loading && query && results.length === 0 && (
<p className="text-sm text-gray-500">No results found</p>
)}

{/* RESULTS */}
<div className="space-y-3">

{results.map((r:any,i)=>{

const isDoctor = r.type === "doctor"

return(

<div
key={i}
onClick={()=>{

/* 🔥 SMART REDIRECT */
if(isDoctor){
router.push(`/admin/edit-doctor/${r.id}`)
}else{
router.push(`/admin/patients?search=${r.mrn || r.phone || r.name}`)
}

}}
className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition"
>

{/* ICON */}
<div className={`w-8 h-8 flex items-center justify-center rounded-full
${isDoctor ? "bg-blue-100" : "bg-gray-100"}
`}>
{isDoctor
? <Stethoscope size={14}/>
: <User size={14}/>
}
</div>

{/* TEXT */}
<div className="flex-1 space-y-0.5">

{/* NAME */}
<p className="text-sm font-medium">
{highlight(r.name,query)}
</p>

{/* 🔥 MRN */}
{r.mrn && (
<p className="text-[11px] text-blue-600">
MRN: {highlight(r.mrn,query)}
</p>
)}

{/* 🔥 PHONE */}
{r.phone && (
<p className="text-[11px] text-gray-500">
📞 {highlight(r.phone,query)}
</p>
)}

{/* TYPE */}
<p className="text-xs text-gray-400 capitalize">
{r.type}
</p>

</div>

</div>

)

})}

</div>

</div>

)
}