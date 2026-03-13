import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(req: Request) {

  try {

    const cookieHeader = req.headers.get("cookie")

    if (!cookieHeader) {
      return NextResponse.json({ user: null })
    }

    const tokenCookie = cookieHeader
      .split(";")
      .find(c => c.trim().startsWith("token="))

    if (!tokenCookie) {
      return NextResponse.json({ user: null })
    }

    const token = tokenCookie.split("=")[1]

    const decoded:any = jwt.verify(token, process.env.JWT_SECRET!)

    return NextResponse.json({
      user: {
        id: decoded.id,
        role: decoded.role
      }
    })

  } catch (err) {

    return NextResponse.json({ user: null })

  }

}