import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()   // ✅ FIX

    const token = cookieStore.get("token")?.value

    if (!token) return null

    const user = jwt.verify(token, process.env.JWT_SECRET!) as any

    return user
  } catch {
    return null
  }
}