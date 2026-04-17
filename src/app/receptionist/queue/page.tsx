"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function Queue(){

  const [queue,setQueue] = useState<any[]>([])
  const [loading,setLoading] = useState(true)

  /* 🔥 AUTO REFRESH */
  useEffect(()=>{

    const load = async()=>{
      const res = await fetch("/api/queue")
      const data = await res.json()
      setQueue(data || [])
      setLoading(false)
    }

    load()

    const interval = setInterval(load, 5000) // 🔥 refresh every 5 sec

    return ()=>clearInterval(interval)

  },[])

  if(loading){
    return <div className="p-10 text-center">Loading queue...</div>
  }

  return(

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">
          Live Queue
        </h1>

        {/* EMPTY */}
        {queue.length === 0 && (
          <p className="text-gray-500 text-center">
            No patients in queue
          </p>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {queue.map((q:any,i:number)=>{

            const isDone = q.status === "completed"

            return (
              <motion.div
                key={q.id}
                initial={{opacity:0,y:20}}
                animate={{opacity:1,y:0}}
                transition={{delay:i*0.05}}
                className={`rounded-2xl p-6 shadow-lg text-white
                  ${isDone
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : "bg-gradient-to-r from-blue-600 to-purple-600"
                  }`}
              >

                {/* TOKEN BIG */}
                <div className="text-4xl font-bold mb-3">
                  #{q.token}
                </div>

                {/* PATIENT */}
                <p className="text-lg font-semibold">
                  {q.patient?.name || "Patient"}
                </p>

                {/* DOCTOR */}
                <p className="text-sm opacity-80">
                  {q.doctor?.name || "Doctor"}
                </p>

                {/* STATUS */}
                <p className="mt-2 text-xs uppercase tracking-wide">
                  {q.status}
                </p>

              </motion.div>
            )
          })}

        </div>

      </div>

    </div>

  )
}