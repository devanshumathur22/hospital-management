"use client"

import { useEffect,useState } from "react"
import {
  Users,
  UserPlus,
  Calendar,
  Activity
} from "lucide-react"
import { motion } from "framer-motion"

export default function Dashboard(){

  const [stats,setStats] = useState<any>(null)
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState("")

  /* ================= LOAD ================= */

  useEffect(()=>{

    const load = async()=>{

      try{

        const res = await fetch("/api/stats",{
          credentials:"include" // 🔥 IMPORTANT
        })

        const data = await res.json()

        if(!res.ok){
          setError(data.error || "Failed to load")
        }else{
          setStats(data)
        }

      }catch(err){
        console.log(err)
        setError("Something went wrong")
      }

      setLoading(false)
    }

    load()

  },[])

  /* ================= UI ================= */

  if(loading){
    return <div className="p-10 text-center">Loading dashboard...</div>
  }

  if(error){
    return <div className="p-10 text-center text-red-500">{error}</div>
  }

  return(

    <div className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-10">
        Admin Dashboard
      </h1>

      {/* STATS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* CARD COMPONENT */}
        {[
          {
            title:"Doctors",
            value:stats.doctors,
            icon:<Users size={18}/>,
            bg:"bg-blue-100"
          },
          {
            title:"Patients",
            value:stats.patients,
            icon:<UserPlus size={18}/>,
            bg:"bg-green-100"
          },
          {
            title:"Appointments",
            value:stats.appointments,
            icon:<Calendar size={18}/>,
            bg:"bg-purple-100"
          },
          {
            title:"Today",
            value:stats.today,
            icon:<Activity size={18}/>,
            bg:"bg-orange-100"
          }
        ].map((card,i)=>(

          <motion.div
            key={i}
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{delay:i*0.1}}
            whileHover={{y:-6,scale:1.02}}
            className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
          >

            <div className="flex items-center gap-3 mb-4">

              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${card.bg}`}>
                {card.icon}
              </div>

              <span className="text-sm text-gray-500">
                {card.title}
              </span>

            </div>

            <p className="text-3xl font-bold">
              {card.value}
            </p>

          </motion.div>

        ))}

      </div>

    </div>

  )
}