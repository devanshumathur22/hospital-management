import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

try{

const doctors = await prisma.doctor.count()

const patients = await prisma.patient.count()

const appointments = await prisma.appointment.count()



/* TODAY APPOINTMENTS */

const today = new Date()

const start = new Date(
today.getFullYear(),
today.getMonth(),
today.getDate()
)

const end = new Date(
today.getFullYear(),
today.getMonth(),
today.getDate() + 1
)

const todayAppointments = await prisma.appointment.count({

where:{
date:{
gte:start,
lt:end
}
}

})



return NextResponse.json({

doctors,
patients,
appointments,
today: todayAppointments

})

}catch(err){

console.log("STATS ERROR:",err)

return NextResponse.json(
{ error:"Failed to fetch stats" },
{ status:500 }
)

}

}