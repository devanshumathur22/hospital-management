import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
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
    return jwt.verify(token,process.env.JWT_SECRET!)
  }catch{
    return null
  }

}

/* ============================= */
/* GET PATIENTS / PROFILE */
/* ============================= */

export async function GET(){

  try{

    const user:any = await getUser()

    if(!user){
      return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    let patients:any = []

    /* ============================= */
    /* 🔥 PATIENT → own profile */
    /* ============================= */

    if(user.role === "patient"){

      const patient = await prisma.patient.findUnique({
        where:{ id:user.id },
        select:{
          id:true,
          name:true,
          email:true,
          phone:true,
          gender:true,
          bloodGroup:true,
          dob:true,
          address:true,
          emergencyContact:true
        }
      })

      return NextResponse.json(patient)
    }

    /* ============================= */
    /* DOCTOR → own patients */
    /* ============================= */

    if(user.role === "doctor"){

      patients = await prisma.patient.findMany({

        where:{
          appointments:{
            some:{ doctorId:user.id }
          }
        },

        orderBy:{ createdAt:"desc" },

        select:{
          id:true,
          name:true,
          email:true,
          phone:true,
          gender:true,
          bloodGroup:true,
          createdAt:true
        }

      })

    }

    /* ============================= */
    /* NURSE → doctor ke patients */
    /* ============================= */

    else if(user.role === "nurse"){

      const nurse = await prisma.nurse.findUnique({
        where:{ id:user.id },
        include:{ doctor:true }
      })

      if(!nurse?.doctor){
        return NextResponse.json([])
      }

      patients = await prisma.patient.findMany({

        where:{
          appointments:{
            some:{
              doctorId:nurse.doctor.id
            }
          }
        },

        orderBy:{ createdAt:"desc" },

        select:{
          id:true,
          name:true,
          email:true,
          phone:true,
          gender:true,
          bloodGroup:true,
          createdAt:true
        }

      })

    }

    /* ============================= */
    /* ADMIN + RECEPTIONIST */
    /* ============================= */

    else if(user.role === "admin" || user.role === "receptionist"){

      patients = await prisma.patient.findMany({

        orderBy:{ createdAt:"desc" },

        select:{
          id:true,
          name:true,
          email:true,
          phone:true,
          gender:true,
          bloodGroup:true,
          createdAt:true
        }

      })

    }

    else{
      return NextResponse.json(
        {error:"Forbidden"},
        {status:403}
      )
    }

    return NextResponse.json(patients)

  }catch(err){

    console.log("GET PATIENTS ERROR:",err)

    return NextResponse.json(
      {error:"Failed to fetch patients"},
      {status:500}
    )

  }

}

/* ============================= */
/* CREATE PATIENT */
/* ============================= */

export async function POST(req:Request){

  try{

    const user:any = await getUser()

    if(!user){
      return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    if(user.role !== "admin" && user.role !== "receptionist"){
      return NextResponse.json(
        {error:"Forbidden"},
        {status:403}
      )
    }

    const body = await req.json()

    if(!body.name || !body.email){
      return NextResponse.json(
        {error:"Name and Email required"},
        {status:400}
      )
    }

    const email = body.email.toLowerCase().trim()

    const exist = await prisma.patient.findUnique({
      where:{email}
    })

    if(exist){
      return NextResponse.json(
        {error:"Patient already exists"},
        {status:400}
      )
    }

    const password = body.password || "123456"
    const hashedPassword = await bcrypt.hash(password,10)

    const patient = await prisma.patient.create({

      data:{
        name:body.name,
        email,
        password:hashedPassword,
        phone:body.phone || null,
        gender:body.gender || null,
        dob:body.dob ? new Date(body.dob) : null,
        address:body.address || null,
        bloodGroup:body.bloodGroup || null,
        emergencyContact:body.emergencyContact || null,
        allergies:body.allergies || null,
        medicalHistory:body.medicalHistory || null
      },

      select:{
        id:true,
        name:true,
        email:true,
        phone:true,
        gender:true,
        bloodGroup:true,
        createdAt:true
      }

    })

    return NextResponse.json(patient,{status:201})

  }catch(err){

    console.log("CREATE PATIENT ERROR:",err)

    return NextResponse.json(
      {error:"Failed to create patient"},
      {status:500}
    )

  }

}

/* ============================= */
/* UPDATE PATIENT PROFILE */
/* ============================= */

export async function PUT(req:Request){

  try{

    const user:any = await getUser()

    if(!user){
      return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    if(user.role !== "patient"){
      return NextResponse.json(
        {error:"Forbidden"},
        {status:403}
      )
    }

    const body = await req.json()

    const updated = await prisma.patient.update({

      where:{ id:user.id },

      data:{
        name: body.name || undefined,
        phone: body.phone || null,
        gender: body.gender || null,
        dob: body.dob ? new Date(body.dob) : null,
        address: body.address || null,
        bloodGroup: body.bloodGroup || null,
        emergencyContact: body.emergencyContact || null
      }

    })

    return NextResponse.json(updated)

  }catch(err){

    console.log("UPDATE PATIENT ERROR:",err)

    return NextResponse.json(
      {error:"Failed to update profile"},
      {status:500}
    )

  }

}