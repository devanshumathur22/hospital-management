import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/* ============================= */
/* HELPER */
/* ============================= */

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}

/* ============================= */
/* GET APPOINTMENTS */
/* ============================= */

export async function GET(req: Request) {
  try {
    const user: any = await getUser();
    if (!user) return NextResponse.json([]);

    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    const status = type === "history" ? "completed" : "pending";

    let appointments: any[] = [];

    /* ===================== */
    /* PATIENT */
    /* ===================== */

    if (user.role === "patient") {
      appointments = await prisma.appointment.findMany({
        where: {
          patientId: user.id,
          status
          // ❌ doctorId filter hata diya (unnecessary)
        },
        include: {
          doctor: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: [
          { date: "desc" },
          { createdAt: "desc" }
        ],
      });
    }

    /* ===================== */
    /* DOCTOR */
    /* ===================== */

    else if (user.role === "doctor") {
      appointments = await prisma.appointment.findMany({
        where: {
          doctorId: user.id,
          status,
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: [
          { date: "desc" },
          { createdAt: "desc" }
        ],
      });
    }

    /* ===================== */
    /* NURSE */
    /* ===================== */

  else if (user.role === "nurse") {
  const nurse = await prisma.nurse.findUnique({
    where: { id: user.id },
    include: { doctor: true },
  });

  if (!nurse?.doctor?.id) return NextResponse.json([]);

  appointments = await prisma.appointment.findMany({
    where: {
      doctorId: nurse.doctor.id,
      status,
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      doctor: {   // 🔥 ADD THIS (missing tha)
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: [
      { date: "desc" },
      { createdAt: "desc" }
    ],
  });
}

    /* ===================== */
    /* ADMIN / RECEPTIONIST */
    /* ===================== */

    else if (user.role === "admin" || user.role === "receptionist") {
      appointments = await prisma.appointment.findMany({
        where: {
          status
        },
        include: {
          doctor: {
            select: {
              id: true,
              name: true
            }
          },
          patient: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: [
          { date: "desc" },
          { createdAt: "desc" }
        ],
      });
    }

    else {
      return NextResponse.json({ error: "Unauthorized role" }, { status: 403 });
    }

    return NextResponse.json(appointments);

  } catch (err: any) {
    console.error("GET Appointments Error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

/* ============================= */
/* CREATE APPOINTMENT */
/* ============================= */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user: any = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const selectedDate = new Date(body.date);

    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const existing = await prisma.appointment.findFirst({
      where: {
        patientId: user.id,
        doctorId: body.doctorId,
        date: selectedDate,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already booked this doctor today" },
        { status: 400 }
      );
    }

    const slotTaken = await prisma.appointment.findFirst({
      where: {
        doctorId: body.doctorId,
        date: selectedDate,
        time: body.time,
      },
    });

    if (slotTaken) {
      return NextResponse.json(
        { error: "Slot already booked" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        doctorId: body.doctorId,
        patientId: user.id,
        date: selectedDate,
        time: body.time,
        status: "pending",
      },
    });

    return NextResponse.json(appointment);

  } catch (err: any) {
    console.error("CREATE Appointment Error:", err);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

/* ============================= */
/* DELETE APPOINTMENT */
/* ============================= */

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    if (!body?.id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.appointment.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("DELETE Appointment Error:", err);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}