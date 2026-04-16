import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
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

/* ============================= */
/* GET ALL NURSES */
/* ============================= */

export async function GET(){

  try{

    const user:any = await getUser()

    // 🔥 only admin access
    if(!user || user.role !== "admin"){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    const nurses = await prisma.nurse.findMany({
      orderBy:{ createdAt:"desc" },
      include:{
        user:{ select:{ email:true } },
        doctor:{
          select:{
            id:true,
            name:true,
            specialization:true
          }
        }
      }
    })

    return NextResponse.json({
      success:true,
      data:nurses
    })

  }catch(err){

    console.log("GET NURSES ERROR:",err)

    return NextResponse.json(
      { success:false, error:"Failed to fetch nurses" },
      { status:500 }
    )

  }

}

/* ============================= */
/* CREATE NURSE */
/* ============================= */

export async function POST(req:Request){

  try{

    const admin:any = await getUser()

    // 🔥 only admin
    if(!admin || admin.role !== "admin"){
      return NextResponse.json({ error:"Unauthorized" },{ status:401 })
    }

    const body = await req.json()

    const name = body.name?.trim()
    const email = body.email?.toLowerCase().trim()
    const password = body.password

    /* 🔥 VALIDATION */
    if(!name || !email || !password){
      return NextResponse.json(
        { error:"Name, email and password required" },
        { status:400 }
      )
    }

    if(password.length < 6){
      return NextResponse.json(
        { error:"Password must be at least 6 characters" },
        { status:400 }
      )
    }

    /* 🔥 CHECK EXIST */
    const exist = await prisma.user.findUnique({
      where:{ email }
    })

    if(exist){
      return NextResponse.json(
        { error:"User already exists" },
        { status:400 }
      )
    }

    const hashed = await bcrypt.hash(password,10)

    /* 🔥 TRANSACTION (IMPORTANT) */
    const result = await prisma.$transaction(async (tx)=>{

      const user = await tx.user.create({
        data:{
          email,
          password: hashed,
          role:"nurse"
        }
      })

      const nurse = await tx.nurse.create({
        data:{
          userId: user.id,
          name
        },
        include:{
          user:{ select:{ email:true } }
        }
      })

      return nurse
    })

    return NextResponse.json({
      success:true,
      data:result
    },{ status:201 })

  }catch(err){

    console.log("CREATE NURSE ERROR:",err)

    return NextResponse.json(
      { success:false, error:"Failed to create nurse" },
      { status:500 }
    )

  }

}