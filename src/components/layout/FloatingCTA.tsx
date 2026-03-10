"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarPlus } from "lucide-react"
import Link from "next/link"

export default function FloatingCTA(){

const [visible,setVisible] = useState(true)
const [lastScroll,setLastScroll] = useState(0)

useEffect(()=>{

const handleScroll = () => {

const currentScroll = window.scrollY

if(currentScroll > lastScroll){
setVisible(false)
}else{
setVisible(true)
}

setLastScroll(currentScroll)

}

window.addEventListener("scroll",handleScroll)

return ()=> window.removeEventListener("scroll",handleScroll)

},[lastScroll])


return(

<AnimatePresence>

{visible && (

<motion.div

initial={{opacity:0,y:100}}
animate={{opacity:1,y:0}}
exit={{opacity:0,y:100}}
transition={{duration:0.4}}

className="fixed bottom-8 right-8 z-50"

>

<Link
href="/appointment"
className="flex items-center gap-3 px-6 py-4 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition backdrop-blur-xl"
>

<CalendarPlus size={20}/>

Book Appointment

</Link>

</motion.div>

)}

</AnimatePresence>

)

}