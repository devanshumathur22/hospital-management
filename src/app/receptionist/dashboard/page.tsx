"use client"

import Link from "next/link"

export default function Dashboard(){

return(

<div className="space-y-8">

<h1 className="text-3xl font-bold">
Reception Dashboard
</h1>

<div className="grid md:grid-cols-3 gap-6">

<Link
href="/receptionist/patients"
className="bg-white p-6 rounded-xl shadow hover:shadow-lg"
>
Register Patient
</Link>

<Link
href="/receptionist/appointments"
className="bg-white p-6 rounded-xl shadow hover:shadow-lg"
>
Book Appointment
</Link>

<Link
href="/receptionist/queue"
className="bg-white p-6 rounded-xl shadow hover:shadow-lg"
>
Patient Queue
</Link>

</div>

</div>

)

}