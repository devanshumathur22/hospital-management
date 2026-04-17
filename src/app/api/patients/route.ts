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

/* ================= MRN ================= */

function generateMRN(){
  return "MRN" + Date.now().toString().slice(-6)
}

/* ================= GET ================= */

export async function GET(req:Request){

  try{

    const user:any = await getUser()
    if(!user){
      return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    const url = new URL(req.url)

    /* 🔥 SINGLE PATIENT (DETAIL PAGE) */
    const id = url.searchParams.get("id")
    if(id){

      const patient = await prisma.patient.findUnique({
        where:{ id },
        include:{
          user:{ select:{ email:true } }
        }
      })

      if(!patient){
        return NextResponse.json({error:"Not found"},{status:404})
      }

      return NextResponse.json(patient)
    }

    /* 🔥 SEARCH + PAGINATION */
    const search = url.searchParams.get("search") || ""
    const page = Number(url.searchParams.get("page") || 1)
    const limit = 6
    const skip = (page - 1) * limit

    let patients:any = []

    /* ADMIN / RECEPTIONIST */
    if(user.role === "admin" || user.role === "receptionist"){

      patients = await prisma.patient.findMany({
        where:{
          OR:[
            { name:{ contains:search, mode:"insensitive" } },
            { phone:{ contains:search } },
            {
              user:{
                email:{ contains:search, mode:"insensitive" }
              }
            }
          ]
        },
        include:{
          user:{ select:{ email:true } }
        },
        orderBy:{ createdAt:"desc" },
        skip,
        take:limit
      })

      const total = await prisma.patient.count()

      return NextResponse.json({
        data:patients,
        total,
        page,
        totalPages:Math.ceil(total/limit)
      })
    }

    /* PATIENT */
    if(user.role === "patient"){
      const patient = await prisma.patient.findFirst({
        where:{ userId:user.id },
        include:{ user:{ select:{ email:true } } }
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
        include:{ user:{ select:{ email:true } } }
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
        include:{ user:{ select:{ email:true } } }
      })
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

  }catch{
    return NextResponse.json({error:"Failed"},{status:500})
  }
}

/* ================= UPDATE ================= */

export async function PUT(req:Request){

  try{

    const user:any = await getUser()

    if(!user){
      return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    const body = await req.json()

    const updated = await prisma.patient.update({
      where:{ id:body.id },
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

/* ================= DELETE ================= */

export async function DELETE(req:Request){

  try{

    const user:any = await getUser()

    if(!user || (user.role !== "admin" && user.role !== "receptionist")){
      return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    const url = new URL(req.url)
    const id = url.searchParams.get("id")

    if(!id){
      return NextResponse.json({error:"ID required"},{status:400})
    }

    await prisma.patient.delete({
      where:{ id }
    })

    return NextResponse.json({success:true})

  }catch{
    return NextResponse.json({error:"Failed"},{status:500})
  }
}