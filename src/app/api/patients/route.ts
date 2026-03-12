import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {

  const patient = await prisma.patient.findFirst()

  return NextResponse.json(patient)

}

export async function PUT(req:Request){

  const body = await req.json()

  const updated = await prisma.patient.update({
    where:{
      email: body.email
    },
    data:{
      name: body.name,
      phone: body.phone,
      gender: body.gender,
      dob: body.dob,
      bloodGroup: body.bloodGroup,
      address: body.address,
      emergencyContact: body.emergencyContact
    }
  })

  return NextResponse.json(updated)

}