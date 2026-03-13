import { prisma } from "../../../../lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

try {
const body = await req.json()

const name = body.name?.trim()
const email = body.email?.trim().toLowerCase()
const password = body.password
const role = body.role?.toLowerCase().trim()

const specialization = body.specialization
const experience = body.experience
const degree = body.degree
const phone = body.phone

if (!name || !email || !password || !role) {
  return NextResponse.json(
    { error: "All fields required" },
    { status: 400 }
  )
}

const hashedPassword = await bcrypt.hash(password, 10)

// ---------- DOCTOR ----------
if (role === "doctor") {

  const exist = await prisma.doctor.findUnique({
    where: { email }
  })

  if (exist) {
    return NextResponse.json(
      { error: "Doctor already exists" },
      { status: 400 }
    )
  }

  const doctor = await prisma.doctor.create({
    data: {
      name,
      email,
      password: hashedPassword,
      specialization: specialization || "General",
      experience: Number(experience) || 0,
      degree: degree || null,
      phone: phone || null
    }
  })

  return NextResponse.json(doctor)
}

// ---------- PATIENT ----------
if (role === "patient") {

  const exist = await prisma.patient.findUnique({
    where: { email }
  })

  if (exist) {
    return NextResponse.json(
      { error: "Patient already exists" },
      { status: 400 }
    )
  }

  const patient = await prisma.patient.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  return NextResponse.json(patient)
}

// --------- RECEPTIONIST ----------
if (role === "receptionist") {

  const exist = await prisma.receptionist.findUnique({
    where: { email }
  })

  if (exist) {
    return NextResponse.json(
      { error: "Receptionist already exists" },
      { status: 400 }
    )
  }

  const receptionist = await prisma.receptionist.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  return NextResponse.json(receptionist)
}

// --------- NURSE ----------
if (role === "nurse") {

  const exist = await prisma.nurse.findUnique({
    where: { email }
  })

  if (exist) {
    return NextResponse.json(
      { error: "Nurse already exists" },
      { status: 400 }
    )
  }

  const nurse = await prisma.nurse.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  return NextResponse.json(nurse)
}

// ---------- ADMIN ----------
if (role === "admin") {

  const exist = await prisma.admin.findUnique({
    where: { email }
  })

  if (exist) {
    return NextResponse.json(
      { error: "Admin already exists" },
      { status: 400 }
    )
  }

  const admin = await prisma.admin.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  return NextResponse.json(admin)
}

return NextResponse.json(
  { error: "Invalid role" },
  { status: 400 }
)

} catch (error) {

console.log("REGISTER ERROR:", error)

return NextResponse.json(
  { error: "Server error" },
  { status: 500 }
)
}

}
