import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const medicine = await prisma.medicine.create({
      data:{
        name: body.name,
        company: body.company,
        price: Number(body.price),
        stock: Number(body.stock)
      }
    })

    return NextResponse.json(medicine)

  } catch (error) {

    return NextResponse.json(
      { error:"Medicine not added" },
      { status:500 }
    )

  }

}

export async function GET() {

  try {

    const medicines = await prisma.medicine.findMany({
      orderBy:{
        createdAt:"desc"
      }
    })

    return NextResponse.json(medicines)

  } catch (error) {

    return NextResponse.json(
      { error:"Failed to fetch medicines" },
      { status:500 }
    )

  }

}