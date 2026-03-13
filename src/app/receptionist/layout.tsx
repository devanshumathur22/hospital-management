export default function ReceptionistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">

      <aside className="w-64 bg-blue-600 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Reception Panel</h2>

        <nav className="flex flex-col gap-3">

          <a href="/receptionist/dashboard">Dashboard</a>
          <a href="/receptionist/patients">Patients</a>
          <a href="/receptionist/appointments">Appointments</a>
          <a href="/receptionist/doctors">Doctors</a>
          <a href="/receptionist/queue">Queue</a>

        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>

    </div>
  )
}