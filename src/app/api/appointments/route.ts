import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

/* ================= AUTH ================= */

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

/* ================= GET ================= */

export async function GET(req: Request) {
  try {

    const user: any = await getUser()
    if (!user) return NextResponse.json([], { status: 401 })

    const url = new URL(req.url)
    const doctorId = url.searchParams.get("doctorId")
    const date = url.searchParams.get("date")

    /* 🔥 SLOT FILTER (booking page ke liye) */
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
        include: { patient: true },
        orderBy: { token: "asc" }
      })

      return NextResponse.json(appointments)
    }

    /* ================= ROLE BASE ================= */

    let appointments: any[] = []

    /* ===== PATIENT ===== */
    if (user.role === "patient") {

      const patient = await prisma.patient.findFirst({
        where: { userId: user.id }
      })

      if (!patient) return NextResponse.json([])

      appointments = await prisma.appointment.findMany({
        where: { patientId: patient.id },
        include: { doctor: true },
        orderBy: { createdAt: "desc" }
      })
    }

    /* ===== DOCTOR ===== */
    else if (user.role === "doctor") {

      const doctor = await prisma.doctor.findFirst({
        where: { userId: user.id }
      })

      if (!doctor) return NextResponse.json([])

      appointments = await prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        include: { patient: true },
        orderBy: { token: "asc" }
      })
    }

    /* ===== NURSE ===== */
    else if (user.role === "nurse") {

      const nurse = await prisma.nurse.findFirst({
        where: { userId: user.id }
      })

      if (!nurse || !nurse.doctorId) return NextResponse.json([])

      appointments = await prisma.appointment.findMany({
        where: { doctorId: nurse.doctorId },
        include: { patient: true },
        orderBy: { token: "asc" }
      })
    }

    /* ===== ADMIN ===== */
    else if (user.role === "admin") {

      appointments = await prisma.appointment.findMany({
        include: {
          patient: true,
          doctor: true
        },
        orderBy: { createdAt: "desc" }
      })
    }

    return NextResponse.json(appointments)

  } catch (err) {
    console.log(err)
    return NextResponse.json([], { status: 500 })
  }
}

/* ================= POST ================= */

export async function POST(req: Request) {
  try {

    const user: any = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    let { doctorId, patientId, date, time } = body

    if (!doctorId || !date || !time) {
      return NextResponse.json(
        { error: "Fill all fields" },
        { status: 400 }
      )
    }

    /* 🔥 PATIENT AUTO (if patient logged in) */
    if (user.role === "patient") {
      const patient = await prisma.patient.findFirst({
        where: { userId: user.id }
      })
      patientId = patient?.id
    }

    if (!patientId) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 400 }
      )
    }

    /* 🔥 VALIDATE PATIENT */
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    })

    if (!patient) {
      return NextResponse.json(
        { error: "Invalid patient" },
        { status: 400 }
      )
    }

    /* 🔥 VALIDATE DOCTOR */
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    })

    if (!doctor) {
      return NextResponse.json(
        { error: "Invalid doctor" },
        { status: 400 }
      )
    }

    const selectedDate = new Date(date)

    const start = new Date(new Date(date).setHours(0, 0, 0, 0))
    const end = new Date(new Date(date).setHours(23, 59, 59, 999))

    /* 🔥 PRE CHECK */
    const slotTaken = await prisma.appointment.findFirst({
      where: {
        doctorId,
        time,
        date: {
          gte: start,
          lt: end
        }
      }
    })

    if (slotTaken) {
      return NextResponse.json(
        { error: "Slot already booked" },
        { status: 400 }
      )
    }

    /* 🔥 TOKEN */
    const lastAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: {
          gte: start,
          lt: end
        }
      },
      orderBy: { token: "desc" }
    })

    const nextToken = lastAppointment ? lastAppointment.token + 1 : 1

    /* 🔥 CREATE (FINAL SAFE) */
    let appointment

    try {

      appointment = await prisma.appointment.create({
        data: {
          doctorId,
          patientId,
          date: selectedDate,
          time,
          status: "pending",
          token: nextToken
        },
        include: {
          patient: true,
          doctor: true
        }
      })

    } catch (err: any) {

      /* 🔥 DOUBLE BOOKING FINAL BLOCK */
      if (err.code === "P2002") {
        return NextResponse.json(
          { error: "Slot already booked" },
          { status: 400 }
        )
      }

      throw err
    }

    /* 🔥 FINAL RETURN */
    return NextResponse.json({
      success: true,
      data: appointment
    })

  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    )
  }
}