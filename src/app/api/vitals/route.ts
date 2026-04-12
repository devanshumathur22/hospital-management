import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/getUser"

/* ============================= */
/* GET */
/* ============================= */

export async function GET(req: Request) {
  try {

    const user:any = await getCurrentUser()

    if(!user){
      return NextResponse.json([], { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get("patient")

    let vitals = []

    // 🔥 PATIENT → only own
    if(user.role === "patient"){
      vitals = await prisma.vital.findMany({
        where: {
          patientId: user.id
        },
        orderBy: { createdAt: "desc" }
      })
    }

    // 🔥 DOCTOR → only their patients
    else if(user.role === "doctor"){
      vitals = await prisma.vital.findMany({
        where: {
          doctorId: user.id
        },
        orderBy: { createdAt: "desc" }
      })
    }

    // 🔥 NURSE → only assigned doctor
    else if(user.role === "nurse"){

      const nurse = await prisma.nurse.findUnique({
        where:{ id: user.id }
      })

      vitals = await prisma.vital.findMany({
        where: {
          doctorId: nurse?.doctorId
        },
        orderBy: { createdAt: "desc" }
      })
    }

    // 🔥 ADMIN
    else if(user.role === "admin"){
      vitals = await prisma.vital.findMany({
        orderBy: { createdAt: "desc" }
      })
    }

    return NextResponse.json(vitals)

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}


/* ============================= */
/* POST */
/* ============================= */

export async function POST(req: Request) {
  try {

    const nurse: any = await getCurrentUser()

    if (!nurse || nurse.role !== "nurse") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    if (!body.patientId) {
      return NextResponse.json(
        { error: "Patient ID required" },
        { status: 400 }
      )
    }

    // 🔥 MAIN FIX → get doctorId from nurse
    const nurseData = await prisma.nurse.findUnique({
      where:{ id: nurse.id }
    })

    const vital = await prisma.vital.create({
      data: {
        patientId: body.patientId,
        nurseId: nurse.id,
        doctorId: nurseData?.doctorId, // 🔥 IMPORTANT FIX

        bp: body.bp || null,

        temperature: body.temperature
          ? Number(body.temperature)
          : null,

        pulse: body.pulse
          ? Number(body.pulse)
          : null,

        notes: body.notes || null
      }
    })

    return NextResponse.json(vital)

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}