import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

/* ============================= */
/* GET APPOINTMENTS */
/* ============================= */

export async function GET() {

  try {
    const SECRET = process.env.JWT_SECRET!

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return NextResponse.json([])

    let payload: any

    try {
      payload = jwt.verify(token, SECRET)
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    let appointments: any[] = []

    if (payload.role === "patient") {

      appointments = await prisma.appointment.findMany({
        where: { patientId: payload.id },
        include: { doctor: true },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }]
      })

    } else if (payload.role === "doctor") {

      appointments = await prisma.appointment.findMany({
        where: { doctorId: payload.id },
        include: {
          doctor: true,
          patient: { include: { vitals: true } }
        },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }]
      })

    } else if (payload.role === "nurse") {

      const nurse = await prisma.nurse.findUnique({
        where: { id: payload.id },
        include: { doctor: true }
      })

      if (!nurse?.doctor) return NextResponse.json([])

      appointments = await prisma.appointment.findMany({
        where: { doctorId: nurse.doctor.id },
        include: { doctor: true, patient: true },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }]
      })

    } else if (payload.role === "admin" || payload.role === "receptionist") {

      // 🔥 FIX: null patient avoid
      appointments = await prisma.appointment.findMany({
        where: {
          patientId: { not: null } // ✅ MAIN FIX
        },
        include: {
          doctor: true,
          patient: true
        },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }]
      })

    }

    return NextResponse.json(appointments)

  } catch (err) {

    console.log("GET ERROR:", err)

    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    )
  }
}


/* ============================= */
/* CREATE APPOINTMENT */
/* ============================= */

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let payload: any

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!)
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // 🔥 SAFE DATE
    const selectedDate = body.date ? new Date(body.date) : null

    if (!selectedDate) {
      return NextResponse.json(
        { error: "Invalid date" },
        { status: 400 }
      )
    }

    /* ============================= */
    /* SAME DAY (DOCTOR-WISE) */
    /* ============================= */

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        patientId: payload.id,
        doctorId: body.doctorId,
        date: selectedDate
      }
    })

    if (existingAppointment) {
      return NextResponse.json(
        { error: "You already have an appointment with this doctor today" },
        { status: 400 }
      )
    }

    /* ============================= */
    /* SLOT CHECK */
    /* ============================= */

    const slotTaken = await prisma.appointment.findFirst({
      where: {
        doctorId: body.doctorId,
        date: selectedDate,
        time: body.time
      }
    })

    if (slotTaken) {
      return NextResponse.json(
        { error: "Slot already booked" },
        { status: 400 }
      )
    }

    /* ============================= */
    /* CREATE */
    /* ============================= */

    const appointment = await prisma.appointment.create({
      data: {
        doctorId: body.doctorId,
        patientId: payload.id,
        date: selectedDate,
        time: body.time
      }
    })

    return NextResponse.json(appointment)

  } catch (err: any) {

    console.log("CREATE ERROR:", err)

    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Duplicate booking not allowed" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    )
  }
}


/* ============================= */
/* DELETE APPOINTMENT */
/* ============================= */

export async function DELETE(req: Request) {

  try {

    const body = await req.json()
    const { id } = body

    const SECRET = process.env.JWT_SECRET!

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let payload: any

    try {
      payload = jwt.verify(token, SECRET)
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!appointment) {
      return NextResponse.json({ success: true })
    }

    if (
      payload.role === "patient" &&
      appointment.patientId !== payload.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.appointment.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (err) {

    console.log("DELETE ERROR:", err)

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    )
  }
}