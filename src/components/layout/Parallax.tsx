"use client"

import { motion,useScroll,useTransform } from "framer-motion"

export default function Parallax(){

  const {scrollYProgress} = useScroll()

  const y = useTransform(scrollYProgress,[0,1],[0,300])

  return (

    <section className="h-[70vh] overflow-hidden relative">

      <motion.img
        style={{y}}
        src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
        className="absolute w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">

        <h1 className="text-5xl text-white font-bold">
          Modern Healthcare
        </h1>

      </div>

    </section>
  )
}