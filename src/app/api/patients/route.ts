import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const SECRET = process.env.JWT_SECRET!

/* ================= AUTH ================= */

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

/* ================= MRN GENERATOR ================= */

function generateMRN(){
  return "MRN" + Date.now().toString().slice(-6)
}

/* ================= GET ================= */

export async function GET(){

  try{

    const user:any = await getUser()

    if(!user){
      return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    let patients:any = []

    /* PATIENT → own */
    if(user.role === "patient"){

      const patient = await prisma.patient.findFirst({
        where:{ userId:user.id },
        include:{
          user:{ select:{ email:true } }
        }
      })

      return NextResponse.json(patient)
    }

    /* DOCTOR */
    if(user.role === "doctor"){

      const doctor = await prisma.doctor.findFirst({
        where:{ userId:user.id }
      })

      patients = await prisma.patient.findMany({
        where:{
          appointments:{
            some:{ doctorId:doctor?.id }
          }
        },
        include:{
          user:{ select:{ email:true } }
        }
      })
    }

    /* NURSE */
    else if(user.role === "nurse"){

      const nurse = await prisma.nurse.findFirst({
        where:{ userId:user.id },
        include:{ doctor:true }
      })

      patients = await prisma.patient.findMany({
        where:{
          appointments:{
            some:{ doctorId:nurse?.doctor?.id }
          }
        },
        include:{
          user:{ select:{ email:true } }
        }
      })
    }

    /* ADMIN / RECEPTIONIST */
    else if(user.role === "admin" || user.role === "receptionist"){

      patients = await prisma.patient.findMany({
        include:{
          user:{ select:{ email:true } }
        },
        orderBy:{ createdAt:"desc" }
      })
    }

    else{
      return NextResponse.json({error:"Forbidden"},{status:403})
    }

    return NextResponse.json(patients)

  }catch{
    return NextResponse.json({error:"Failed"},{status:500})
  }
}

/* ================= CREATE ================= */

export async function POST(req:Request){

  try{

    const user:any = await getUser()

    if(!user || (user.role !== "admin" && user.role !== "receptionist")){
      return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    const body = await req.json()

    const email = body.email.toLowerCase().trim()

    const exist = await prisma.user.findUnique({
      where:{ email }
    })

    if(exist){
      return NextResponse.json({error:"User exists"},{status:400})
    }

    const hashed = await bcrypt.hash(body.password || "123456",10)

    const newUser = await prisma.user.create({
      data:{
        email,
        password:hashed,
        role:"patient"
      }
    })

    const patient = await prisma.patient.create({
      data:{
        userId:newUser.id,
        name:body.name,

        /* 🔥 NEW FIELDS */
        mrn: generateMRN(),
        phone:body.phone || null,
        gender:body.gender || null,

        address:body.address || null,
        bloodGroup:body.bloodGroup || null,
        emergencyContact:body.emergencyContact || null
      },
      include:{
        user:{ select:{ email:true } }
      }
    })

    return NextResponse.json(patient)

  }catch(err){
    console.log(err)
    return NextResponse.json({error:"Failed"},{status:500})
  }
}

/* ================= UPDATE ================= */

export async function PUT(req:Request){

  try{

    const user:any = await getUser()

    if(!user || user.role !== "patient"){
      return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    const body = await req.json()

    const patient = await prisma.patient.findFirst({
      where:{ userId:user.id }
    })

    const updated = await prisma.patient.update({
      where:{ id:patient?.id },
      data:{
        name: body.name || undefined,
        phone: body.phone || null,
        address: body.address || null,
        emergencyContact: body.emergencyContact || null
      }
    })

    return NextResponse.json(updated)

  }catch{
    return NextResponse.json({error:"Failed"},{status:500})
  }
}