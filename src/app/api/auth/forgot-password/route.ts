import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import crypto from "crypto"
import { sendEmail } from "@/lib/email" // ✅ ADD THIS

export async function POST(req: Request){

  const { email } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if(!user){
    return NextResponse.json({ error:"User not found" },{ status:404 })
  }

  // generate token
  const token = crypto.randomBytes(32).toString("hex")

  // expiry (15 min)
  const expiry = new Date(Date.now() + 15 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry
    }
  })

  const resetLink = `http://localhost:3000/reset-password?token=${token}`

  // ✅ SEND EMAIL
  await sendEmail(
    user.email,
    "Reset Password",
    `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `
  )

  return NextResponse.json({
    message:"Reset link sent to your email"
  })
}