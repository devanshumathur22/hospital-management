import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

const SECRET = process.env.JWT_SECRET!

/* 🔐 AUTH */
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
/* UPDATE NURSE PROFILE */
/* ============================= */

export async function PATCH(req:Request){

  try{

    const user:any = await getUser()

    /* 🔒 AUTH */
    if(!user){
      return NextResponse.json(
        { success:false, error:"Unauthorized" },
        { status:401 }
      )
    }

    if(user.role !== "nurse"){
      return NextResponse.json(
        { success:false, error:"Access denied" },
        { status:403 }
      )
    }

    const body = await req.json()

    const name = body.name?.trim()
    const phone = body.phone?.trim()
    const image = body.image?.trim()

    /* 🔥 VALIDATION */
    if(!name){
      return NextResponse.json(
        { success:false, error:"Name is required" },
        { status:400 }
      )
    }

    if(phone && phone.length < 10){
      return NextResponse.json(
        { success:false, error:"Invalid phone number" },
        { status:400 }
      )
    }

    /* 🔥 FIND NURSE (userId optional hai isliye findFirst) */
    const existing = await prisma.nurse.findFirst({
      where:{ userId:user.id }
    })

    if(!existing){
      return NextResponse.json(
        { success:false, error:"Nurse not found" },
        { status:404 }
      )
    }

    /* 🔥 UPDATE */
    const updated = await prisma.nurse.update({
      where:{ id: existing.id }, // 🔥 important fix
      data:{
        name,
        phone,
        image
      }
    })

    return NextResponse.json({
      success:true,
      message:"Profile updated successfully",
      data:updated
    })

  }catch(err){

    console.log("UPDATE NURSE PROFILE ERROR:",err)

    return NextResponse.json(
      { success:false, error:"Internal server error" },
      { status:500 }
    )

  }

}