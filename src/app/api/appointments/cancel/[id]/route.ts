import { prisma } from "../../../../../lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
){

  try{

    const { id } = await params

    // Check if appointment exists
    const appointment = await prisma.appointment.findUnique({
      where:{ id }
    })

    if(!appointment){

      return NextResponse.json(
        { error:"Appointment not found" },
        { status:404 }
      )

    }

    await prisma.appointment.delete({
      where:{ id }
    })

    return NextResponse.json({
      message:"Appointment cancelled successfully"
    })

  }catch(err){

    console.log("CANCEL ERROR:",err)

    return NextResponse.json(
      { error:"Failed to cancel appointment" },
      { status:500 }
    )

  }

}