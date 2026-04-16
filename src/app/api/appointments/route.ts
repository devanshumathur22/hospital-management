import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

/* AUTH */
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

/* ============================= */
/* GET */
/* ============================= */

export async function GET(req: Request) {
  try {

    const user: any = await getUser()
    if (!user) return NextResponse.json([], { status: 401 })

    const url = new URL(req.url)

    const doctorId = url.searchParams.get("doctorId")
    const date = url.searchParams.get("date")

    /* 🔥 SLOT FILTER (IMPORTANT) */
    if (doctorId && date) {

      const selectedDate = new Date(date)

      const start = new Date(selectedDate.setHours(0, 0, 0, 0))
      const end = new Date(selectedDate.setHours(23, 59, 59, 999))

      const appointments = await prisma.appointment.findMany({
        where: {
          doctorId,
          date: {
            gte: start,
            lt: end
          }
        },
        include: {
          patient: true
        }
      })

      return NextResponse.json(appointments)
    }

    /* NORMAL DATA */

    let appointments: any[] = []

    if (user.role === "patient") {

      const patient = await prisma.patient.findFirst({
        where: { userId: user.id }
      })

      if (!patient) return NextResponse.json([])

      appointments = await prisma.appointment.findMany({
        where: { patientId: patient.id },
        include: { doctor: true }
      })
    }

    else if (user.role === "doctor") {

      const doctor = await prisma.doctor.findFirst({
        where: { userId: user.id }
      })

      if (!doctor) return NextResponse.json([])

    appointments = await prisma.appointment.findMany({
  where: { doctorId: doctor.id },
  include: {
    patient: true
  }
})
    }

    return NextResponse.json(appointments)

  } catch (err) {
    console.log(err)
    return NextResponse.json([], { status: 500 })
  }
}

/* ============================= */
/* POST */
/* ============================= */

export async function POST(req: Request) {
  try {

    const user: any = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const patient = await prisma.patient.findFirst({
      where: { userId: user.id }
    })

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 400 })
    }

    const selectedDate = new Date(body.date)

    /* 🔥 SLOT CHECK */
    const slotTaken = await prisma.appointment.findFirst({
      where: {
        doctorId: body.doctorId,
        time: body.time.trim().toLowerCase(),
        date: {
          gte: new Date(new Date(body.date).setHours(0,0,0,0)),
          lt: new Date(new Date(body.date).setHours(23,59,59,999))
        }
      }
    })

    if (slotTaken) {
      return NextResponse.json(
        { error: "Slot already booked" },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        doctorId: body.doctorId,
        patientId: patient.id,
        date: selectedDate,
        time: body.time,
        status: "pending"
      }
    })

    return NextResponse.json(appointment)

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}