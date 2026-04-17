import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/getUser"

/* ================= GET ================= */

export async function GET(req: Request) {
  try {

    const user:any = await getCurrentUser()

    if(!user){
      return NextResponse.json([], { status: 401 })
    }

    let vitals:any = []

    /* ================= PATIENT ================= */

    if(user.role === "patient"){

      const patient = await prisma.patient.findFirst({
        where:{ userId: user.id }
      })

      if(!patient){
        return NextResponse.json([], { status: 404 })
      }

      vitals = await prisma.vital.findMany({
        where:{ patientId: patient.id },
        orderBy:{ createdAt:"desc" },
        include:{
          doctor:{ select:{ name:true } },
          nurse:{ select:{ name:true } }
        }
      })
    }

    /* ================= DOCTOR ================= */

    else if(user.role === "doctor"){

      const doctor = await prisma.doctor.findFirst({
        where:{ userId: user.id }
      })

      if(!doctor){
        return NextResponse.json([], { status: 404 })
      }

      vitals = await prisma.vital.findMany({
        where:{ doctorId: doctor.id },
        orderBy:{ createdAt:"desc" },
        include:{
          patient:{ select:{ name:true } },
          nurse:{ select:{ name:true } }
        }
      })
    }

    /* ================= NURSE ================= */

    else if(user.role === "nurse"){

      const nurse = await prisma.nurse.findFirst({
        where:{ userId: user.id }
      })

      if(!nurse){
        return NextResponse.json([], { status: 404 })
      }

      vitals = await prisma.vital.findMany({
        where:{ nurseId: nurse.id }, // 🔥 FIXED
        orderBy:{ createdAt:"desc" },
        include:{
          patient:{ select:{ name:true } },
          doctor:{ select:{ name:true } }
        }
      })
    }

    /* ================= ADMIN ================= */

    else if(user.role === "admin"){

      vitals = await prisma.vital.findMany({
        orderBy:{ createdAt:"desc" },
        include:{
          patient:{ select:{ name:true } },
          doctor:{ select:{ name:true } },
          nurse:{ select:{ name:true } }
        }
      })
    }

    return NextResponse.json(vitals)

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}


/* ================= POST ================= */

export async function POST(req: Request) {
  try {

    const user:any = await getCurrentUser()

    if (!user || user.role !== "nurse") {
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

    /* 🔥 GET NURSE */
    const nurse = await prisma.nurse.findFirst({
      where:{ userId: user.id }
    })

    if(!nurse){
      return NextResponse.json(
        { error:"Nurse not found" },
        { status:404 }
      )
    }

    if(!nurse.doctorId){
      return NextResponse.json(
        { error:"Doctor not assigned to nurse" },
        { status:400 }
      )
    }

    /* 🔥 CREATE VITAL */
    const vital = await prisma.vital.create({
      data: {
        patientId: body.patientId,
        nurseId: nurse.id,
        doctorId: nurse.doctorId,

        bp: body.bp || null,

        temperature: body.temperature
          ? Number(body.temperature)
          : null,

        pulse: body.pulse
          ? Number(body.pulse)
          : null,

        notes: body.notes || null
      },
      include:{
        patient:{ select:{ name:true } },
        doctor:{ select:{ name:true } },
        nurse:{ select:{ name:true } }
      }
    })

    return NextResponse.json({
      success:true,
      data:vital
    })

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}