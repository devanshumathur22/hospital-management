import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // 🔥 change
){

  try{

    const { id } = await context.params  // 🔥 await करना पड़ेगा

    if(!id){
      return NextResponse.json(
        { error:"Id required" },
        { status:400 }
      )
    }

    const data = await prisma.prescription.findFirst({
      where:{
        appointmentId: id
      },
      include:{
        doctor:true,
        patient:true,
        appointment:true
      }
    })

    if(!data){
      return NextResponse.json(
        { error:"Prescription not found" },
        { status:404 }
      )
    }

    return NextResponse.json(data)

  }catch(err){
    console.log("GET BY ID ERROR:",err)
    return NextResponse.json(
      { error:"Failed to fetch prescription" },
      { status:500 }
    )
  }
}