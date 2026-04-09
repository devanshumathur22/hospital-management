import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

/* ============================= */
/* AUTH HELPER */
/* ============================= */

async function getUser(){

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if(!token) return null

  try{
    return jwt.verify(token, process.env.JWT_SECRET!)
  }catch{
    return null
  }
}

/* ============================= */
/* GET SINGLE */
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
/* UPDATE (RESCHEDULE / STATUS) */
/* ============================= */

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
){

  try{

    const user:any = await getUser()

    if(!user){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    const { id } = await context.params
    const body = await req.json()

    const appointment = await prisma.appointment.findUnique({
      where:{ id }
    })

    if(!appointment){
      return NextResponse.json({ error:"Not found" },{ status:404 })
    }

    // 🔒 SECURITY
    if(
      user.role === "patient" &&
      appointment.patientId !== user.id
    ){
      return NextResponse.json({ error:"Forbidden" },{ status:403 })
    }

    /* ============================= */
    /* UPDATE LOGIC */
    /* ============================= */

    const updated = await prisma.appointment.update({
      where:{ id },
      data:{
        // ✅ reschedule
        date: body.date ? new Date(body.date) : undefined,
        time: body.time || undefined,

        // ✅ cancel
        status: body.status || undefined
      }
    })

    return NextResponse.json(updated)

  }catch(err){

    console.log("UPDATE ERROR:",err)

    return NextResponse.json(
      { error:"Update failed" },
      { status:500 }
    )
  }
}