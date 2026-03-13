import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req:Request){

try{

const body = await req.json()

const { doctorId , nurseId } = body

if(!doctorId || !nurseId){

return NextResponse.json(
{ error:"doctorId and nurseId required" },
{ status:400 }
)

}

const nurse = await prisma.nurse.update({

where:{ id:nurseId },

data:{ doctorId }

})

return NextResponse.json(nurse)

}catch(err){

console.log("ASSIGN NURSE ERROR:",err)

return NextResponse.json(
{ error:"Failed to assign nurse" },
{ status:500 }
)

}

}