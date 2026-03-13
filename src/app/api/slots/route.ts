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

/* ALL SLOTS */

const slots = await prisma.slot.findMany({

where:{
doctorId,
date:new Date(date)
},

orderBy:{
time:"asc"
}

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
/* CREATE SLOTS */
/* ========================= */

export async function POST(req:Request){

try{

const cookieStore = await cookies()
const token = cookieStore.get("token")?.value

if(!token){

return NextResponse.json(
{ error:"Unauthorized" },
{ status:401 }
)

}

let payload:any

try{

payload = jwt.verify(token,process.env.JWT_SECRET!)

}catch{

return NextResponse.json(
{ error:"Invalid token" },
{ status:401 }
)

}


/* ONLY ADMIN OR DOCTOR */

if(payload.role !== "admin" && payload.role !== "doctor"){

return NextResponse.json(
{ error:"Forbidden" },
{ status:403 }
)

}


const body = await req.json()

if(!body.doctorId || !body.date || !body.time){

return NextResponse.json(
{ error:"Missing required fields" },
{ status:400 }
)

}


/* CHECK SLOT EXIST */

const exist = await prisma.slot.findFirst({

where:{
doctorId:body.doctorId,
date:new Date(body.date),
time:body.time
}

})

if(exist){

return NextResponse.json(
{ error:"Slot already exists" },
{ status:400 }
)

}


/* CREATE SLOT */

const slot = await prisma.slot.create({

data:{
doctorId:body.doctorId,
date:new Date(body.date),
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