import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 🔥 IMPORTANT FIX
    const { id } = await context.params

    const admission = await prisma.admission.findUnique({
      where: { id }
    })

    if (!admission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // 🔥 UPDATE STATUS
    await prisma.admission.update({
      where: { id },
      data: {
        status: "discharged",
        dischargeDate: new Date()
      }
    })

    // 🔥 FREE BED
    await prisma.bed.update({
      where: { id: admission.bedId },
      data: { isOccupied: false }
    })

    return NextResponse.json({ message: "Discharged" })

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}