import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

const SECRET = process.env.JWT_SECRET!

export async function PUT(req: Request){

  try{

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if(!token){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    let decoded:any

    try{
      decoded = jwt.verify(token, SECRET)
    }catch{
      return NextResponse.json({ error:"Invalid token" },{ status:401 })
    }

    const body = await req.json()

    let updated = null

    /* PATIENT */

    if(decoded.role === "patient"){

      const patient = await prisma.patient.findFirst({
        where:{ userId: decoded.id }
      })

      updated = await prisma.patient.update({
        where:{ id: patient?.id },
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
    }

    return NextResponse.json({ user: updated })

  }catch(err){

    console.log("PROFILE ERROR:",err)

    return NextResponse.json(
      { error:"Update failed" },
      { status:500 }
    )
  }
}