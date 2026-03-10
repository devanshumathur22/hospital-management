"use client";

import { useEffect, useState } from "react";

export default function AdminAppointments() {

  const [appointments,setAppointments] = useState([]);

  useEffect(()=>{

    fetch("/api/appointments")
    .then(res=>res.json())
    .then(data=>setAppointments(data))

  },[])

  return(

    <div className="p-8 w-full">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-8">
        Appointments
      </h1>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Doctor</th>
              <th className="p-4 text-left">Patient</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>

            </tr>

          </thead>

          <tbody>

            {appointments.map((a:any)=>(

              <tr key={a.id} className="border-t hover:bg-gray-50 transition">

                <td className="p-4 font-medium">
                  {a.doctor?.name || "N/A"}
                </td>

                <td className="p-4">
                  {a.patient?.name || "N/A"}
                </td>

                <td className="p-4">
                  {new Date(a.date).toLocaleDateString()}
                </td>

                <td className="p-4">

                  <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                    {a.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}