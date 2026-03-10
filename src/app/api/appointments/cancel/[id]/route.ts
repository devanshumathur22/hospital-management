import { prisma } from "../../../../../lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
){

  try{

    const { id } = await params

    await prisma.appointment.delete({
      where:{ id }
    })

    return NextResponse.json({
      message:"Appointment cancelled"
    })

  }catch(err){

    console.log("CANCEL ERROR:",err)

    return NextResponse.json(
      { error:"Failed to cancel appointment" },
      { status:500 }
    )

  }

}