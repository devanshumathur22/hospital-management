"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDoctors() {

  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data));
  }, []);


  const deleteDoctor = async (id: string) => {

    await fetch(`/api/doctors/${id}`, {
      method: "DELETE",
    });

    setDoctors((prev) =>
      prev.filter((doc) => doc.id !== id)
    );

  };


  return (
    <div className="p-8 w-full">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Doctors</h1>

        <Link
          href="/admin/add-doctor"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Doctor
        </Link>
      </div>


      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Specialization</th>
              <th className="p-4">Experience</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {doctors.map((doctor) => (

              <tr
                key={doctor.id}
                className="border-t hover:bg-gray-50 transition"
              >

                <td className="p-4 font-medium">
                  {doctor.name}
                </td>

                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {doctor.specialization}
                  </span>
                </td>

                <td className="p-4">
                  {doctor.experience} yrs
                </td>

                <td className="p-4 flex gap-4">

                  <Link
                    href={`/admin/edit-doctor/${doctor.id}`}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteDoctor(doctor.id)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}