"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditDoctor() {

  const params = useParams();
  const router = useRouter();

  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
    experience: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("/api/doctors")
      .then(res => res.json())
      .then(data => {

        const doc = data.find((d: any) => d.id === params.id);

        if (doc) {
          setDoctor({
            name: doc.name,
            specialization: doc.specialization,
            experience: doc.experience
          });
        }

        setLoading(false);

      });

  }, []);

  const updateDoctor = async (e: any) => {

    e.preventDefault();

    await fetch(`/api/doctors/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...doctor,
        experience: Number(doctor.experience)
      })
    });

    alert("Doctor updated");

    router.push("/admin/doctors");

  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (

    <div className="p-10 flex justify-center">

      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">

        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-6">
          Edit Doctor
        </h1>

        <form
          onSubmit={updateDoctor}
          className="space-y-4"
        >

          <div>

            <label className="text-sm text-gray-500">
              Doctor Name
            </label>

            <input
              className="w-full border p-3 rounded-lg mt-1"
              value={doctor.name}
              onChange={(e) =>
                setDoctor({ ...doctor, name: e.target.value })
              }
            />

          </div>


          <div>

            <label className="text-sm text-gray-500">
              Specialization
            </label>

            <input
              className="w-full border p-3 rounded-lg mt-1"
              value={doctor.specialization}
              onChange={(e) =>
                setDoctor({ ...doctor, specialization: e.target.value })
              }
            />

          </div>


          <div>

            <label className="text-sm text-gray-500">
              Experience (years)
            </label>

            <input
              className="w-full border p-3 rounded-lg mt-1"
              value={doctor.experience}
              onChange={(e) =>
                setDoctor({ ...doctor, experience: e.target.value })
              }
            />

          </div>


          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Update Doctor
          </button>

        </form>

      </div>

    </div>

  );
}