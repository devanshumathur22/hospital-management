import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

type Context = {
  params: Promise<{ id: string }>
}


// GET SINGLE PATIENT
export async function GET(
  req: NextRequest,
  context: Context
) {

  const { id } = await context.params

  const patient = await prisma.patient.findUnique({
    where: { id }
  })

  return NextResponse.json(patient)
}


// UPDATE PATIENT
export async function PUT(
  req: NextRequest,
  context: Context
) {

  const { id } = await context.params
  const body = await req.json()

  const updated = await prisma.patient.update({
    where: { id },
    data: {
      name: body.name,
      phone: body.phone,
      gender: body.gender,
      dob: body.dob ? new Date(body.dob) : null,
      bloodGroup: body.bloodGroup,
      address: body.address,
      emergencyContact: body.emergencyContact
    }
  })

  return NextResponse.json(updated)
}


// DELETE
export async function DELETE(
  req: NextRequest,
  context: Context
) {

  const { id } = await context.params

  await prisma.patient.delete({
    where: { id }
  })

  return NextResponse.json({ message: "Deleted" })
}