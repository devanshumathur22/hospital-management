import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request){

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""

  if(!q){
    return NextResponse.json([])
  }

  try{

    /* 🔥 DOCTORS */
    const doctors = await prisma.doctor.findMany({
      where:{
        OR:[
          { name:{ contains:q, mode:"insensitive" } },
          { specialization:{ contains:q, mode:"insensitive" } }
        ]
      },
      select:{
        id:true,
        name:true,
        specialization:true
      }
    })

    /* 🔥 PATIENTS */
   const patients = await prisma.patient.findMany({
  where:{
    OR:[
      { name:{ contains:q, mode:"insensitive" } },
      { phone:{ contains:q } },
      { mrn:{ contains:q } } // 🔥 ADD
    ]
  }
})

    /* 🔥 COMBINE */
    const results = [
      ...doctors.map(d=>({
        ...d,
        type:"doctor"
      })),
      ...patients.map(p=>({
        ...p,
        type:"patient"
      }))
    ]

    return NextResponse.json(results)

  }catch(err){
    console.log(err)
    return NextResponse.json([])
  }

}