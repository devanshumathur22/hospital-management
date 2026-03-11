import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

try{

const patients = await prisma.patient.findMany({

orderBy:{
createdAt:"desc"
},

select:{
id:true,
name:true,
email:true,
phone:true,
gender:true,
dob:true,
bloodGroup:true
}

})

return NextResponse.json(patients)

}catch(err){

console.log("GET PATIENTS ERROR:",err)

return NextResponse.json(
{ error:"Failed to fetch patients" },
{ status:500 }
)

}

}