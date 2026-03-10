import Link from "next/link";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}

      <aside className="w-64 bg-blue-600 text-white p-6">

        <h1 className="text-2xl font-bold mb-8">
          Patient Panel
        </h1>

        <nav className="flex flex-col gap-4">

          <Link href="/patient/dashboard">Dashboard</Link>
          <Link href="/patient/doctors">Doctors</Link>
          <Link href="/patient/appointments">Appointments</Link>
          <Link href="/patient/prescriptions">Prescriptions</Link>
          {/* <Link href="/patient/medical-records">Medical Records</Link> */}
          <Link href="/patient/appointment-history">Appointment History</Link>
          <Link href="/patient/profile">Profile</Link>

        </nav>

      </aside>

      {/* Page content */}

      <main className="flex-1 p-10 bg-gray-100">
        {children}
      </main>

    </div>
  );
}