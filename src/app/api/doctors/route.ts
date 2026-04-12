import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

/* -------- GET ALL DOCTORS -------- */

export async function GET(){
  try{

    const doctors = await prisma.doctor.findMany({

      orderBy:{ createdAt:"desc" },

      select:{
        id:true,
        name:true,
        email:true,
        specialization:true,
        experience:true,
        degree:true,
        phone:true,
        image:true,
        about:true,
        createdAt:true,

        // 🔥 ADD THIS
        nurses:{
          select:{
            id:true,
            name:true,
            email:true
          }
        }

      }

    })

    return NextResponse.json(doctors)

  }catch(error){

    console.log("GET DOCTORS ERROR:",error)

    return NextResponse.json(
      { error:"Failed to fetch doctors" },
      { status:500 }
    )

  }
}

/* -------- CREATE DOCTOR -------- */

export async function POST(req:Request){

try{

const body = await req.json()

let { name,email,password,specialization,experience,degree,phone,image,about } = body

if(!name || !email || !password){

return NextResponse.json(
{ error:"Name email password required" },
{ status:400 }
)

}

email = email.toLowerCase().trim()

const exist = await prisma.doctor.findUnique({
where:{ email }
})

if(exist){

return NextResponse.json(
{ error:"Doctor already exists" },
{ status:400 }
)

}

const hashedPassword = await bcrypt.hash(password,10)

const doctor = await prisma.doctor.create({

data:{
name,
email,
password:hashedPassword,
specialization: specialization || "General",
experience:Number(experience) || 0,
degree: degree || null,
phone: phone || null,
image: image || null,
about: about || null,
role:"doctor"
},

select:{
id:true,
name:true,
email:true,
specialization:true,
experience:true,
degree:true,
phone:true,
image:true,
about:true,
createdAt:true
}

})

return NextResponse.json(doctor,{status:201})

}catch(error){

console.log("CREATE DOCTOR ERROR:",error)

return NextResponse.json(
{ error:"Failed to create doctor" },
{ status:500 }
)

}

}



/* -------- UPDATE DOCTOR -------- */

export async function PUT(req:Request){

try{

const body = await req.json()

const { id, password, ...data } = body

if(!id){

return NextResponse.json(
{ error:"Doctor id required" },
{ status:400 }
)

}

/* password update */

if(password){
data.password = await bcrypt.hash(password,10)
}

const updatedDoctor = await prisma.doctor.update({

where:{ id },

data,

select:{
id:true,
name:true,
email:true,
specialization:true,
experience:true,
degree:true,
phone:true,
image:true,
about:true,
createdAt:true
}

})

return NextResponse.json(updatedDoctor)

}catch(error){

console.log("UPDATE DOCTOR ERROR:",error)

return NextResponse.json(
{ error:"Failed to update doctor" },
{ status:500 }
)

}

}