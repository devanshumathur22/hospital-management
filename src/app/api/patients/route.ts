import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"


/* GET PATIENT PROFILE */

export async function GET(){

try{

const cookieStore = await cookies()
const token = cookieStore.get("token")?.value

if(!token){

return NextResponse.json(
{ error:"Unauthorized" },
{ status:401 }
)

}

const payload:any = jwt.verify(
token,
process.env.JWT_SECRET!
)

const patient = await prisma.patient.findUnique({

where:{
id: payload.id
}

})

return NextResponse.json(patient)

}catch(err){

console.log("PATIENT GET ERROR:",err)

return NextResponse.json(
{ error:"Failed to fetch patient" },
{ status:500 }
)

}

}



/* UPDATE PATIENT PROFILE */

export async function PUT(req:Request){

try{

const body = await req.json()

const cookieStore = await cookies()
const token = cookieStore.get("token")?.value

if(!token){

return NextResponse.json(
{ error:"Unauthorized" },
{ status:401 }
)

}

const payload:any = jwt.verify(
token,
process.env.JWT_SECRET!
)

const patient = await prisma.patient.update({

where:{
id: payload.id
},

data:{
name: body.name,
phone: body.phone,
gender: body.gender,
dob: body.dob ? new Date(body.dob) : null,
bloodGroup: body.bloodGroup,
address: body.address,
emergencyContact: body.emergencyContact
}

})

return NextResponse.json(patient)

}catch(err){

console.log("PATIENT UPDATE ERROR:",err)

return NextResponse.json(
{ error:"Failed to update patient" },
{ status:500 }
)

}

}