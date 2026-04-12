import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

const SECRET = process.env.JWT_SECRET!

export async function GET() {

  try {
    const cookieStore = await cookies() // ✅ FIX
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    const decoded: any = jwt.verify(token, SECRET)

    let user = null

    if (decoded.role === "doctor") {
      user = await prisma.doctor.findUnique({
        where: { id: decoded.id }
      })
    }

    if (decoded.role === "admin") {
      user = await prisma.admin.findUnique({
        where: { id: decoded.id }
      })
    }

    if (decoded.role === "patient") {
      user = await prisma.patient.findUnique({
        where: { id: decoded.id }
      })
    }

    if (decoded.role === "receptionist") {
      user = await prisma.receptionist.findUnique({
        where: { id: decoded.id }
      })
    }

    if (decoded.role === "nurse") {
      user = await prisma.nurse.findUnique({
        where: { id: decoded.id },
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
    }

    return NextResponse.json({ user })

  } catch {
    return NextResponse.json({ user: null })
  }
}