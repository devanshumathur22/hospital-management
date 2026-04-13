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

      vitals = await prisma.vital.findMany({
        where:{ patientId: patient?.id },
        orderBy:{ createdAt:"desc" }
      })
    }

    /* ================= DOCTOR ================= */

    else if(user.role === "doctor"){

      const doctor = await prisma.doctor.findFirst({
        where:{ userId: user.id }
      })

      vitals = await prisma.vital.findMany({
        where:{ doctorId: doctor?.id },
        orderBy:{ createdAt:"desc" }
      })
    }

    /* ================= NURSE ================= */

    else if(user.role === "nurse"){

      const nurse = await prisma.nurse.findFirst({
        where:{ userId: user.id }
      })

      vitals = await prisma.vital.findMany({
        where:{ doctorId: nurse?.doctorId },
        orderBy:{ createdAt:"desc" }
      })
    }

    /* ================= ADMIN ================= */

    else if(user.role === "admin"){

      vitals = await prisma.vital.findMany({
        orderBy:{ createdAt:"desc" }
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

    // 🔥 FIX → correct nurse
    const nurse = await prisma.nurse.findFirst({
      where:{ userId: user.id }
    })

    const vital = await prisma.vital.create({
      data: {
        patientId: body.patientId,
        nurseId: nurse?.id,
        doctorId: nurse?.doctorId,

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