import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/getUser"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json([], { status: 200 })
    }

    // 🔥 find patient
    const patient = await prisma.patient.findFirst({
      where: { userId: user.id }
    })

    if (!patient) {
      return NextResponse.json([], { status: 200 })
    }

    // 🔥 get bills with relations
    const bills = await prisma.bill.findMany({
  where: {
    patientId: patient.id
  },
  include: {
    appointment: {
      include: {
        doctor: true
      }
    },
    admission: true
  },
  orderBy: {
    createdAt: "desc"
  }
})

    // 🔥 FORMAT RESPONSE (IMPORTANT)
    const formatted = bills.map((b) => {
  const doctorName =
    b.appointment?.doctor?.name ||
    null

  return {
    id: b.id,
    type: b.type,
    title:
      b.title ||
      (doctorName ? `Dr. ${doctorName}` : "Hospital Bill"),

    doctorName,
    totalAmount: b.totalAmount,
    paidAmount: b.paidAmount,
    status: b.status,
    paymentMode: b.paymentMode,
    createdAt: b.createdAt
  }
})

    return NextResponse.json(formatted)

  } catch (error) {
    console.log("PATIENT BILLS ERROR:", error)
    return NextResponse.json([], { status: 200 })
  }
}