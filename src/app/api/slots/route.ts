import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const slots = await prisma.slot.findMany({
include:{
doctor:true
}
})

return NextResponse.json(slots)

}