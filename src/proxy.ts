import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // public routes
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
    const { payload }: any = await jwtVerify(token, secret)
    const role = payload.role?.toLowerCase()

    // role based protection
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