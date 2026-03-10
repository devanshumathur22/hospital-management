"use client";

import { useEffect, useState } from "react";
import { Users, Stethoscope, CalendarCheck, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
  });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  const cards = [
    {
      title: "Doctors",
      value: stats.doctors,
      icon: Stethoscope,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Patients",
      value: stats.patients,
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Appointments",
      value: stats.appointments,
      icon: CalendarCheck,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Active Today",
      value: stats.appointments,
      icon: Activity,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="p-8 space-y-10">

      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      {/* Stats */}

      <div className="grid md:grid-cols-4 gap-6">

        {cards.map((card, i) => {
          const Icon = card.icon;

          return (
            <div
              key={i}
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition border"
            >
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-gray-500 text-sm">
                    {card.title}
                  </p>
                  <h2 className="text-2xl font-bold">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`p-3 rounded-lg ${card.color}`}
                >
                  <Icon size={22} />
                </div>

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}