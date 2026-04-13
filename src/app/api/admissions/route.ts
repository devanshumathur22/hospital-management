import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/getUser"

export async function GET() {
  try {

    const user = await getCurrentUser()

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // 🔥 find doctor from user
    const doctor = await prisma.doctor.findFirst({
      where: { userId: user.id }
    })

    if(!doctor){
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      )
    }

    // ✅ now correct query
    const admissions = await prisma.admission.findMany({
      where: {
        doctorId: doctor.id
      },
      include: {
        patient: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(admissions)

  } catch (error) {

    console.log("GET ADMISSIONS ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch admissions" },
      { status: 500 }
    )
  }
}