import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request){

  const { token, password } = await req.json()

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date()
      }
    }
  })

  if(!user){
    return NextResponse.json({ error:"Invalid or expired token" },{ status:400 })
  }

  const hashed = await bcrypt.hash(password,10)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null
    }
  })

  return NextResponse.json({ message:"Password updated" })
}