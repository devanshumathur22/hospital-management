"use client";

import { useEffect, useState } from "react";

export default function PatientProfile() {

  const [patient, setPatient] = useState<any>(null);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    address: "",
    emergencyContact: ""
  });

  useEffect(() => {

    fetch("/api/patients")
      .then(res => res.json())
      .then(data => {

        setPatient(data);

        setForm({
          name: data?.name || "",
          phone: data?.phone || "",
          gender: data?.gender || "",
          dob: data?.dob || "",
          bloodGroup: data?.bloodGroup || "",
          address: data?.address || "",
          emergencyContact: data?.emergencyContact || ""
        });

      });

  }, []);


  const handleChange = (e:any) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  const handleSave = async () => {

    const res = await fetch("/api/patients", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    setPatient(data);
    setEditing(false);

  };


  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Patient Profile
      </h1>

      <div className="bg-white shadow-md rounded-xl p-6 max-w-2xl">

        {patient && !editing ? (

          <div className="space-y-3">

            <p><b>Name:</b> {patient.name}</p>
            <p><b>Phone:</b> {patient.phone}</p>
            <p><b>Gender:</b> {patient.gender}</p>
            <p><b>DOB:</b> {patient.dob}</p>
            <p><b>Blood Group:</b> {patient.bloodGroup}</p>
            <p><b>Address:</b> {patient.address}</p>
            <p><b>Emergency Contact:</b> {patient.emergencyContact}</p>

            <button
              onClick={() => setEditing(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Edit Profile
            </button>

          </div>

        ) : (

          <div className="grid gap-4">

            <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-2 rounded"
            />

            <input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            placeholder="Phone"
            className="border p-2 rounded"
            />

            <select
            name="gender"
            value={form.gender || ""}
            onChange={handleChange}
            className="border p-2 rounded"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <input
            type="date"
            name="dob"
            value={form.dob || ""}
            onChange={handleChange}
            className="border p-2 rounded"
            />

            <input
            name="bloodGroup"
            value={form.bloodGroup || ""}
            onChange={handleChange}
            placeholder="Blood Group"
            className="border p-2 rounded"
            />

            <input
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            placeholder="Address"
            className="border p-2 rounded"
            />

            <input
            name="emergencyContact"
            value={form.emergencyContact || ""}
            onChange={handleChange}
            placeholder="Emergency Contact"
            className="border p-2 rounded"
            />

            <div className="flex gap-3">

              <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>

              <button
              onClick={() => setEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}