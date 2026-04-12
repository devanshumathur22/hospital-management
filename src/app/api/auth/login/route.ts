import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET!

// ✅ GET (test)
export async function GET() {
  return NextResponse.json({ message: "Login API working" })
}

// ✅ POST (LOGIN)
export async function POST(req: Request){

  const { email, password, role } = await req.json()
  const cleanEmail = email.toLowerCase().trim()

  let user:any = null
  let finalRole = role

  // 🔥 1. STRICT ROLE CHECK (FIRST PRIORITY)
  if(role === "admin"){
    user = await prisma.admin.findUnique({ where:{ email: cleanEmail } })
  } 
  else if(role === "doctor"){
    user = await prisma.doctor.findUnique({ where:{ email: cleanEmail } })
  } 
  else if(role === "patient"){
    user = await prisma.patient.findUnique({ where:{ email: cleanEmail } })
  } 
  else if(role === "receptionist"){
    user = await prisma.receptionist.findUnique({ where:{ email: cleanEmail } })
  } 
  else if(role === "nurse"){
    user = await prisma.nurse.findUnique({ where:{ email: cleanEmail } })
  }

  // 🔥 2. FALLBACK (SAFE + CORRECT ORDER)
  if(!user){

    const admin = await prisma.admin.findUnique({ where:{ email: cleanEmail } })
    if(admin){
      user = admin
      finalRole = "admin"
    }

    const doctor = await prisma.doctor.findUnique({ where:{ email: cleanEmail } })
    if(!user && doctor){
      user = doctor
      finalRole = "doctor"
    }

    const patient = await prisma.patient.findUnique({ where:{ email: cleanEmail } })
    if(!user && patient){
      user = patient
      finalRole = "patient"
    }

    const receptionist = await prisma.receptionist.findUnique({ where:{ email: cleanEmail } })
    if(!user && receptionist){
      user = receptionist
      finalRole = "receptionist"
    }

    const nurse = await prisma.nurse.findUnique({ where:{ email: cleanEmail } })
    if(!user && nurse){
      user = nurse
      finalRole = "nurse"
    }
  }

  // ❌ user not found
  if(!user){
    return NextResponse.json({ error:"User not found" },{ status:404 })
  }

  // ❌ password check
  const match = await bcrypt.compare(password,user.password)

  if(!match){
    return NextResponse.json({ error:"Invalid password" },{ status:401 })
  }

  // ✅ JWT
  const token = jwt.sign(
    { id:user.id, role: finalRole },
    SECRET,
    { expiresIn:"7d" }
  )

  const response = NextResponse.json({ role: finalRole })

  // 🔥 reset old cookie
  response.cookies.delete("token")

  // 🔥 set new cookie
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  })

  return response
}