import Link from "next/link";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}

      <aside className="w-64 bg-green-700 text-white p-6">

        <h1 className="text-2xl font-bold mb-8">
          Doctor Panel
        </h1>

        <nav className="flex flex-col gap-4">

          <Link href="/doctor/dashboard">Dashboard</Link>
          <Link href="/doctor/appointments">Appointments</Link>
          <Link href="/doctor/prescriptions">Prescriptions</Link>
          {/* <Link href="/doctor/patients">Patients</Link> */}
          {/* <Link href="/doctor/schedule">Schedule</Link> */}
          <Link href="/doctor/profile">Profile</Link>

        </nav>

      </aside>

      {/* Content */}

      <main className="flex-1 p-10 bg-gray-100">
        {children}
      </main>

    </div>
  );
}