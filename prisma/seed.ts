import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

function token() {
  return crypto.randomBytes(24).toString("hex");
}

async function main() {
  console.log("Seeding demo data…");

  const adminPassword = await bcrypt.hash("Admin@12345", 12);
  await prisma.user.upsert({
    where: { email: "admin@nfcring.demo" },
    update: {},
    create: {
      email: "admin@nfcring.demo",
      passwordHash: adminPassword,
      role: "ADMIN",
      profile: {
        create: {
          name: "Platform Admin",
          designation: "Administrator",
          mode: "BUSINESS",
        },
      },
      ring: { create: { token: token(), status: "ACTIVE" } },
    },
  });

  const userPassword = await bcrypt.hash("Demo@12345", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "harish@nfcring.demo" },
    update: {},
    create: {
      email: "harish@nfcring.demo",
      passwordHash: userPassword,
      role: "USER",
      profile: {
        create: {
          name: "Harishkumar B",
          company: "ConstructAI Labs",
          designation: "Software Developer",
          bio: "Building BIM-integrated construction management platforms. Passionate about full-stack engineering, 4D visualization, and applied AI.",
          shortBio: "BIM • AI • Full Stack",
          phone: "+91 98765 43210",
          email: "harish@example.com",
          website: "https://harishkumar.dev",
          linkedin: "https://linkedin.com/in/harishkumarb",
          whatsapp: "+919876543210",
          portfolioUrl: "https://harishkumar.dev/work",
          services: "Full-stack development, BIM visualization, AI-driven delay prediction",
          mode: "BUSINESS",
        },
      },
      ring: { create: { token: token(), status: "ACTIVE" } },
    },
    include: { profile: true },
  });

  const profile = await prisma.profile.findUniqueOrThrow({ where: { userId: demoUser.id } });

  // Clean up any existing demo connections, leads, and analytics to make seed idempotent
  await prisma.connection.deleteMany({ where: { userAId: demoUser.id } });
  await prisma.lead.deleteMany({ where: { profileId: profile.id } });
  await prisma.analyticsEvent.deleteMany({ where: { profileId: profile.id } });

  // Demo connections
  await prisma.connection.createMany({
    data: [
      { userAId: demoUser.id, name: "Priya Sharma", email: "priya@example.com", company: "BuildTech Solutions", message: "Great meeting you at the expo!" },
      { userAId: demoUser.id, name: "Arjun Mehta", email: "arjun@example.com", company: "Skyline Constructions", message: "Would love to explore a partnership." },
    ],
  });

  // Demo leads
  await prisma.lead.createMany({
    data: [
      { profileId: profile.id, name: "Sanjay Rao", email: "sanjay@example.com", phone: "+919812345678", company: "Rao Infrastructure", message: "Interested in a BIM pilot for our next project.", status: "NEW" },
      { profileId: profile.id, name: "Divya Nair", email: "divya@example.com", company: "GreenBuild Co", message: "Can we schedule a demo?", status: "CONTACTED" },
      { profileId: profile.id, name: "Karthik Iyer", email: "karthik@example.com", company: "Iyer & Sons", message: "Following up on our call.", status: "QUALIFIED" },
    ],
  });

  // Demo analytics events across the last 7 days
  const eventTypes = ["TAP", "VIEW", "QR", "SAVE", "CONNECT", "LEAD"] as const;
  const sources = ["NFC", "QR", "DIRECT"] as const;
  const events = [];
  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(Math.floor(Math.random() * 24));
    events.push({
      profileId: profile.id,
      eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      createdAt,
    });
  }
  await prisma.analyticsEvent.createMany({ data: events });

  console.log("Seed complete.");
  console.log("Admin login: admin@nfcring.demo / Admin@12345");
  console.log("Demo user login: harish@nfcring.demo / Demo@12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
