import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

const SECRET = process.env.JWT_SECRET!

export async function PUT(req: Request) {

  try {
    const cookie = req.headers.get("cookie")

    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = cookie
      .split(";")
      .find(c => c.trim().startsWith("token="))
      ?.split("=")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded: any = jwt.verify(token, SECRET)

    const body = await req.json()

    let updatedUser = null

    if (decoded.role === "doctor") {
      updatedUser = await prisma.doctor.update({
        where: { id: decoded.id },
        data: body
      })
    }

    if (decoded.role === "admin") {
      updatedUser = await prisma.admin.update({
        where: { id: decoded.id },
        data: body
      })
    }

    if (decoded.role === "patient") {
      updatedUser = await prisma.patient.update({
        where: { id: decoded.id },
        data: body
      })
    }

    if (decoded.role === "receptionist") {
      updatedUser = await prisma.receptionist.update({
        where: { id: decoded.id },
        data: body
      })
    }

    if (decoded.role === "nurse") {
      updatedUser = await prisma.nurse.update({
        where: { id: decoded.id },
        data: body
      })
    }

    return NextResponse.json({ user: updatedUser })

  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}