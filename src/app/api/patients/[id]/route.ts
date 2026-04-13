import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

type Context = {
  params: Promise<{ id: string }>
}

const SECRET = process.env.JWT_SECRET!

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

/* ================= GET ================= */

export async function GET(req: NextRequest, context: Context){

  const user:any = await getUser()
  if(!user) return NextResponse.json({error:"Unauthorized"},{status:401})

  const { id } = await context.params

  const patient = await prisma.patient.findUnique({
    where:{ id },
    include:{
      user:{ select:{ email:true } }
    }
  })

  return NextResponse.json(patient)
}

/* ================= UPDATE ================= */

export async function PUT(req: NextRequest, context: Context){

  const user:any = await getUser()
  if(!user) return NextResponse.json({error:"Unauthorized"},{status:401})

  const { id } = await context.params
  const body = await req.json()

  const patient = await prisma.patient.findUnique({ where:{ id } })

  if(!patient){
    return NextResponse.json({error:"Not found"},{status:404})
  }

  // 🔥 patient can update only own
  if(user.role === "patient" && patient.userId !== user.id){
    return NextResponse.json({error:"Forbidden"},{status:403})
  }

  // 🔥 only admin can update others
  if(user.role !== "admin" && user.role !== "patient"){
    return NextResponse.json({error:"Forbidden"},{status:403})
  }

  const updated = await prisma.patient.update({
    where:{ id },
    data:{
      name: body.name,
      phone: body.phone,
      gender: body.gender,
      dob: body.dob ? new Date(body.dob) : null,
      bloodGroup: body.bloodGroup,
      address: body.address,
      emergencyContact: body.emergencyContact
    }
  })

  return NextResponse.json(updated)
}

/* ================= DELETE ================= */

export async function DELETE(req: NextRequest, context: Context){

  const user:any = await getUser()
  if(!user || user.role !== "admin"){
    return NextResponse.json({error:"Unauthorized"},{status:401})
  }

  const { id } = await context.params

  const patient = await prisma.patient.findUnique({ where:{ id } })

  if(!patient){
    return NextResponse.json({error:"Not found"},{status:404})
  }

  // 🔥 delete user also
  await prisma.user.delete({
    where:{ id: patient.userId! }
  })

  await prisma.patient.delete({
    where:{ id }
  })

  return NextResponse.json({ message:"Deleted" })
}