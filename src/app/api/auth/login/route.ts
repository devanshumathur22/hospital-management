import { prisma } from "../../../../lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "hospital_secret_key"

export async function POST(req: Request){

const { email, password } = await req.json()

let user:any = await prisma.doctor.findUnique({ where:{ email } })
let role = "doctor"

if(!user){
user = await prisma.patient.findUnique({ where:{ email } })
role = "patient"
}

if(!user){
user = await prisma.admin.findUnique({ where:{ email } })
role = "admin"
}

if(!user){
return NextResponse.json({error:"User not found"},{status:404})
}

const match = await bcrypt.compare(password,user.password)

if(!match){
return NextResponse.json({error:"Invalid password"},{status:401})
}

const token = jwt.sign(
{ id:user.id, role },
SECRET,
{ expiresIn:"7d" }
)

const response = NextResponse.json({ role })

response.cookies.set({
name:"token",
value:token,
httpOnly:true,
path:"/",
maxAge:60*60*24*7,
sameSite:"lax"
})

return response

}