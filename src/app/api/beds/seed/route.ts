import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 🔥 RESET (important)
    await prisma.bed.deleteMany()

    // 🔥 ADD BEDS
    await prisma.bed.createMany({
      data: [
        { ward: "A", number: "101", isOccupied: false },
        { ward: "A", number: "102", isOccupied: false },
        { ward: "B", number: "201", isOccupied: false },
        { ward: "B", number: "202", isOccupied: false }
      ]
    })

    return NextResponse.json({ message: "Beds seeded successfully" })

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed" })
  }
}