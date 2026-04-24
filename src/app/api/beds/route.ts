import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const beds = await prisma.bed.findMany({
    where: { isOccupied: false }
  })

  return NextResponse.json(beds)
}