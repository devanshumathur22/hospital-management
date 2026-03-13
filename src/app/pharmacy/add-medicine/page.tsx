"use client"

import { useState } from "react"

export default function AddMedicine(){

const [form,setForm] = useState({
name:"",
company:"",
price:"",
stock:""
})

const submit = async()=>{

await fetch("/api/medicine",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
})

alert("Medicine Added")

}

return(

<div className="p-10 space-y-4">

<h1 className="text-2xl font-semibold">
Add Medicine
</h1>

<input
placeholder="Medicine Name"
className="border p-2 w-full"
onChange={(e)=>setForm({...form,name:e.target.value})}
/>

<input
placeholder="Company"
className="border p-2 w-full"
onChange={(e)=>setForm({...form,company:e.target.value})}
/>

<input
placeholder="Price"
className="border p-2 w-full"
onChange={(e)=>setForm({...form,price:e.target.value})}
/>

<input
placeholder="Stock"
className="border p-2 w-full"
onChange={(e)=>setForm({...form,stock:e.target.value})}
/>

<button
onClick={submit}
className="bg-green-600 text-white px-4 py-2 rounded"
>
Add Medicine
</button>

</div>

)

}