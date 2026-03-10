"use client"

import { HeartPulse } from "lucide-react"

export default function MedicalLoader() {

return (

<div className="fixed inset-0 bg-white flex items-center justify-center z-50">

<div className="flex flex-col items-center">

{/* Heart Icon */}

<div className="animate-pulse text-red-500">

<HeartPulse size={70} />

</div>

{/* Heartbeat Line */}

<div className="mt-6 w-40 h-1 bg-gray-200 overflow-hidden rounded-full">

<div className="h-full bg-red-500 animate-[heartbeat_1.2s_infinite]" />

</div>

<p className="mt-4 text-gray-600 font-medium">
Loading Medical Services...
</p>

</div>

<style jsx>{`

@keyframes heartbeat {
0% { transform: translateX(-100%); }
50% { transform: translateX(20%); }
100% { transform: translateX(100%); }
}

`}</style>

</div>

)

}