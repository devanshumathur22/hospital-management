import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
){

  const { id } = await context.params

  const body = await req.json()
  const { date, time } = body

  const appointment = await prisma.appointment.update({
    where:{
      id
    },
    data:{
      date: new Date(date),
      time
    }
  })

  return NextResponse.json(appointment)
}