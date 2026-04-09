import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

/* ============================= */
/* GET APPOINTMENTS */
/* ============================= */

export async function GET() {

  try {
     const SECRET = process.env.JWT_SECRET!
    // ✅ FIX: await cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json([])
    }

    let payload: any

    try {
      payload = jwt.verify(token, SECRET)
    } catch {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }

    let appointments: any[] = []

    /* ============================= */
    /* PATIENT VIEW */
    /* ============================= */

    if (payload.role === "patient") {

      appointments = await prisma.appointment.findMany({
        where: {
          patientId: payload.id
        },
        include: {
          doctor: true
        },
        orderBy: [
          { date: "desc" },
          { createdAt: "desc" }
        ]
      })

    }

    /* ============================= */
    /* DOCTOR VIEW */
    /* ============================= */

    else if (payload.role === "doctor") {

      appointments = await prisma.appointment.findMany({
        where: {
          doctorId: payload.id
        },
        include: {
          doctor: true,
          patient: {
            include: {
              vitals: true
            }
          }
        },
        orderBy: [
          { date: "desc" },
          { createdAt: "desc" }
        ]
      })

    }

    /* ============================= */
    /* NURSE VIEW */
    /* ============================= */

    else if (payload.role === "nurse") {

      const nurse = await prisma.nurse.findUnique({
        where: {
          id: payload.id
        },
        include: {
          doctor: true
        }
      })

      if (!nurse?.doctor) {
        return NextResponse.json([])
      }

      appointments = await prisma.appointment.findMany({
        where: {
          doctorId: nurse.doctor.id
        },
        include: {
          doctor: true,
          patient: true
        },
        orderBy: [
          { date: "desc" },
          { createdAt: "desc" }
        ]
      })

    }

    /* ============================= */
    /* ADMIN + RECEPTION VIEW */
    /* ============================= */

    else if (payload.role === "admin" || payload.role === "receptionist") {

      appointments = await prisma.appointment.findMany({
        include: {
          doctor: true,
          patient: true
        },
        orderBy: [
          { date: "desc" },
          { createdAt: "desc" }
        ]
      })

    }

    return NextResponse.json(appointments)

  } catch (err) {

    console.log("GET APPOINTMENTS ERROR:", err)

    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    )

  }

}


/* ============================= */
/* CREATE APPOINTMENT */
/* ============================= */

export async function POST(req: Request) {

  try {

    const body = await req.json()

    // ✅ FIX: await cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    let payload: any

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!)
    } catch {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        doctorId: body.doctorId,
        patientId: payload.id, // ✅ FIXED
        date: new Date(body.date),
        time: body.time
      }
    })

    return NextResponse.json(appointment)

  } catch (err) {

    console.log("CREATE APPOINTMENT ERROR:", err)

    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    )

  }

}
// ============================= */
/* DELETE APPOINTMENT */
/* ============================= */
export async function DELETE(req:Request){

  try{

    const body = await req.json()
    const { id } = body

    const SECRET = process.env.JWT_SECRET!

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if(!token){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    let payload:any

    try{
      payload = jwt.verify(token, SECRET)
    }catch{
      return NextResponse.json({ error:"Invalid token" },{ status:401 })
    }

    // 🔥 SAFE DELETE (no crash)
    const appointment = await prisma.appointment.findUnique({
      where:{ id }
    })

    if(!appointment){
      return NextResponse.json({ success:true }) // ✅ already deleted
    }

    // 🔐 SECURITY
    if(
      payload.role === "patient" &&
      appointment.patientId !== payload.id
    ){
      return NextResponse.json({ error:"Forbidden" },{ status:403 })
    }

    await prisma.appointment.delete({
      where:{ id }
    })

    return NextResponse.json({ success:true })

  }catch(err){

    console.log("DELETE ERROR:",err)

    return NextResponse.json(
      { error:"Delete failed" },
      { status:500 }
    )
  }
}