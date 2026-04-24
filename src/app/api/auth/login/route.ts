import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET!

export async function POST(req: Request){

  const { email, password } = await req.json()
  const cleanEmail = email.toLowerCase().trim()

  const user = await prisma.user.findUnique({
    where: { email: cleanEmail }
  })

  if(!user){
    return NextResponse.json({ error:"User not found" },{ status:404 })
  }

  const match = await bcrypt.compare(password, user.password)

  if(!match){
    return NextResponse.json({ error:"Invalid password" },{ status:401 })
  }

  const token = jwt.sign(
    { id:user.id, role: user.role },
    SECRET,
    { expiresIn:"7d" }
  )

  const res = NextResponse.json({
    token,                // 🔥 ADD THIS
    role: user.role
  })

  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return res
}