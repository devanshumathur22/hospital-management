import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"



export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
){

  try{

    const { id } = await params

    const appointment = await prisma.appointment.findFirst({
      where:{ id },
      include:{
        doctor:true,
        patient:true
      }
    })

    return NextResponse.json(appointment)

  }catch(err){

    console.log("GET ERROR:",err)

    return NextResponse.json(
      { error:"Failed" },
      { status:500 }
    )

  }

}



export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
){

  try{

    const body = await req.json()

    const { id } = await params

    const appointment = await prisma.appointment.update({

      where:{ id },

      data:{
        status: body.status
      }

    })

    return NextResponse.json(appointment)

  }catch(err){

    console.log("UPDATE ERROR:",err)

    return NextResponse.json(
      { error:"Update failed" },
      { status:500 }
    )

  }

}