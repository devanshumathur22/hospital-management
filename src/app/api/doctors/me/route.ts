// /api/auth/me/route.ts

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(req: Request){

  try{

    const cookie = req.headers.get("cookie")

    if(!cookie){
      return NextResponse.json(null)
    }

    const token = cookie
      .split(";")
      .find(c => c.trim().startsWith("token="))
      ?.split("=")[1]

    if(!token){
      return NextResponse.json(null)
    }

    const decoded:any = jwt.verify(token, process.env.JWT_SECRET!)

    let user = null

    // 🔥 ROLE BASED FETCH
    if(decoded.role === "doctor"){
      user = await prisma.doctor.findUnique({
        where:{ id: decoded.id }
      })
    }

    else if(decoded.role === "patient"){
      user = await prisma.patient.findUnique({
        where:{ id: decoded.id }
      })
    }

    else if(decoded.role === "nurse"){
      user = await prisma.nurse.findUnique({
        where:{ id: decoded.id },
        include:{ doctor:true }
      })
    }

    return NextResponse.json({ user })

  }catch{
    return NextResponse.json(null)
  }

}