import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/getUser"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const doctor = await prisma.doctor.findFirst({
      where: { userId: user.id }
    })

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }

    const admissions = await prisma.admission.findMany({
      where: {
        doctorId: doctor.id,
        status: "admitted"
      },
      include: {
        patient: true,
        bed: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(admissions)

  } catch (error) {
    console.log(error)
    return NextResponse.json([], { status: 200 })
  }
}