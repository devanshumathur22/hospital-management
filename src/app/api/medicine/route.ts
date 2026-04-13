import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const SECRET = process.env.JWT_SECRET!

/* 🔐 AUTH */
async function getUser(){
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if(!token) return null

  try{
    return jwt.verify(token, SECRET)
  }catch{
    return null
  }
}

/* ===================== */
/* CREATE MEDICINE */
/* ===================== */

export async function POST(req: Request) {

  try {

    const user:any = await getUser()

    // 🔥 only admin / receptionist
    if(!user || (user.role !== "admin" && user.role !== "receptionist")){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    const body = await req.json()

    const { name, company, price, stock } = body

    if(!name || !price || !stock){
      return NextResponse.json(
        { error:"Name, price, stock required" },
        { status:400 }
      )
    }

    const medicine = await prisma.medicine.create({
      data:{
        name: name.trim(),
        company: company || "",
        price: Number(price),
        stock: Number(stock)
      }
    })

    return NextResponse.json(medicine)

  } catch (error) {

    console.log("MEDICINE CREATE ERROR:", error)

    return NextResponse.json(
      { error:"Medicine not added" },
      { status:500 }
    )

  }

}

/* ===================== */
/* GET ALL */
/* ===================== */

export async function GET() {

  try {

    const medicines = await prisma.medicine.findMany({
      orderBy:{ createdAt:"desc" }
    })

    return NextResponse.json(medicines)

  } catch (error) {

    console.log("MEDICINE FETCH ERROR:", error)

    return NextResponse.json(
      { error:"Failed to fetch medicines" },
      { status:500 }
    )

  }

}