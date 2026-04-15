import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/* ============================= */
/* GET AVAILABILITY */
/* ============================= */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const doctorId = searchParams.get("doctorId")

    if (!doctorId) {
      return NextResponse.json(
        { error: "doctorId is required" },
        { status: 400 }
      )
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { availability: true }
    })

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(doctor.availability ?? {})
  } catch (error) {
    console.log("GET AVAILABILITY ERROR:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

/* ============================= */
/* SAVE AVAILABILITY */
/* ============================= */

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const doctorId = body?.doctorId
    const availability = body?.availability

    if (!doctorId || !availability) {
      return NextResponse.json(
        { error: "doctorId & availability required" },
        { status: 400 }
      )
    }

    const { start, end, days } = availability

    /* 🔥 VALIDATION */
    if (!start || !end) {
      return NextResponse.json(
        { error: "Start and end time required" },
        { status: 400 }
      )
    }

    if (start >= end) {
      return NextResponse.json(
        { error: "End time must be greater than start time" },
        { status: 400 }
      )
    }

    if (!Array.isArray(days) || days.length === 0) {
      return NextResponse.json(
        { error: "At least one working day required" },
        { status: 400 }
      )
    }

    /* 🔥 CHECK DOCTOR EXISTS */
    const exists = await prisma.doctor.findUnique({
      where: { id: doctorId }
    })

    if (!exists) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      )
    }

    /* 🔥 SAVE */
    const updated = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        availability: {
          start,
          end,
          days
        } as any
      },
      select: { availability: true }
    })

    return NextResponse.json(updated.availability ?? {})
  } catch (error) {
    console.log("POST AVAILABILITY ERROR:", error)
    return NextResponse.json(
      { error: "Failed to update availability" },
      { status: 500 }
    )
  }
}