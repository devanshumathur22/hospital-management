import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrate() {
  console.log("🚀 Migration started...");

  // 🔹 DOCTOR
  const doctors = await prisma.doctor.findMany();
  for (const doc of doctors) {
    const user = await prisma.user.create({
      data: {
        email: doc.email,
        password: doc.password,
        role: "doctor",
      },
    });

    await prisma.doctor.update({
      where: { id: doc.id },
      data: { userId: user.id },
    });
  }
  console.log("✅ Doctors migrated");

  // 🔹 PATIENT
  const patients = await prisma.patient.findMany();
  for (const p of patients) {
    const user = await prisma.user.create({
      data: {
        email: p.email,
        password: p.password,
        role: "patient",
      },
    });

    await prisma.patient.update({
      where: { id: p.id },
      data: { userId: user.id },
    });
  }
  console.log("✅ Patients migrated");

  // 🔹 ADMIN
  const admins = await prisma.admin.findMany();
  for (const a of admins) {
    const user = await prisma.user.create({
      data: {
        email: a.email,
        password: a.password,
        role: "admin",
      },
    });

    await prisma.admin.update({
      where: { id: a.id },
      data: { userId: user.id },
    });
  }
  console.log("✅ Admins migrated");

  // 🔹 NURSE
  const nurses = await prisma.nurse.findMany();
  for (const n of nurses) {
    const user = await prisma.user.create({
      data: {
        email: n.email,
        password: n.password,
        role: "nurse",
      },
    });

    await prisma.nurse.update({
      where: { id: n.id },
      data: { userId: user.id },
    });
  }
  console.log("✅ Nurses migrated");

  // 🔹 RECEPTIONIST
  const receptionists = await prisma.receptionist.findMany();
  for (const r of receptionists) {
    const user = await prisma.user.create({
      data: {
        email: r.email,
        password: r.password,
        role: "receptionist",
      },
    });

    await prisma.receptionist.update({
      where: { id: r.id },
      data: { userId: user.id },
    });
  }
  console.log("✅ Receptionists migrated");

  console.log("🎉 Migration complete");
}

migrate()
  .catch((e) => {
    console.error("❌ Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });