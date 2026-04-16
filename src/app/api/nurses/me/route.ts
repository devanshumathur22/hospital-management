import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

const SECRET = process.env.JWT_SECRET!

export async function GET(){

  try {

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    /* 🔒 NO TOKEN */
    if(!token){
      return NextResponse.json(
        { success:false, error:"Unauthorized" },
        { status:401 }
      )
    }

    /* 🔒 VERIFY TOKEN */
    let decoded:any
    try{
      decoded = jwt.verify(token, SECRET)
    }catch{
      return NextResponse.json(
        { success:false, error:"Invalid token" },
        { status:401 }
      )
    }

    /* 🔒 ROLE CHECK */
    if(decoded.role !== "nurse"){
      return NextResponse.json(
        { success:false, error:"Access denied" },
        { status:403 }
      )
    }

    /* 🔥 FETCH NURSE */
    const nurse = await prisma.nurse.findFirst({
      where:{ userId: decoded.id },
      include:{
        user:{ select:{ email:true } },
        doctor:{ select:{ id:true, name:true, specialization:true } }
      }
    })

    if(!nurse){
      return NextResponse.json(
        { success:false, error:"Nurse not found" },
        { status:404 }
      )
    }

    /* 🔥 CLEAN RESPONSE */
    const response = {
      id: nurse.id,
      name: nurse.name,
      phone: nurse.phone,
      image: nurse.image,
      email: nurse.user?.email,
      doctor: nurse.doctor
    }

    return NextResponse.json({
      success:true,
      data:response
    })

  } catch (err) {

    console.log("NURSE ME ERROR:", err)

    return NextResponse.json(
      { success:false, error:"Internal server error" },
      { status:500 }
    )

  }
}