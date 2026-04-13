import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const SECRET = process.env.JWT_SECRET!

export async function GET(){

  try{

    // 🔐 AUTH
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if(!token){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    const user:any = jwt.verify(token, SECRET)

    // 🔥 ROLE CHECK
    if(user.role !== "admin"){
      return NextResponse.json({ error:"Forbidden" },{ status:403 })
    }

    /* ===================== */
    /* COUNTS */
    /* ===================== */

    const doctors = await prisma.doctor.count()
    const patients = await prisma.patient.count()
    const appointments = await prisma.appointment.count()

    /* ===================== */
    /* TODAY */
    /* ===================== */

    const today = new Date()

    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )

    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()+1
    )

    const todayAppointments = await prisma.appointment.count({
      where:{
        date:{
          gte:start,
          lt:end
        }
      }
    })

    return NextResponse.json({
      doctors,
      patients,
      appointments,
      today: todayAppointments
    })

  }catch(err){

    console.log("STATS ERROR:",err)

    return NextResponse.json(
      { error:"Failed to fetch stats" },
      { status:500 }
    )
  }
}