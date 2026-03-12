import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"



/* -------- GET ALL DOCTORS -------- */

export async function GET() {

  try {

    const doctors = await prisma.doctor.findMany({

      orderBy: { createdAt: "desc" },

      select: {
        id: true,
        name: true,
        email: true,
        specialization: true,
        experience: true,
        degree: true,
        phone: true,
        createdAt: true
      }

    })

    return NextResponse.json(doctors)

  } catch (error) {

    console.log("GET DOCTORS ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    )

  }

}



/* -------- CREATE DOCTOR -------- */

export async function POST(req: Request) {

  try {

    const body = await req.json()

    let {
      name,
      email,
      password,
      specialization,
      experience,
      degree,
      phone
    } = body



    /* VALIDATION */

    if (!name || !email || !password) {

      return NextResponse.json(
        { error: "Name, email and password required" },
        { status: 400 }
      )

    }



    /* NORMALIZE EMAIL */

    email = email.toLowerCase().trim()



    /* CHECK EXISTING DOCTOR */

    const exist = await prisma.doctor.findUnique({
      where: { email }
    })

    if (exist) {

      return NextResponse.json(
        { error: "Doctor already exists" },
        { status: 400 }
      )

    }



    /* HASH PASSWORD */

    const hashedPassword = await bcrypt.hash(password, 10)



    /* CREATE DOCTOR */

    const doctor = await prisma.doctor.create({

      data: {
        name,
        email,
        password: hashedPassword,
        specialization: specialization || "General",
        experience: Number(experience) || 0,
        degree: degree || null,
        phone: phone || null,
        role: "doctor"
      },

      select: {
        id: true,
        name: true,
        email: true,
        specialization: true,
        experience: true,
        degree: true,
        phone: true,
        createdAt: true
      }

    })



    return NextResponse.json(doctor, { status: 201 })



  } catch (error) {

    console.log("CREATE DOCTOR ERROR:", error)

    return NextResponse.json(
      { error: "Failed to create doctor" },
      { status: 500 }
    )

  }

}