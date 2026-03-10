import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {

  try {

    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      )
    }

    await prisma.patient.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: "Patient deleted successfully" },
      { status: 200 }
    )

  } catch (error) {

    return NextResponse.json(
      { error: "Failed to delete patient" },
      { status: 500 }
    )

  }

}