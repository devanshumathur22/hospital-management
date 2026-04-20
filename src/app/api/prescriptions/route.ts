import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const SECRET = process.env.JWT_SECRET!

/* ====================== */
/* GET USER */
/* ====================== */

async function getUser() {
  const cookieStore = await cookies()

  const token = cookieStore.get("token")?.value

  if (!token) return null

  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

/* ====================== */
/* CREATE / UPDATE */
/* ====================== */

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const user: any = await getUser()

    if (!user || user.role !== "doctor") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { appointmentId, medicine, notes } = body

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment required" },
        { status: 400 }
      )
    }

    /* 🔥 SAFE MEDICINE VALIDATION */
    const medicines = Array.isArray(medicine)
      ? medicine.filter((m) => m?.name?.trim())
      : []

    /* 🔥 GET DOCTOR */
    const doctor = await prisma.doctor.findFirst({
      where: { userId: user.id }
    })

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 400 }
      )
    }

    /* 🔥 GET APPOINTMENT */
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: "Invalid appointment" },
        { status: 400 }
      )
    }

    /* 🔥 UPSERT */
    const prescription = await prisma.prescription.upsert({
      where: {
        appointmentId
      },
      update: {
        medicine: medicines,
        notes: notes || ""
      },
      create: {
        doctorId: doctor.id,
        patientId: appointment.patientId,
        appointmentId,
        medicine: medicines,
        notes: notes || ""
      }
    })

    return NextResponse.json(prescription)

  } catch (err) {
    console.log("CREATE ERROR:", err)

    return NextResponse.json(
      { error: "Failed to save prescription" },
      { status: 500 }
    )
  }
}

/* ====================== */
/* GET */
/* ====================== */

export async function GET() {
  try {
    const user: any = await getUser()

    if (!user) {
      return NextResponse.json([], { status: 401 })
    }

    let prescriptions: any[] = []

    /* ================= PATIENT ================= */
    if (user.role === "patient") {

      const patient = await prisma.patient.findFirst({
        where: { userId: user.id }
      })

      if (!patient) return NextResponse.json([])

      prescriptions = await prisma.prescription.findMany({
        where: { patientId: patient.id },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
              experience: true
            }
          },
          appointment: true
        },
        orderBy: { createdAt: "desc" }
      })
    }

    /* ================= DOCTOR ================= */
    else if (user.role === "doctor") {

      const doctor = await prisma.doctor.findFirst({
        where: { userId: user.id }
      })

      if (!doctor) return NextResponse.json([])

      prescriptions = await prisma.prescription.findMany({
        where: { doctorId: doctor.id },
        include: {
          patient: true,
          appointment: true
        },
        orderBy: { createdAt: "desc" }
      })
    }

    /* ================= ADMIN ================= */
    else if (user.role === "admin") {

      prescriptions = await prisma.prescription.findMany({
        include: {
          doctor: true,
          patient: true,
          appointment: true
        },
        orderBy: { createdAt: "desc" }
      })
    }

    return NextResponse.json(prescriptions || [])

  } catch (err) {
    console.log("GET ERROR:", err)

    return NextResponse.json(
      { error: "Failed to fetch prescriptions" },
      { status: 500 }
    )
  }
}