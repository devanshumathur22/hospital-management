import { prisma } from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function POST(req: NextRequest){

  try{

    // 🔐 AUTH CHECK
    const token = req.cookies.get("token")?.value

    if(!token){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    const user:any = verifyToken(token)

    if(!user){
      return NextResponse.json({ error:"Invalid token" },{ status:401 })
    }

    // 🔥 ROLE CHECK (only admin)
    if(user.role !== "admin"){
      return NextResponse.json({ error:"Forbidden" },{ status:403 })
    }

    const body = await req.json()
    const { doctorId , nurseId } = body

    if(!doctorId || !nurseId){
      return NextResponse.json(
        { error:"doctorId and nurseId required" },
        { status:400 }
      )
    }

    // ✅ check doctor
    const doctor = await prisma.doctor.findUnique({
      where:{ id: doctorId }
    })

    if(!doctor){
      return NextResponse.json({ error:"Doctor not found" },{ status:404 })
    }

    // ✅ check nurse
    const nurse = await prisma.nurse.findUnique({
      where:{ id: nurseId }
    })

    if(!nurse){
      return NextResponse.json({ error:"Nurse not found" },{ status:404 })
    }

    // 🔥 assign
    const updated = await prisma.nurse.update({
      where:{ id: nurseId },
      data:{ doctorId }
    })

    return NextResponse.json(updated)

  }catch(err){

    console.log("ASSIGN NURSE ERROR:",err)

    return NextResponse.json(
      { error:"Failed to assign nurse" },
      { status:500 }
    )
  }
}