import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/* ============================= */
/* GET SLOTS (BOOKING ONLY) */
/* ============================= */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const doctorId = searchParams.get("doctorId")
    const date = searchParams.get("date")

    if (!doctorId || !date) {
      return NextResponse.json(
        { error: "doctorId and date required" },
        { status: 400 }
      )
    }

    const selectedDate = new Date(date)

    const start = new Date(selectedDate)
    start.setHours(0, 0, 0, 0)

    const end = new Date(selectedDate)
    end.setHours(23, 59, 59, 999)

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: start,
          lt: end
        },
        status: {
          not: "cancelled"
        }
      },
      select: {
        time: true
      }
    })

    return NextResponse.json(appointments || [])

  } catch (err) {
    console.log("SLOTS ERROR:", err)

    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 }
    )
  }
}