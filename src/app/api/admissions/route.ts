import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// 🔥 GET ALL ADMISSIONS (ADMIN)
export async function GET() {
  try {
    const admissions = await prisma.admission.findMany({
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true
          }
        },
        bed: {
          select: {
            id: true,
            number: true,
            ward: true
          }
        }
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


// 🔥 CREATE ADMISSION
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { patientId, doctorId, bedId, ward, reason } = body

    // ✅ VALIDATION
    if (!patientId || !doctorId || !bedId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // 🔥 CHECK BED AVAILABLE
    const bed = await prisma.bed.findUnique({
      where: { id: bedId }
    })

    if (!bed || bed.isOccupied) {
      return NextResponse.json(
        { error: "Bed not available" },
        { status: 400 }
      )
    }

    // 🔥 CREATE ADMISSION
    const admission = await prisma.admission.create({
      data: {
        patientId,
        doctorId,
        bedId,
        ward,
        reason,
        status: "admitted"
      }
    })

    // 🔥 MARK BED OCCUPIED
    await prisma.bed.update({
      where: { id: bedId },
      data: { isOccupied: true }
    })

    return NextResponse.json(admission)

  } catch (error) {
    console.log("CREATE ADMISSION ERROR:", error)

    return NextResponse.json(
      { error: "Failed to create admission" },
      { status: 500 }
    )
  }
}