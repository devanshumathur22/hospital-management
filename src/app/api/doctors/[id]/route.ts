import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"


// UPDATE DOCTOR
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  const body = await req.json()

  const doctor = await prisma.doctor.update({
    where: { id: params.id },
    data: {
      name: body.name,
      specialization: body.specialization,
      experience: Number(body.experience),
      email: body.email
    }
  })

  return NextResponse.json(doctor)

}



// DELETE DOCTOR
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  await prisma.doctor.delete({
    where: { id: params.id }
  })

  return NextResponse.json({
    message: "Doctor deleted"
  })

}