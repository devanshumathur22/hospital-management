import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "1",
      patient: { name: "Rahul Sharma" },
      ward: { name: "ICU" },
      bedId: "B12",
    },
    {
      id: "2",
      patient: { name: "Baby Aryan" },
      ward: { name: "NICU" },
      bedId: "N5",
    },
  ]);
}