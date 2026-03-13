import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"


/* ============================= */
/* GET SINGLE APPOINTMENT */
/* ============================= */

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
){

try{

const { id } = await context.params

const appointment = await prisma.appointment.findUnique({

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



/* ============================= */
/* UPDATE APPOINTMENT STATUS */
/* ============================= */

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
){

try{

const { id } = await context.params

const body = await req.json()

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