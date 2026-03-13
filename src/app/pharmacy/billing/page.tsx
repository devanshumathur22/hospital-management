"use client"

import { useState } from "react"

export default function Billing(){

const [medicine,setMedicine] = useState("")
const [qty,setQty] = useState("")
const [price,setPrice] = useState("")

const total = Number(qty) * Number(price)

return(

<div className="p-10 space-y-4">

<h1 className="text-2xl font-semibold">
Pharmacy Billing
</h1>

<input
placeholder="Medicine"
className="border p-2 w-full"
onChange={(e)=>setMedicine(e.target.value)}
/>

<input
placeholder="Quantity"
className="border p-2 w-full"
onChange={(e)=>setQty(e.target.value)}
/>

<input
placeholder="Price"
className="border p-2 w-full"
onChange={(e)=>setPrice(e.target.value)}
/>

<div className="text-lg font-semibold">
Total: ₹{total}
</div>

<button
className="bg-blue-600 text-white px-4 py-2 rounded"
>
Generate Bill
</button>

</div>

)

}