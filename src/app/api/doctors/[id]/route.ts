import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

const SECRET = process.env.JWT_SECRET!

/* ============================= */
/* AUTH HELPER */
/* ============================= */

async function getUser(){
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if(!token) return null

  try{
    return jwt.verify(token, SECRET)
  }catch{
    return null
  }
}

/* ============================= */
/* GET SINGLE DOCTOR */
/* ============================= */

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
){
  try{

    const { id } = await context.params

    const doctor = await prisma.doctor.findUnique({
      where:{ id },
      include:{
        user:{ select:{ email:true } }
      }
    })

    return NextResponse.json(doctor)

  }catch{
    return NextResponse.json({ error:"Failed" },{ status:500 })
  }
}

/* ============================= */
/* UPDATE DOCTOR */
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

    /* ============================= */
    /* 🔐 ROLE CHECK */
    /* ============================= */

    if(user.role !== "admin" && user.role !== "doctor"){
      return NextResponse.json({ error:"Forbidden" },{ status:403 })
    }

    /* ============================= */
    /* 🔒 DOCTOR SELF CHECK */
    /* ============================= */

    if(user.role === "doctor"){

      const doctor = await prisma.doctor.findFirst({
        where:{ userId: user.id }
      })

      if(doctor?.id !== id){
        return NextResponse.json({ error:"Forbidden" },{ status:403 })
      }
    }

    /* ============================= */
    /* UPDATE */
    /* ============================= */

    const updated = await prisma.doctor.update({
      where:{ id },
      data:{
        name: body.name,
        specialization: body.specialization,
        experience: Number(body.experience) || 0
      },
      include:{
        user:{ select:{ email:true } }
      }
    })

    return NextResponse.json(updated)

  }catch(err){

    console.log("UPDATE DOCTOR ERROR:",err)

    return NextResponse.json(
      { error:"Failed to update doctor" },
      { status:500 }
    )
  }
}

/* ============================= */
/* DELETE DOCTOR */
/* ============================= */

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
){
  try{

    const user:any = await getUser()

    if(!user || user.role !== "admin"){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    const { id } = await context.params

    const doctor = await prisma.doctor.findUnique({
      where:{ id }
    })

    if(!doctor){
      return NextResponse.json({ error:"Not found" },{ status:404 })
    }

    // 🔥 delete linked user
    await prisma.user.delete({
      where:{ id: doctor.userId! }
    })

    await prisma.doctor.delete({
      where:{ id }
    })

    return NextResponse.json({ message:"Deleted" })

  }catch(err){

    console.log("DELETE DOCTOR ERROR:",err)

    return NextResponse.json(
      { error:"Failed to delete doctor" },
      { status:500 }
    )
  }
}