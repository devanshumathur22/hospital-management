import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

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

export async function GET() {

  try {

    const user:any = await getUser()

    if(!user){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    let prescriptions:any = []

    /* ================= PATIENT ================= */

    if(user.role === "patient"){

      const patient = await prisma.patient.findFirst({
        where:{ userId:user.id }
      })

      prescriptions = await prisma.prescription.findMany({
        where:{ patientId: patient?.id },
        orderBy:{ createdAt:"desc" }
      })
    }

    /* ================= DOCTOR ================= */

    else if(user.role === "doctor"){

      const doctor = await prisma.doctor.findFirst({
        where:{ userId:user.id }
      })

      prescriptions = await prisma.prescription.findMany({
        where:{ doctorId: doctor?.id },
        orderBy:{ createdAt:"desc" }
      })
    }

    /* ================= NURSE ================= */

    else if(user.role === "nurse"){

      const nurse = await prisma.nurse.findFirst({
        where:{ userId:user.id },
        include:{ doctor:true }
      })

      prescriptions = await prisma.prescription.findMany({
        where:{ doctorId: nurse?.doctor?.id },
        orderBy:{ createdAt:"desc" }
      })
    }

    /* ================= ADMIN ================= */

    else if(user.role === "admin"){

      prescriptions = await prisma.prescription.findMany({
        orderBy:{ createdAt:"desc" }
      })
    }

    else{
      return NextResponse.json({ error:"Forbidden" },{ status:403 })
    }

    return NextResponse.json(prescriptions)

  } catch (error) {

    console.log("PRESCRIPTION ERROR:", error)

    return NextResponse.json(
      { error:"Failed to fetch prescriptions" },
      { status:500 }
    )

  }

}