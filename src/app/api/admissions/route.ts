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

    const admissions = await prisma.admission.findMany({
      where: {
        doctorId: user.id
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