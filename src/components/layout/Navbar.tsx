"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogIn, UserPlus } from "lucide-react"
import { useState } from "react"

export default function Navbar(){

const pathname = usePathname()
const [open,setOpen] = useState(false)

const mainLinks = [
{href:"/doctors",label:"Doctors"},
{href:"/departments",label:"Departments"},
{href:"/services",label:"Services"},
{href:"/lab-tests",label:"Lab-Tests"},
]

const moreLinks = [
{href:"/blog",label:"Blog"},
{href:"/about",label:"About"},
{href:"/contact",label:"Contact"},
{href:"/appointment",label:"Appointment"}
]

return(

<header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200">

<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

{/* LOGO */}

<Link
href="/"
className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:scale-105 transition"
>

🏥 MediCare

</Link>


{/* DESKTOP NAV */}

<nav className="hidden md:flex items-center gap-6 text-sm font-medium">

{mainLinks.map((link)=>{

const active = pathname === link.href

return(

<Link
key={link.href}
href={link.href}
className={`px-3 py-2 transition ${
active
? "text-blue-600"
: "text-gray-700 hover:text-blue-600"
}`}
>

{link.label}

</Link>

)

})}


{/* MORE DROPDOWN */}

<div className="relative group">

<button className="px-3 py-2 text-gray-700 hover:text-blue-600 transition">
More
</button>

<div className="absolute hidden group-hover:block top-10 bg-white shadow-xl rounded-xl p-4 space-y-3 min-w-[150px]">

{moreLinks.map((link)=>{

const active = pathname === link.href

return(

<Link
key={link.href}
href={link.href}
className={`block ${
active
? "text-blue-600"
: "text-gray-700 hover:text-blue-600"
}`}
>

{link.label}

</Link>

)

})}

</div>

</div>


{/* LOGIN */}

<Link
href="/login"
className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
>

<LogIn size={18}/>

Login

</Link>


{/* REGISTER */}

<Link
href="/register"
className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 transition shadow"
>

<UserPlus size={18}/>

Register

</Link>

</nav>


{/* MOBILE BUTTON */}

<button
className="md:hidden"
onClick={()=>setOpen(!open)}
>

{open ? <X/> : <Menu/>}

</button>

</div>


{/* MOBILE MENU */}

{open && (

<div className="md:hidden border-t bg-white px-6 py-6 space-y-4">

{[...mainLinks,...moreLinks].map((link)=>{

const active = pathname === link.href

return(

<Link
key={link.href}
href={link.href}
className={`block ${
active
? "text-blue-600"
: "text-gray-700 hover:text-blue-600"
}`}
>

{link.label}

</Link>

)

})}

<Link
href="/login"
className="block text-gray-700 hover:text-blue-600"
>

Login

</Link>

<Link
href="/register"
className="block text-blue-600 font-semibold"
>

Register

</Link>

</div>

)}

</header>

)

}