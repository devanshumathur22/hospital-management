import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const doctors = await prisma.doctor.count();
  const patients = await prisma.patient.count();
  const appointments = await prisma.appointment.count();

  return NextResponse.json({
    doctors,
    patients,
    appointments,
  });
}