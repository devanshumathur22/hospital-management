import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

/* ============================= */
/* AUTH */
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
/* GET SINGLE */
/* ============================= */

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: true,
        patient: true
      }
    })

    return NextResponse.json(appointment)

  } catch (err) {
    console.log("GET ERROR:", err)

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    )
  }
}

/* ============================= */
/* UPDATE */
/* ============================= */

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const user: any = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await req.json()

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!appointment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    /* 🔥 GET REAL IDS */
    let patientId = null
    let doctorId = null

    if (user.role === "patient") {
      const patient = await prisma.patient.findFirst({
        where: { userId: user.id }
      })
      patientId = patient?.id
    }

    if (user.role === "doctor") {
      const doctor = await prisma.doctor.findFirst({
        where: { userId: user.id }
      })
      doctorId = doctor?.id
    }

    /* 🔒 SECURITY */
    if (user.role === "patient" && appointment.patientId !== patientId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (user.role === "doctor" && appointment.doctorId !== doctorId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const newDate = body.date ? new Date(body.date) : appointment.date
    const newTime = body.time || appointment.time

    /* 🔥 SLOT CHECK */
    if (body.date || body.time) {

      const slotTaken = await prisma.appointment.findFirst({
        where: {
          doctorId: appointment.doctorId,
          date: newDate,
          time: newTime,
          NOT: { id }
        }
      })

      if (slotTaken) {
        return NextResponse.json(
          { error: "Slot already booked" },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        date: newDate,
        time: newTime,
        status: body.status || appointment.status
      },
      include: {
        doctor: true,
        patient: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updated
    })

  } catch (err) {

    console.log("UPDATE ERROR:", err)

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    )
  }
}

/* ============================= */
/* DELETE (FINAL PRO VERSION) */
/* ============================= */

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const user: any = await getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await context.params

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true
      }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    /* 🔥 GET REAL IDS */
    let patientId = null
    let doctorId = null

    if (user.role === "patient") {
      const patient = await prisma.patient.findFirst({
        where: { userId: user.id }
      })
      patientId = patient?.id
    }

    if (user.role === "doctor") {
      const doctor = await prisma.doctor.findFirst({
        where: { userId: user.id }
      })
      doctorId = doctor?.id
    }

    /* 🔒 SECURITY */
    if (user.role === "patient" && appointment.patientId !== patientId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (user.role === "doctor" && appointment.doctorId !== doctorId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    /* 🔥 DELETE PRESCRIPTIONS */
    await prisma.prescription.deleteMany({
      where: { appointmentId: id }
    })

    /* 🔥 DELETE APPOINTMENT */
    await prisma.appointment.delete({
      where: { id }
    })

    /* 🔥 FINAL RESPONSE */
    return NextResponse.json({
      success: true,
      message: "Appointment cancelled successfully",
      freedSlot: {
        doctorId: appointment.doctorId,
        date: appointment.date,
        time: appointment.time
      }
    })

  } catch (err) {

    console.log("DELETE ERROR:", err)

    return NextResponse.json(
      { error: "Failed to cancel appointment" },
      { status: 500 }
    )
  }
}