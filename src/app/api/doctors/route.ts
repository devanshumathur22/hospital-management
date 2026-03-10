import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


// -------- GET ALL DOCTORS --------
export async function GET() {

  try {

    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(doctors);

  } catch (error) {

    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );

  }

}


// -------- CREATE DOCTOR --------
export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      name,
      email,
      password,
      specialization,
      experience,
      degree,
      phone
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, password required" },
        { status: 400 }
      );
    }

    const exist = await prisma.doctor.findUnique({
      where: { email }
    });

    if (exist) {
      return NextResponse.json(
        { error: "Doctor already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
      }

    });

    return NextResponse.json(doctor);

  } catch (error) {

    console.log("CREATE DOCTOR ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create doctor" },
      { status: 500 }
    );

  }

}