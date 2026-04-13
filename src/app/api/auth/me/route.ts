import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const SECRET = process.env.JWT_SECRET!

export async function GET() {

  try {

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    let decoded:any

    try{
      decoded = jwt.verify(token, SECRET)
    }catch{
      return NextResponse.json({ user: null })
    }

    let user = null

    /* ================= DOCTOR ================= */

    if (decoded.role === "doctor") {

      user = await prisma.doctor.findFirst({
        where: { userId: decoded.id },
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      })

    }

    /* ================= ADMIN ================= */

    else if (decoded.role === "admin") {

      user = await prisma.admin.findFirst({
        where: { userId: decoded.id },
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      })

    }

    /* ================= PATIENT ================= */

    else if (decoded.role === "patient") {

      user = await prisma.patient.findFirst({
        where: { userId: decoded.id },
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      })

    }

    /* ================= RECEPTIONIST ================= */

    else if (decoded.role === "receptionist") {

      user = await prisma.receptionist.findFirst({
        where: { userId: decoded.id },
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      })

    }

    /* ================= NURSE ================= */

    else if (decoded.role === "nurse") {

      user = await prisma.nurse.findFirst({
        where: { userId: decoded.id },
        include: {
          user: {
            select: {
              email: true
            }
          },
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true
            }
          }
        }
      })

    }

    return NextResponse.json({ user })

  } catch (err) {

    console.log("ME API ERROR:", err)

    return NextResponse.json({ user: null })

  }
}