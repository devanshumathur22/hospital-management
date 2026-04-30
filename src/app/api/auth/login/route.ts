import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET!

export async function POST(req: Request) {

  try {

    const { email, password } = await req.json()

    const cleanEmail = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET,
      { expiresIn: "7d" }
    )

    // 🔥 MOBILE + WEB BOTH SUPPORT
    const res = NextResponse.json({
      success: true,
      token,
      role: user.role
    })

    // 👉 web ke liye cookie (optional)
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

  } catch (err) {

    console.log("LOGIN ERROR:", err)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}