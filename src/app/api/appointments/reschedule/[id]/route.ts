import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
){

  const body = await req.json()
  const { date, time } = body

  const appointment = await prisma.appointment.update({
    where:{
      id: params.id
    },
    data:{
      date: new Date(date),
      time
    }
  })

  return NextResponse.json(appointment)

}