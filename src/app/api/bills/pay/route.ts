import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { billId, amount } = await req.json()
    const numericAmount = Number(amount)

    if (!billId || !numericAmount || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      )
    }

    const updatedBill = await prisma.$transaction(async (tx) => {
      const bill = await tx.bill.findUnique({
        where: { id: billId }
      })

      if (!bill) throw new Error("NOT_FOUND")

      const newPaid = bill.paidAmount + numericAmount
      const cappedPaid = Math.min(newPaid, bill.totalAmount)

      let newStatus = "pending"
      if (cappedPaid >= bill.totalAmount) newStatus = "paid"
      else if (cappedPaid > 0) newStatus = "partial"

      return await tx.bill.update({
        where: { id: billId },
        data: {
          paidAmount: cappedPaid,
          status: newStatus,
          paymentMode: "UPI"
        }
      })
    })

    return NextResponse.json({
      success: true,
      bill: updatedBill
    })

  } catch (err: any) {
    if (err.message === "NOT_FOUND") {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      )
    }

    console.log("PAYMENT ERROR:", err)

    return NextResponse.json(
      { error: "Payment failed" },
      { status: 500 }
    )
  }
}