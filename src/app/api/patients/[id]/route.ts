import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    await prisma.patient.delete({
      where: {
        id: id
      }
    });

    return NextResponse.json(
      { message: "Patient deleted successfully" },
      { status: 200 }
    );

  } catch (error) {

    return NextResponse.json(
      { error: "Failed to delete patient" },
      { status: 500 }
    );

  }

}