import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request){

  try {

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

    // 🔥 FIX: doctor include kar
    const nurse = await prisma.nurse.findUnique({
      where:{ id: decoded.id },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            specialization: true
          }
        }
      }
    })

    return NextResponse.json(nurse)

  } catch (error) {

    console.log("NURSE ME ERROR:", error)

    return NextResponse.json(null)

  }
}