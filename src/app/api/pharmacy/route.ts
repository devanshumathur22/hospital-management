import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const SECRET = process.env.JWT_SECRET!

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

/* ================= CREATE BILL ================= */

export async function POST(req: Request){

  try{

    const user:any = await getUser()

    // 🔐 only admin / receptionist
    if(!user || (user.role !== "admin" && user.role !== "receptionist")){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    const body = await req.json()

    const { patientId, items } = body

    // items = [{ medicineId, quantity }]

    let total = 0

    for(const item of items){

      const medicine = await prisma.medicine.findUnique({
        where:{ id: item.medicineId }
      })

      if(!medicine){
        return NextResponse.json({ error:"Medicine not found" },{ status:404 })
      }

      if(medicine.stock < item.quantity){
        return NextResponse.json({ error:`Low stock for ${medicine.name}` },{ status:400 })
      }

      total += medicine.price * item.quantity

      // 🔥 reduce stock
      await prisma.medicine.update({
        where:{ id: item.medicineId },
        data:{
          stock:{
            decrement: item.quantity
          }
        }
      })
    }

    // 🔥 create bill
    const bill = await prisma.pharmacyBill.create({
      data:{
        patientId,
        items,
        total
      }
    })

    return NextResponse.json(bill)

  }catch(err){

    console.log("PHARMACY ERROR:",err)

    return NextResponse.json({ error:"Failed" },{ status:500 })
  }
}

/* ================= GET BILLS ================= */

export async function GET(){

  try{

    const user:any = await getUser()

    if(!user){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    let bills:any = []

    // 👑 admin
    if(user.role === "admin" || user.role === "receptionist"){
      bills = await prisma.pharmacyBill.findMany({
        orderBy:{ createdAt:"desc" }
      })
    }

    // 👤 patient
    else if(user.role === "patient"){

      const patient = await prisma.patient.findFirst({
        where:{ userId:user.id }
      })

      bills = await prisma.pharmacyBill.findMany({
        where:{ patientId: patient?.id },
        orderBy:{ createdAt:"desc" }
      })
    }

    else{
      return NextResponse.json({ error:"Forbidden" },{ status:403 })
    }

    return NextResponse.json(bills)

  }catch{
    return NextResponse.json({ error:"Failed" },{ status:500 })
  }
}