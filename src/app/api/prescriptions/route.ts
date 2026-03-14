import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"



/* CREATE PRESCRIPTION */

export async function POST(req: Request){

  try{

    const body = await req.json()

    if(!body.appointmentId){
      return NextResponse.json(
        { error:"Appointment ID required" },
        { status:400 }
      )
    }

    // check existing prescription
    const existing = await prisma.prescription.findUnique({
      where:{
        appointmentId: body.appointmentId
      }
    })

    if(existing){
      return NextResponse.json(existing)
    }

    const prescription = await prisma.prescription.create({

      data:{
        doctorId: body.doctorId,
        patientId: body.patientId,
        appointmentId: body.appointmentId,
        medicine: body.medicine,
        notes: body.notes
      }

    })


    /* ============================= */
    /* SEND NOTIFICATION */
    /* ============================= */

    try{

      const patient = await prisma.patient.findUnique({
        where:{ id: body.patientId }
      })

      if(patient?.email){

        await fetch(`/api/notifications/send`,{

          method:"PUT",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({

            email: patient.email,

            subject:"Prescription Ready",

            message:`Hello ${patient.name},

Your prescription has been added by the doctor.

Please login to view your prescription.

Thank you.`

          })

        })

      }

    }catch(e){

      console.log("NOTIFICATION ERROR:",e)

    }


    return NextResponse.json(prescription)

  }catch(err){

    console.log("PRESCRIPTION ERROR:",err)

    return NextResponse.json(
      { error:"Failed to save prescription" },
      { status:500 }
    )

  }

}



/* GET PRESCRIPTIONS */

export async function GET(){

  try{

    const prescriptions = await prisma.prescription.findMany({

      include:{
        doctor:true,
        patient:true,
        appointment:true
      },

      orderBy:{
        createdAt:"desc"
      }

    })

    return NextResponse.json(prescriptions)

  }catch(err){

    console.log("GET PRESCRIPTIONS ERROR:",err)

    return NextResponse.json(
      { error:"Failed to fetch prescriptions" },
      { status:500 }
    )

  }

}