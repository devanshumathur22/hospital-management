"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Stethoscope,
  CalendarCheck,
  FileText,
  User
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen backdrop-blur-xl bg-white/70 border-r border-gray-200 shadow-sm p-6">

      {/* Title */}
      <h2 className="text-xl font-bold text-blue-600 mb-10 flex items-center gap-2">
        🏥 Patient Panel
      </h2>

      {/* Menu */}
      <div className="flex flex-col gap-3 text-sm font-medium">

        <Link
          href="/patient/dashboard"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 cursor-pointer"
        >
          <LayoutDashboard size={18}/>
          Dashboard
        </Link>

        <Link
          href="/patient/doctors"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-300 cursor-pointer"
        >
          <Stethoscope size={18}/>
          Doctors
        </Link>

        <Link
          href="/patient/appointments"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 cursor-pointer"
        >
          <CalendarCheck size={18}/>
          Appointments
        </Link>

        <Link
          href="/patient/prescriptions"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 cursor-pointer"
        >
          <FileText size={18}/>
          Prescriptions
        </Link>

        <Link
          href="/patient/profile"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-all duration-300 cursor-pointer"
        >
          <User size={18}/>
          Profile
        </Link>

      </div>

    </div>
  );
};

export default Sidebar;