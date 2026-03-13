import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"


/* ============================= */
/* GET VITALS */
/* ============================= */

export async function GET(req:Request){

try{

const { searchParams } = new URL(req.url)

const patientId = searchParams.get("patient")

const vitals = await prisma.vital.findMany({

where:{
patientId: patientId || undefined
},

orderBy:{
createdAt:"desc"
}

})

return NextResponse.json(vitals)

}catch(err){

return NextResponse.json(
{error:"Failed to fetch vitals"},
{status:500}
)

}

}



/* ============================= */
/* CREATE VITAL */
/* ============================= */

export async function POST(req:Request){

try{

const body = await req.json()

const vital = await prisma.vital.create({

data:{

patientId: body.patientId,
nurseId: body.nurseId,

bp: body.bp,
temperature: Number(body.temperature),
pulse: Number(body.pulse),

notes: body.notes

}

})

return NextResponse.json(vital)

}catch(err){

return NextResponse.json(
{error:"Failed"},
{status:500}
)

}

}