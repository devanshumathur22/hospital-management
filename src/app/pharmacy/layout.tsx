"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, List, Receipt, Pill } from "lucide-react"

export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode
}) {

const pathname = usePathname()

const linkClass = (path:string)=>
`flex items-center gap-2 px-3 py-2 rounded ${
pathname === path
? "bg-gray-700"
: "hover:bg-gray-700"
}`

return(

<div className="flex min-h-screen">

{/* Sidebar */}

<aside className="w-64 bg-gray-800 text-white p-6">

<h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
<Pill size={20}/>
Pharmacy
</h2>

<nav className="flex flex-col gap-3">

<Link href="/pharmacy/dashboard" className={linkClass("/pharmacy/dashboard")}>
<LayoutDashboard size={18}/>
Dashboard
</Link>

<Link href="/pharmacy/add-medicine" className={linkClass("/pharmacy/add-medicine")}>
<Package size={18}/>
Add Medicine
</Link>

<Link href="/pharmacy/medicine-list" className={linkClass("/pharmacy/medicine-list")}>
<List size={18}/>
Medicine List
</Link>

<Link href="/pharmacy/billing" className={linkClass("/pharmacy/billing")}>
<Receipt size={18}/>
Billing
</Link>

<Link href="/pharmacy/stock" className={linkClass("/pharmacy/stock")}>
<Package size={18}/>
Stock
</Link>

</nav>

</aside>

{/* Main Content */}

<main className="flex-1 bg-gray-50 p-8">
{children}
</main>

</div>

)

}