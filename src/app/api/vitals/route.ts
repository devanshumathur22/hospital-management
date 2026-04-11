import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/getUser"

/* GET */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get("patient")

    const vitals = await prisma.vital.findMany({
      where: {
        patientId: patientId || undefined
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(vitals)

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}


/* POST */

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

    const vital = await prisma.vital.create({
      data: {
        patientId: body.patientId,
        nurseId: nurse.id,

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