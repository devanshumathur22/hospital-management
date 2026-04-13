import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function GET(){

  try {

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if(!token){
      return NextResponse.json(null)
    }

    const decoded:any = jwt.verify(token, process.env.JWT_SECRET!)

    // 🔥 correct mapping
    const nurse = await prisma.nurse.findFirst({
      where:{ userId: decoded.id },
      include: {
        user:{ select:{ email:true } },
        doctor: {
          select: {
            id: true,
            name: true,
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