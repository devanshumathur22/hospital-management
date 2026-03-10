"use client"

import { useEffect, useState } from "react"

export default function CursorGlow(){

  const [pos,setPos] = useState({x:0,y:0})

  useEffect(()=>{

    const move = (e:any)=>{
      setPos({x:e.clientX,y:e.clientY})
    }

    window.addEventListener("mousemove",move)

    return ()=> window.removeEventListener("mousemove",move)

  },[])

  return (
    <div
      className="pointer-events-none fixed z-50 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl"
      style={{
        left:pos.x-80,
        top:pos.y-80
      }}
    />
  )
}