import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req:Request){

const body = await req.json()

const today = new Date()

const count = await prisma.queue.count({
where:{
createdAt:{
gte:new Date(today.setHours(0,0,0,0))
}
}
})

const token = count + 1

const queue = await prisma.queue.create({
data:{
patientId: body.patientId,
doctorId: body.doctorId,
token
}
})

return NextResponse.json(queue)

}