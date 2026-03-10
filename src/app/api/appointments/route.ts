import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"



/* CREATE APPOINTMENT */

export async function POST(req: Request){

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


/* CHECK SLOT (prevent double booking) */

const exists = await prisma.appointment.findFirst({

where:{
doctorId: body.doctorId,
time: body.time,
date:{
gte: new Date(body.date),
lt: new Date(new Date(body.date).getTime() + 86400000)
}
}

})

if(exists){

return NextResponse.json(
{ error:"This time slot is already booked" },
{ status:400 }
)

}


/* CREATE APPOINTMENT */

const appointment = await prisma.appointment.create({

data:{
doctorId: body.doctorId,
patientId: payload.id,
date: new Date(body.date),
time: body.time
}

})

return NextResponse.json(appointment)

}catch(err){

console.log("CREATE APPOINTMENT ERROR:",err)

return NextResponse.json(
{ error:"Failed to create appointment" },
{ status:500 }
)

}

}



/* GET APPOINTMENTS */

export async function GET(){

try{

const cookieStore = await cookies()
const token = cookieStore.get("token")?.value

if(!token){
return NextResponse.json([])
}

const payload:any = jwt.verify(
token,
process.env.JWT_SECRET!
)

let appointments:any[] = []


/* PATIENT VIEW */

if(payload.role === "patient"){

appointments = await prisma.appointment.findMany({

where:{
patientId: payload.id
},

include:{
doctor:true
},

orderBy:{
createdAt:"desc"
}

})

}


/* DOCTOR VIEW */

else if(payload.role === "doctor"){

appointments = await prisma.appointment.findMany({

where:{
doctorId: payload.id
},

include:{
patient:true,
doctor:true
},

orderBy:{
createdAt:"desc"
}

})

}


/* ADMIN VIEW */

else if(payload.role === "admin"){

appointments = await prisma.appointment.findMany({

include:{
doctor:true,
patient:true
},

orderBy:{
createdAt:"desc"
}

})

}


return NextResponse.json(appointments)

}catch(err){

console.log("GET APPOINTMENTS ERROR:",err)

return NextResponse.json(
{ error:"Failed to fetch appointments" },
{ status:500 }
)

}

}