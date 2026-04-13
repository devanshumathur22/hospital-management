import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

/* ============================= */
/* AUTH HELPER */
/* ============================= */

async function getUser(){
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if(!token) return null

  try{
    return jwt.verify(token, process.env.JWT_SECRET!)
  }catch{
    return null
  }
}

/* ============================= */
/* CREATE BILL */
/* ============================= */

export async function POST(req:Request){

  try{

    const user:any = await getUser()

    // 🔒 only admin / receptionist
    if(!user || !["admin","receptionist"].includes(user.role)){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    const body = await req.json()

    const { patientId, items, total } = body

    if(!patientId || !items || items.length === 0){
      return NextResponse.json(
        { error:"Invalid data" },
        { status:400 }
      )
    }

    /* ============================= */
    /* STOCK CHECK + UPDATE */
    /* ============================= */

    for(const item of items){

      const med = await prisma.medicine.findUnique({
        where:{ id:item.id }
      })

      if(!med){
        return NextResponse.json(
          { error:`Medicine not found` },
          { status:404 }
        )
      }

      if(med.stock < item.quantity){
        return NextResponse.json(
          { error:`${med.name} out of stock` },
          { status:400 }
        )
      }

      // 🔥 reduce stock
      await prisma.medicine.update({
        where:{ id:item.id },
        data:{
          stock:{
            decrement: item.quantity
          }
        }
      })
    }

    /* ============================= */
    /* CREATE BILL */
    /* ============================= */

    const bill = await prisma.pharmacyBill.create({
      data:{
        patientId,
        medicines: items, // 🔥 FIXED (NOT items)
        total
      }
    })

    return NextResponse.json(bill)

  }catch(err){

    console.log("PHARMACY ERROR:",err)

    return NextResponse.json(
      { error:"Failed to create bill" },
      { status:500 }
    )
  }

}

/* ============================= */
/* GET ALL BILLS */
/* ============================= */

export async function GET(){

  try{

    const user:any = await getUser()

    if(!user){
      return NextResponse.json([], { status:401 })
    }

    const bills = await prisma.pharmacyBill.findMany({

      orderBy:{ createdAt:"desc" },

      include:{
        patient:true
      }

    })

    return NextResponse.json(bills)

  }catch(err){

    console.log("GET BILL ERROR:",err)

    return NextResponse.json(
      { error:"Failed to fetch bills" },
      { status:500 }
    )

  }

}