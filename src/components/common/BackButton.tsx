"use client"

import { useRouter } from "next/navigation"

export default function BackButton(){

const router = useRouter()

return(

<button
onClick={()=>router.back()}
className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition cursor-pointer"
>

← Back

</button>

)

}