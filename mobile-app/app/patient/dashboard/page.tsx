"use client"

import { motion } from "framer-motion"
import { CalendarDays, FileText, ClipboardList, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PatientDashboard() {

  const router = useRouter()

  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    prescriptions: 0
  })

  const [activity, setActivity] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/patient/dashboard", { credentials: "include" })
        const data = await res.json()

        setStats(data.stats || {})
        setActivity(data.activity || [])
      } catch (err) {
        console.log(err)
      }
    }
    load()
  }, [])

  const cards = [
    {
      title: "Book",
      icon: <CalendarDays size={20} />,
      link: "/patient/doctors",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Appointments",
      icon: <ClipboardList size={20} />,
      link: "/patient/appointments",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Consultations",
      icon: <FileText size={20} />,
      link: "/patient/appointment-history",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      title: "Prescriptions",
      icon: <FileText size={20} />,
      link: "/patient/prescriptions",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "Profile",
      icon: <User size={20} />,
      link: "/patient/profile",
      gradient: "from-orange-500 to-amber-500"
    }
  ]

  return (

    <div className="bg-[#F5F6FA] min-h-screen px-4 py-5 space-y-6">

      {/* 🔥 HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Your health overview
        </p>
      </div>

      {/* 🔥 STATS */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border flex justify-between">

        {["Total", "Upcoming", "Rx"].map((label, i) => (
          <div key={i} className="text-center flex-1">

            <p className="text-xs text-gray-400">{label}</p>
            <h2 className="text-lg font-semibold text-gray-900 mt-1">
              {i === 0 ? stats.total : i === 1 ? stats.upcoming : stats.prescriptions}
            </h2>

          </div>
        ))}

      </div>

      {/* 🔥 QUICK ACTIONS (GLASS + GRADIENT ICONS) */}
      <div className="flex justify-between">

        {cards.map((card, i) => (

          <motion.div
            key={i}
            whileTap={{ scale: 0.85 }}
            whileHover={{ y: -3 }}
            onClick={() => router.push(card.link)}
            className="flex flex-col items-center gap-2 w-[22%]"
          >

            {/* GLASS ICON BOX */}
            <div className="relative w-14 h-14 rounded-2xl bg-white/40 backdrop-blur-md border border-white/30 shadow-lg flex items-center justify-center">

              {/* GRADIENT INNER */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-inner`}>

                <div className="text-white">
                  {card.icon}
                </div>

              </div>

              {/* LIGHT REFLECTION */}
              <div className="absolute top-1 left-1 w-6 h-2 bg-white/40 rounded-full blur-sm"></div>

            </div>

            <p className="text-xs text-center text-gray-700 font-medium">
              {card.title}
            </p>

          </motion.div>

        ))}

      </div>

      {/* 🔥 ACTIVITY */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border">

        <h2 className="text-sm font-semibold text-gray-800 mb-3">
          Recent Activity
        </h2>

        {activity.length === 0 ? (
          <p className="text-gray-400 text-sm">No activity</p>
        ) : (
          <div className="divide-y">

            {activity.map((a: any, i: number) => (

              <div key={i} className="flex justify-between py-2 text-sm">

                <span className="truncate max-w-[70%] text-gray-800">
                  {a.type === "appointment"
                    ? `Dr. ${a.doctor}`
                    : "Prescription added"}
                </span>

                <span className="text-gray-400 text-xs">
                  {new Date(a.date).toLocaleDateString()}
                </span>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* 🔥 FLOAT BUTTON */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => router.push("/patient/doctors")}
        className="fixed bottom-20 right-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center text-xl"
      >
        +
      </motion.button>

    </div>
  )
}