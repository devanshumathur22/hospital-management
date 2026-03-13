import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params
  const body = await req.json()

  const appointment = await prisma.appointment.update({
    where: { id },
    data: {
      date: new Date(body.date),
      time: body.time
    }
  })

  return NextResponse.json(appointment)

}