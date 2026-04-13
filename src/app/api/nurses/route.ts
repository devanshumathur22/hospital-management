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

    const nurses = await prisma.nurse.findMany({
      orderBy:{ createdAt:"desc" },
      include:{
        user:{ select:{ email:true } }, // 🔥 email from user
        doctor:{
          select:{
            id:true,
            name:true,
            specialization:true
          }
        }
      }
    })

    return NextResponse.json(nurses)

  }catch(err){

    console.log("GET NURSES ERROR:",err)

    return NextResponse.json(
      { error:"Failed to fetch nurses" },
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

    if(!body.name || !body.email || !body.password){
      return NextResponse.json(
        { error:"Name email password required" },
        { status:400 }
      )
    }

    const email = body.email.toLowerCase().trim()

    // 🔥 check user exist
    const exist = await prisma.user.findUnique({
      where:{ email }
    })

    if(exist){
      return NextResponse.json(
        { error:"User already exists" },
        { status:400 }
      )
    }

    const hashed = await bcrypt.hash(body.password,10)

    // 🔥 create user
    const user = await prisma.user.create({
      data:{
        email,
        password: hashed,
        role:"nurse"
      }
    })

    // 🔥 create nurse profile
    const nurse = await prisma.nurse.create({
      data:{
        userId: user.id,
        name: body.name
      },
      include:{
        user:{ select:{ email:true } }
      }
    })

    return NextResponse.json(nurse,{status:201})

  }catch(err){

    console.log("CREATE NURSE ERROR:",err)

    return NextResponse.json(
      { error:"Failed to create nurse" },
      { status:500 }
    )

  }

}