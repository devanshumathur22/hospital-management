import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function PUT(req:Request){

try{

const body = await req.json()

const { email, subject, message } = body

await sendEmail(email,subject,message)

return NextResponse.json({
success:true
})

}catch(err){

console.log("NOTIFICATION ERROR:",err)

return NextResponse.json(
{ error:"Failed to send notification" },
{ status:500 }
)

}

}