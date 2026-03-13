import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

/* ============================= */
/* GET ALL NURSES */
/* ============================= */

export async function GET(){

try{

const nurses = await prisma.nurse.findMany({

orderBy:{ createdAt:"desc" },

select:{
id:true,
name:true,
email:true,
createdAt:true
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

const body = await req.json()

if(!body.name || !body.email || !body.password){

return NextResponse.json(
{ error:"Name email password required" },
{ status:400 }
)

}

const email = body.email.toLowerCase().trim()

/* check exist */

const exist = await prisma.nurse.findUnique({
where:{ email }
})

if(exist){

return NextResponse.json(
{ error:"Nurse already exists" },
{ status:400 }
)

}

/* password hash */

const hashedPassword = await bcrypt.hash(body.password,10)

/* create nurse */

const nurse = await prisma.nurse.create({

data:{
name:body.name,
email,
password:hashedPassword
},

select:{
id:true,
name:true,
email:true,
createdAt:true
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