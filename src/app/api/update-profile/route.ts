import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

const SECRET = process.env.JWT_SECRET!

export async function PUT(req: Request) {

  try {

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let decoded:any

    try{
      decoded = jwt.verify(token, SECRET)
    }catch{
      return NextResponse.json({ error:"Invalid token" },{ status:401 })
    }

    const body = await req.json()

    let updatedUser = null

    /* ================= DOCTOR ================= */

    if (decoded.role === "doctor") {

      const doctor = await prisma.doctor.findFirst({
        where:{ userId: decoded.id }
      })

      updatedUser = await prisma.doctor.update({
        where: { id: doctor?.id },
        data: {
          name: body.name,
          phone: body.phone,
          about: body.about
        }
      })
    }

    /* ================= PATIENT ================= */

    if (decoded.role === "patient") {

      const patient = await prisma.patient.findFirst({
        where:{ userId: decoded.id }
      })

      updatedUser = await prisma.patient.update({
        where: { id: patient?.id },
        data: {
          name: body.name,
          phone: body.phone,
          address: body.address
        }
      })
    }

    /* ================= NURSE ================= */

    if (decoded.role === "nurse") {

      const nurse = await prisma.nurse.findFirst({
        where:{ userId: decoded.id }
      })

      updatedUser = await prisma.nurse.update({
        where: { id: nurse?.id },
        data: {
          name: body.name
        }
      })
    }

    /* ================= ADMIN ================= */

    if (decoded.role === "admin") {

      const admin = await prisma.admin.findFirst({
        where:{ userId: decoded.id }
      })

      updatedUser = await prisma.admin.update({
        where: { id: admin?.id },
        data: {
          name: body.name
        }
      })
    }

    /* ================= RECEPTIONIST ================= */

    if (decoded.role === "receptionist") {

      const rec = await prisma.receptionist.findFirst({
        where:{ userId: decoded.id }
      })

      updatedUser = await prisma.receptionist.update({
        where: { id: rec?.id },
        data: {
          name: body.name
        }
      })
    }

    return NextResponse.json({ user: updatedUser })

  } catch (err) {

    console.log("PROFILE UPDATE ERROR:", err)

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    )
  }
}