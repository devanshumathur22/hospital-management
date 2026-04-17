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

    /* 🔥 SLOT FILTER (used in booking page) */
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

    /* ===== NURSE (🔥 FIXED FINAL) ===== */

    else if (user.role === "nurse") {

      const nurse = await prisma.nurse.findFirst({
        where: { userId: user.id }
      })

      if (!nurse || !nurse.doctorId) {
        return NextResponse.json([])
      }

      // ❌ NO DATE FILTER (IMPORTANT FIX)
      appointments = await prisma.appointment.findMany({
        where: {
          doctorId: nurse.doctorId
        },
        include: {
          patient: true
        },
        orderBy: {
          token: "asc"
        }
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

    const {doctorId, patientId, date, time} = body
    
    if(!doctorId || !patientId || !date || !time){
      return NextResponse.json({ error: "Fill all fields" }, { status: 400 })
    } 
    /* 🔥 CHECK PATIENT */
const patient = await prisma.patient.findUnique({
  where: { id: patientId }
})

if (!patient) {
  return NextResponse.json(
    { error: "Invalid patient" },
    { status: 400 }
  )
}

/* 🔥 CHECK DOCTOR */
const doctor = await prisma.doctor.findUnique({
  where: { id: doctorId }
})

if (!doctor) {
  return NextResponse.json(
    { error: "Invalid doctor" },
    { status: 400 }
  )
}

    const selectedDate = new Date(body.date)

    const start = new Date(new Date(body.date).setHours(0,0,0,0))
    const end = new Date(new Date(body.date).setHours(23,59,59,999))

    /* 🔥 SLOT CHECK */
    const slotTaken = await prisma.appointment.findFirst({
      where: {
        doctorId: body.doctorId,
        time: body.time.trim().toLowerCase(),
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

    /* 🔥 TOKEN GENERATION */
    const lastAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: body.doctorId,
        date: {
          gte: start,
          lt: end
        }
      },
      orderBy: {
        token: "desc"
      }
    })

    const nextToken = lastAppointment ? lastAppointment.token + 1 : 1

    /* 🔥 CREATE */
    const appointment = await prisma.appointment.create({
      data: {
        doctorId: body.doctorId,
        patientId: patient.id,
        date: selectedDate,
        time: body.time,
        status: "pending",
        token: nextToken
      },
      include:{
        patient:true,
        doctor:true
      }
    })

    return NextResponse.json({
      success:true,
      data:appointment
    })

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}