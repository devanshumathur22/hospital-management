import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const SECRET = process.env.JWT_SECRET!

/* ====================== */
/* GET USER */
/* ====================== */

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

/* ====================== */
/* CREATE */
/* ====================== */

export async function POST(req: Request){

  try{

    const body = await req.json()
    const user:any = await getUser()

    if(!user || user.role !== "doctor"){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    if(!body.appointmentId){
      return NextResponse.json({ error:"Appointment required" },{ status:400 })
    }

    const appointment = await prisma.appointment.findUnique({
      where:{ id: body.appointmentId }
    })

    if(!appointment){
      return NextResponse.json({ error:"Invalid appointment" },{ status:400 })
    }

    /* prevent duplicate */

    const exist = await prisma.prescription.findUnique({
      where:{ appointmentId: body.appointmentId }
    })

    if(exist){
      return NextResponse.json(exist)
    }

    const prescription = await prisma.prescription.create({
      data:{
        doctorId: user.id,
        patientId: appointment.patientId,
        appointmentId: body.appointmentId,
        medicine: body.medicine,
        notes: body.notes || ""
      }
    })

    return NextResponse.json(prescription)

  }catch(err){
    console.log("CREATE ERROR:",err)
    return NextResponse.json({ error:"Failed" },{ status:500 })
  }
}

/* ====================== */
/* GET */
/* ====================== */

export async function GET(){

  try{

    const user:any = await getUser()

    if(!user){
      return NextResponse.json([])
    }

    let prescriptions:any = []

    /* PATIENT */
    if(user.role === "patient"){
      prescriptions = await prisma.prescription.findMany({
        where:{ patientId: user.id },
        include:{
          doctor:{
            select:{
              id:true,
              name:true,
              specialization:true,
              experience:true
            }
          },
          appointment:true
        },
        orderBy:{ createdAt:"desc" }
      })
    }

    /* DOCTOR */
    else if(user.role === "doctor"){
      prescriptions = await prisma.prescription.findMany({
        where:{ doctorId: user.id },
        include:{
          patient:true,
          appointment:true
        },
        orderBy:{ createdAt:"desc" }
      })
    }

    /* ADMIN */
    else if(user.role === "admin"){
      prescriptions = await prisma.prescription.findMany({
        include:{
          doctor:true,
          patient:true,
          appointment:true
        },
        orderBy:{ createdAt:"desc" }
      })
    }

    return NextResponse.json(prescriptions)

  }catch(err){
    console.log("GET ERROR:",err)
    return NextResponse.json({ error:"Failed" },{ status:500 })
  }
}