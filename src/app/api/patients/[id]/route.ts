import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

type Context = {
  params: Promise<{ id: string }>
}

const SECRET = process.env.JWT_SECRET!

/* ================= AUTH ================= */

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

/* ================= GET (WITH HISTORY) ================= */

export async function GET(req: NextRequest, context: Context){

  try{

    const user:any = await getUser()
    if(!user) return NextResponse.json({error:"Unauthorized"},{status:401})

    const { id } = await context.params

    const patient = await prisma.patient.findUnique({
      where:{ id },
      include:{
        user:{ select:{ email:true } },

        /* 🔥 NEW: APPOINTMENTS */
        appointments:{
          orderBy:{ date:"desc" }
        },

        /* 🔥 NEW: PRESCRIPTIONS */
        prescriptions:{
          orderBy:{ createdAt:"desc" }
        }
      }
    })

    if(!patient){
      return NextResponse.json({error:"Not found"},{status:404})
    }

    return NextResponse.json(patient)

  }catch(err){
    console.log("GET ERROR:",err)
    return NextResponse.json({error:"Failed"},{status:500})
  }
}

/* ================= UPDATE ================= */

export async function PUT(req: NextRequest, context: Context){

  try{

    const user:any = await getUser()
    if(!user) return NextResponse.json({error:"Unauthorized"},{status:401})

    const { id } = await context.params
    const body = await req.json()

    const patient = await prisma.patient.findUnique({ where:{ id } })

    if(!patient){
      return NextResponse.json({error:"Not found"},{status:404})
    }

    /* 🔥 PERMISSIONS */

    if(user.role === "patient" && patient.userId !== user.id){
      return NextResponse.json({error:"Forbidden"},{status:403})
    }

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

  }catch(err){
    console.log("UPDATE ERROR:",err)
    return NextResponse.json({error:"Failed"},{status:500})
  }
}

/* ================= DELETE ================= */

export async function DELETE(req: NextRequest, context: Context){

  try{

    const user:any = await getUser()

    if(!user || user.role !== "admin"){
      return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    const { id } = await context.params

    const patient = await prisma.patient.findUnique({ where:{ id } })

    if(!patient){
      return NextResponse.json({error:"Not found"},{status:404})
    }

    /* 🔥 DELETE USER + PATIENT */
    await prisma.user.delete({
      where:{ id: patient.userId! }
    })

    await prisma.patient.delete({
      where:{ id }
    })

    return NextResponse.json({ message:"Deleted" })

  }catch(err){
    console.log("DELETE ERROR:",err)
    return NextResponse.json({error:"Failed"},{status:500})
  }
}