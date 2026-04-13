import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

/* ============================= */
/* AUTH HELPER */
/* ============================= */

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
/* GET APPOINTMENTS */
/* ============================= */

export async function GET(req: Request) {
  try {

    const user: any = await getUser()
    if (!user) return NextResponse.json([], { status: 401 })

    const url = new URL(req.url)
    const type = url.searchParams.get("type")
    const status = type === "history" ? "completed" : "pending"

    let appointments: any[] = []

    /* ===================== */
    /* PATIENT */
    /* ===================== */

    if (user.role === "patient") {

      const patient = await prisma.patient.findFirst({
        where: { userId: user.id }
      })

      if (!patient) return NextResponse.json([])

      appointments = await prisma.appointment.findMany({
        where: {
          patientId: patient.id,
          status
        },
        include: {
          doctor: true
        },
        orderBy: [{ date: "desc" }]
      })
    }

    /* ===================== */
    /* DOCTOR */
    /* ===================== */

    else if (user.role === "doctor") {

      const doctor = await prisma.doctor.findFirst({
        where: { userId: user.id }
      })

      if (!doctor) return NextResponse.json([])

      appointments = await prisma.appointment.findMany({
        where: {
          doctorId: doctor.id,
          status
        },
        include: {
          patient: {
            include: {
              user: { select: { email: true } }
            }
          }
        }
      })
    }

    /* ===================== */
    /* NURSE */
    /* ===================== */

    else if (user.role === "nurse") {

      const nurse = await prisma.nurse.findFirst({
        where: { userId: user.id },
        include: { doctor: true }
      })

      if (!nurse?.doctor?.id) return NextResponse.json([])

      appointments = await prisma.appointment.findMany({
        where: {
          doctorId: nurse.doctor.id,
          status
        },
        include: {
          patient: {
            include: {
              user: { select: { email: true } }
            }
          },
          doctor: true
        }
      })
    }

    /* ===================== */
    /* ADMIN / RECEPTIONIST */
    /* ===================== */

    else if (user.role === "admin" || user.role === "receptionist") {

      appointments = await prisma.appointment.findMany({
        where: { status },
        include: {
          doctor: true,
          patient: {
            include: {
              user: { select: { email: true } }
            }
          }
        }
      })
    }

    return NextResponse.json(appointments)

  } catch (err) {
    console.log("GET ERROR:", err)
    return NextResponse.json([], { status: 500 })
  }
}

/* ============================= */
/* CREATE APPOINTMENT */
/* ============================= */

export async function POST(req: Request) {
  try {

    const user: any = await getUser()

    if (!user || !["patient","admin","receptionist"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    let patientId = null

    /* ===================== */
    /* GET PATIENT ID */
    /* ===================== */

    if (user.role === "patient") {

      const patient = await prisma.patient.findFirst({
        where: { userId: user.id }
      })

      patientId = patient?.id

    } else {

      // 🔥 admin / receptionist
      patientId = body.patientId
    }

    if (!patientId) {
      return NextResponse.json(
        { error: "Patient required" },
        { status: 400 }
      )
    }

    const selectedDate = new Date(body.date)

    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date" },
        { status: 400 }
      )
    }

    /* ===================== */
    /* SAME DAY CHECK */
    /* ===================== */

    const existing = await prisma.appointment.findFirst({
      where: {
        patientId,
        doctorId: body.doctorId,
        date: selectedDate
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: "Already booked this doctor today" },
        { status: 400 }
      )
    }

    /* ===================== */
    /* SLOT CHECK */
    /* ===================== */

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

    /* ===================== */
    /* CREATE */
    /* ===================== */

    const appointment = await prisma.appointment.create({
      data: {
        doctorId: body.doctorId,
        patientId,
        date: selectedDate,
        time: body.time,
        status: "pending"
      }
    })

    return NextResponse.json(appointment)

  } catch (err) {
    console.log("CREATE ERROR:", err)
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    )
  }
}

/* ============================= */
/* DELETE */
/* ============================= */

export async function DELETE(req: Request) {
  try {

    const user: any = await getUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await req.json()

    await prisma.appointment.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.log("DELETE ERROR:", err)
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    )
  }
}