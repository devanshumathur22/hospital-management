import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET!

export function proxy(req: NextRequest) {

  const { pathname } = req.nextUrl

  // allow public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next()
  }

  const token = req.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {

    // ✅ verify JWT
    const decoded: any = jwt.verify(token, SECRET)

    const role = decoded.role

    // role-based protection
    if (pathname.startsWith("/doctor") && role !== "doctor") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (pathname.startsWith("/patient") && role !== "patient") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (pathname.startsWith("/receptionist") && role !== "receptionist") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (pathname.startsWith("/nurse") && role !== "nurse") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()

  } catch (err) {
    console.log("JWT error:", err)
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: [
    "/doctor/:path*",
    "/patient/:path*",
    "/admin/:path*",
    "/receptionist/:path*",
    "/nurse/:path*"
  ]
}