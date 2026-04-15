"use client";

import { useEffect, useState } from "react";

const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DoctorAvailability() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [loading, setLoading] = useState(true);

  /* ============================= */
  /* GET DOCTOR + LOAD DATA */
  /* ============================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/doctors/me");
        const data = await res.json();

        const doc = data.user;

        if (!doc?.id) {
          alert("Doctor not found ❌");
          return;
        }

        setDoctorId(doc.id);

        // Load availability
        const res2 = await fetch(
          `/api/doctors/availability?doctorId=${doc.id}`
        );
        const availability = await res2.json();

        if (availability) {
          setStart(availability.start || "");
          setEnd(availability.end || "");
          setDays(availability.days || []);
        }
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ============================= */
  /* TOGGLE DAYS */
  /* ============================= */
  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  /* ============================= */
  /* VALIDATION */
  /* ============================= */
  const validate = () => {
    if (!start || !end) {
      alert("Select start & end time");
      return false;
    }

    if (start >= end) {
      alert("End must be greater than start");
      return false;
    }

    const startHour = parseInt(start.split(":")[0]);
    const endHour = parseInt(end.split(":")[0]);

    if (endHour - startHour < 2) {
      alert("Minimum 2 hours required");
      return false;
    }

    if (days.length === 0) {
      alert("Select at least 1 day");
      return false;
    }

    return true;
  };

  /* ============================= */
  /* SAVE */
  /* ============================= */
  const handleSave = async () => {
    if (!validate()) return;

    if (!doctorId) {
      alert("Doctor not found ❌");
      return;
    }

    const res = await fetch("/api/doctors/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctorId,
        availability: {
          start,
          end,
          days,
        },
      }),
    });

    if (res.ok) {
      alert("Saved ✅");
    } else {
      alert("Failed ❌");
    }
  };

  /* ============================= */
  /* LOADING */
  /* ============================= */
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  /* ============================= */
  /* UI */
  /* ============================= */
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Doctor Availability</h1>

      {/* TIME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm mb-1">Start Time</p>
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <p className="text-sm mb-1">End Time</p>
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border p-3 rounded"
          />
        </div>
      </div>

      {/* DAYS */}
      <div>
        <p className="text-sm mb-2">Working Days</p>

        <div className="flex flex-wrap gap-2">
          {daysList.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-3 py-1 rounded text-sm ${
                days.includes(day)
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* SAVE */}
      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Save Availability
      </button>
    </div>
  );
}