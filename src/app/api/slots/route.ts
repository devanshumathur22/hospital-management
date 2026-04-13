import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

/* ========================= */
/* GET SLOTS */
/* ========================= */

export async function GET(req:Request){

  try{

    const { searchParams } = new URL(req.url)

    const doctorId = searchParams.get("doctorId")
    const date = searchParams.get("date")

    if(!doctorId || !date){
      return NextResponse.json(
        { error:"doctorId and date required" },
        { status:400 }
      )
    }

    const selectedDate = new Date(date)

    const start = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    )

    const end = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()+1
    )

    const slots = await prisma.slot.findMany({
      where:{
        doctorId,
        date:{
          gte:start,
          lt:end
        }
      },
      orderBy:{ time:"asc" }
    })

    return NextResponse.json(slots)

  }catch(err){

    console.log("GET SLOTS ERROR:",err)

    return NextResponse.json(
      { error:"Failed to fetch slots" },
      { status:500 }
    )

  }

}


/* ========================= */
/* CREATE SLOT */
/* ========================= */

export async function POST(req:Request){

  try{

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if(!token){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    let payload:any

    try{
      payload = jwt.verify(token,process.env.JWT_SECRET!)
    }catch{
      return NextResponse.json({ error:"Invalid token" },{ status:401 })
    }

    const body = await req.json()

    let doctorId = body.doctorId

    /* 🔥 doctor can create only own slots */
    if(payload.role === "doctor"){

      const doctor = await prisma.doctor.findFirst({
        where:{ userId: payload.id }
      })

      doctorId = doctor?.id
    }

    /* 🔥 admin allowed */
    if(payload.role !== "admin" && payload.role !== "doctor"){
      return NextResponse.json({ error:"Forbidden" },{ status:403 })
    }

    if(!doctorId || !body.date || !body.time){
      return NextResponse.json(
        { error:"Missing required fields" },
        { status:400 }
      )
    }

    const selectedDate = new Date(body.date)

    const exist = await prisma.slot.findFirst({
      where:{
        doctorId,
        date:selectedDate,
        time:body.time
      }
    })

    if(exist){
      return NextResponse.json(
        { error:"Slot already exists" },
        { status:400 }
      )
    }

    const slot = await prisma.slot.create({
      data:{
        doctorId,
        date:selectedDate,
        time:body.time,
        isBooked:false
      }
    })

    return NextResponse.json(slot,{status:201})

  }catch(err){

    console.log("CREATE SLOT ERROR:",err)

    return NextResponse.json(
      { error:"Failed to create slot" },
      { status:500 }
    )

  }

}