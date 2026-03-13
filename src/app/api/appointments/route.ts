import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"


/* ============================= */
/* GET APPOINTMENTS */
/* ============================= */

export async function GET(){

try{

const cookieStore = await cookies()
const token = cookieStore.get("token")?.value

if(!token){
return NextResponse.json([])
}

let payload:any

try{

payload = jwt.verify(
token,
process.env.JWT_SECRET!
)

}catch{

return NextResponse.json(
{ error:"Invalid token" },
{ status:401 }
)

}

let appointments:any[] = []


/* ============================= */
/* PATIENT VIEW */
/* ============================= */

if(payload.role === "patient"){

appointments = await prisma.appointment.findMany({

where:{
patientId: payload.id
},

include:{
doctor:true
},

orderBy:[
{ date:"desc" },
{ createdAt:"desc" }
]

})

}


/* ============================= */
/* DOCTOR VIEW */
/* ============================= */

else if(payload.role === "doctor"){
appointments = await prisma.appointment.findMany({

where:{
doctorId: payload.id
},

include:{
doctor:true,
patient:{
include:{
vitals:true
}
}
},

orderBy:[
{ date:"desc" },
{ createdAt:"desc" }
]

})

}


/* ============================= */
/* NURSE VIEW */
/* ============================= */

else if(payload.role === "nurse"){

const nurse = await prisma.nurse.findUnique({

where:{
id: payload.id
},

include:{
doctor:true
}

})

if(!nurse?.doctor){
return NextResponse.json([])
}

/* doctor mil gaya */

appointments = await prisma.appointment.findMany({

where:{
doctorId: nurse.doctor.id
},

include:{
doctor:true,
patient:true
},

orderBy:[
{ date:"desc" },
{ createdAt:"desc" }
]

})

}


/* ============================= */
/* ADMIN + RECEPTION VIEW */
/* ============================= */

else if(payload.role === "admin" || payload.role === "receptionist"){

appointments = await prisma.appointment.findMany({

include:{
doctor:true,
patient:true
},

orderBy:[
{ date:"desc" },
{ createdAt:"desc" }
]

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