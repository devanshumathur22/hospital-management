import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/getUser"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { doctorId, date } = await req.json()

    const patient = await prisma.patient.findFirst({
      where: { userId: user.id }
    })

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    // 🔥 CHECK SAME DAY APPOINTMENT
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)

    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    const alreadyBooked = await prisma.appointment.findFirst({
      where: {
        doctorId,
        patientId: patient.id,
        date: {
          gte: start,
          lte: end
        }
      }
    })

    if (alreadyBooked) {
      return NextResponse.json(
        { error: "You already have appointment today" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}