"use client"

import { useEffect,useState } from "react"

export default function Queue(){

const [queue,setQueue] = useState<any[]>([])

const load = async()=>{

const res = await fetch("/api/queue")
const data = await res.json()

setQueue(data)

}

useEffect(()=>{

load()

const interval = setInterval(load,3000)

return ()=>clearInterval(interval)

},[])

return(

<div className="p-8 space-y-6">

<h1 className="text-3xl font-bold">
Queue Board
</h1>

<div className="bg-white rounded-xl shadow">

{queue.map((q:any)=>(

<div
key={q.id}
className="p-4 border-b flex justify-between"
>

<span>
Token #{q.token}
</span>

<span>
{q.patient?.name}
</span>

<span>
Dr {q.doctor?.name}
</span>

</div>

))}

</div>

</div>

)

}