"use client"

import { useEffect,useState } from "react"

export default function Queue(){

const [queue,setQueue] = useState<any[]>([])

useEffect(()=>{

fetch("/api/queue")
.then(res=>res.json())
.then(setQueue)

},[])

return(

<div className="p-6">

<h1 className="text-xl font-semibold mb-4">
Queue
</h1>

{queue.map(q=>(

<div key={q.id} className="border p-4 mb-3 rounded">

<p>Token: {q.token}</p>
<p>Patient: {q.patient?.name}</p>
<p>Status: {q.status}</p>

</div>

))}

</div>

)

}