import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"


/* ========================= */
/* GET QUEUE */
/* ========================= */

export async function GET(){

try{

const cookieStore = await cookies()
const token = cookieStore.get("token")?.value

if(!token){
return NextResponse.json([])
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


let queue:any[] = []


/* DOCTOR VIEW */

if(payload.role === "doctor"){

queue = await prisma.queue.findMany({

where:{
doctorId:payload.id
},

include:{
patient:true
},

orderBy:{
token:"asc"
}

})

}


/* ADMIN + RECEPTIONIST VIEW */

else if(payload.role === "admin" || payload.role === "receptionist"){

queue = await prisma.queue.findMany({

include:{
patient:true,
doctor:true
},

orderBy:{
token:"asc"
}

})

}

return NextResponse.json(queue)

}catch(err){

console.log("GET QUEUE ERROR:",err)

return NextResponse.json(
{ error:"Failed to fetch queue" },
{ status:500 }
)

}

}



/* ========================= */
/* CALL NEXT PATIENT */
/* ========================= */

export async function PATCH(req:Request){

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


if(payload.role !== "doctor" && payload.role !== "admin" && payload.role !== "receptionist"){

return NextResponse.json(
{ error:"Forbidden" },
{ status:403 }
)

}


const body = await req.json()


/* UPDATE QUEUE STATUS */

const queue = await prisma.queue.update({

where:{
id:body.id
},

data:{
status:body.status
}

})

return NextResponse.json(queue)

}catch(err){

console.log("QUEUE UPDATE ERROR:",err)

return NextResponse.json(
{ error:"Failed to update queue" },
{ status:500 }
)

}

}