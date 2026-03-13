export default function NurseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">

      <aside className="w-64 bg-green-700 text-white p-6">

        <h2 className="text-xl font-bold mb-6">
          Nurse Panel
        </h2>

        <nav className="flex flex-col gap-4">

          <a href="/nurse/dashboard">Dashboard</a>

          <a href="/nurse/vitals">Patient Vitals</a>
          <a href="/nurse/appointments">Appointments</a>
          <a href="/nurse/patients">Patients</a>

        </nav>

      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>

    </div>
  )
}