"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const daysList = [
  "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
];

export default function DoctorAvailability() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/doctors/me", { credentials: "include" });
        const data = await res.json();

        const doc = data.user;
        if (!doc?.id) {
          toast.error("Doctor not found ❌");
          return;
        }

        setDoctorId(doc.id);

        const res2 = await fetch(
          `/api/doctors/availability?doctorId=${doc.id}`,
          { credentials: "include" }
        );

        const availability = await res2.json();

        // ✅ SAFE SET
        setStart(availability?.start || "");
        setEnd(availability?.end || "");
        setDays(Array.isArray(availability?.days) ? availability.days : []);

      } catch {
        toast.error("Failed to load ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= TOGGLE ================= */
  const toggleDay = (day: string) => {
    setDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!start || !end) {
      toast.error("Select time");
      return false;
    }

    if (!doctorId) {
      toast.error("Doctor missing ❌");
      return false;
    }

    // 🔥 strict HH:mm check
    if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) {
      toast.error("Invalid time format");
      return false;
    }

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;

    if (endMin <= startMin) {
      toast.error("End must be after start");
      return false;
    }

    if (endMin - startMin < 120) {
      toast.error("Minimum 2 hours required");
      return false;
    }

    if (!days.length) {
      toast.error("Select at least 1 day");
      return false;
    }

    return true;
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);

    try {
      const res = await fetch("/api/doctors/availability", {
        method: "POST",
        credentials: "include",
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

      const data = await res.json();

      if (res.ok) {
        toast.success("Saved ✅");
      } else {
        console.log("ERROR:", data);
        toast.error(data?.error || "Failed ❌");
      }

    } catch (err) {
      console.log(err);
      toast.error("Server error ❌");
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return <div className="p-6 text-sm">Loading...</div>;
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-3xl mx-auto p-6">

      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">

        <h1 className="text-xl font-bold text-gray-800">
          Doctor Availability
        </h1>

        {/* TIME */}
        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm text-gray-600">Start Time</label>
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full border p-3 rounded"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">End Time</label>
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
          <p className="text-sm text-gray-600 mb-2">
            Working Days
          </p>

          <div className="flex flex-wrap gap-2">
            {daysList.map(day => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-1.5 rounded-full text-sm transition
                  ${days.includes(day)
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
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
          disabled={saving}
          className={`w-full py-3 rounded-lg text-white font-medium transition
            ${saving
              ? "bg-gray-400"
              : "bg-green-600 hover:bg-green-700"
            }`}
        >
          {saving ? "Saving..." : "Save Availability"}
        </button>

      </div>

    </div>
  );
}