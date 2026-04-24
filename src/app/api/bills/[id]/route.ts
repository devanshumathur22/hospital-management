import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        patient: true,
        appointment: {
          include: {
            doctor: true   // ✅ yaha se doctor aayega
          }
        }
      }
    })

    if (!bill) {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...bill,
      remainingAmount: bill.totalAmount - bill.paidAmount
    })

  } catch (err) {
    console.log("BILL FETCH ERROR:", err)

    return NextResponse.json(
      { error: "Failed to fetch bill" },
      { status: 500 }
    )
  }
}