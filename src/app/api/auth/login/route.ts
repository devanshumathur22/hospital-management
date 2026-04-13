import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET!

export async function POST(req: Request){

  const { email, password } = await req.json()
  const cleanEmail = email.toLowerCase().trim()

  // ✅ 1. Find user
  const user = await prisma.user.findUnique({
    where: { email: cleanEmail }
  })

  if(!user){
    return NextResponse.json({ error:"User not found" },{ status:404 })
  }

  // ✅ 2. Password check
  const match = await bcrypt.compare(password, user.password)

  if(!match){
    return NextResponse.json({ error:"Invalid password" },{ status:401 })
  }

  // ✅ 3. JWT
  const token = jwt.sign(
    { id:user.id, role: user.role },
    SECRET,
    { expiresIn:"7d" }
  )

  const response = NextResponse.json({ role: user.role })

  // reset old cookie
  response.cookies.delete("token")

  // set new cookie
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  })

  return response
}