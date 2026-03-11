import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
){

  try{

    const { id } = await context.params

    if(!id){
      return NextResponse.json(
        { error:"Invalid ID" },
        { status:400 }
      )
    }

    await prisma.patient.delete({
      where:{ id }
    })

    return NextResponse.json({
      message:"Patient deleted successfully"
    })

  }catch(error){

    console.log("DELETE PATIENT ERROR:",error)

    return NextResponse.json(
      { error:"Failed to delete patient" },
      { status:500 }
    )

  }

}