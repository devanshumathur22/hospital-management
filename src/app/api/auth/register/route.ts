import { prisma } from "@/lib/prisma"
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
      return NextResponse.json({ error: "All fields required" }, { status: 400 })
    }

    // ✅ check user
    const existing = await prisma.user.findUnique({
      where: { email }
    })

    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // ✅ create USER
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role
      }
    })

    // 🔥 create ROLE PROFILE

    if (role === "doctor") {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          name,
          specialization: specialization || "General",
          experience: Number(experience) || 0,
          degree: degree || null,
          phone: phone || null
        }
      })
    }

    if (role === "patient") {
      await prisma.patient.create({
        data: {
          userId: user.id,
          name
        }
      })
    }

    if (role === "receptionist") {
      await prisma.receptionist.create({
        data: {
          userId: user.id,
          name
        }
      })
    }

    if (role === "nurse") {
      await prisma.nurse.create({
        data: {
          userId: user.id,
          name
        }
      })
    }

    if (role === "admin") {
      await prisma.admin.create({
        data: {
          userId: user.id,
          name
        }
      })
    }

    return NextResponse.json({
      message: "User registered successfully",
      role
    })

  } catch (error) {
    console.log("REGISTER ERROR:", error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}