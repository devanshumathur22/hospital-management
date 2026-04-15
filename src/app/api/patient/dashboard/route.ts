import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    return null
  }
}

export async function GET() {
  try {

    const user: any = await getUser()

    if (!user || user.role !== "patient") {
      return NextResponse.json({}, { status: 401 })
    }

    /* 🔥 GET PATIENT */
    const patient = await prisma.patient.findFirst({
      where: { userId: user.id }
    })

    if (!patient) {
      return NextResponse.json({}, { status: 404 })
    }

    /* 🔥 APPOINTMENTS */
    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: { doctor: true }
    })

    /* 🔥 PRESCRIPTIONS */
    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: patient.id }
    })

    /* 🔥 STATS */
    const total = appointments.length

    const upcoming = appointments.filter(a =>
      new Date(a.date) >= new Date()
    ).length

    const stats = {
      total,
      upcoming,
      prescriptions: prescriptions.length
    }

    /* 🔥 ACTIVITY */
    const activity = [
      ...appointments.map(a => ({
        type: "appointment",
        doctor: a.doctor?.name,
        date: a.date
      })),
      ...prescriptions.map(p => ({
        type: "prescription",
        date: p.createdAt
      }))
    ]
    .sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0,5)

    return NextResponse.json({
      stats,
      activity
    })

  } catch (err) {
    console.log("DASHBOARD ERROR:", err)
    return NextResponse.json({}, { status: 500 })
  }
}