"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function ReceptionistLayout({
children,
}:{
children:React.ReactNode
}){

const path = usePathname()

const menu = [

{ name:"Dashboard", href:"/receptionist/dashboard" },
{ name:"Patients", href:"/receptionist/patients" },
{ name:"Appointments", href:"/receptionist/appointments" },
{ name:"Queue", href:"/receptionist/queue" }

]

return(

<div className="flex min-h-screen">

<aside className="w-64 bg-blue-700 text-white p-6">

<h1 className="text-2xl font-bold mb-10">
Reception
</h1>

<nav className="space-y-3">

{menu.map(item=>(

<Link
key={item.href}
href={item.href}
className={`block px-4 py-2 rounded

${path === item.href
? "bg-white text-blue-700"
: "hover:bg-blue-600"
}

`}
>

{item.name}

</Link>

))}

</nav>

</aside>

<main className="flex-1 p-8 bg-gray-100">
{children}
</main>

</div>

)

}