import { PrismaClient } from "../../../db/generated/prisma/index.js";
import bcrypt from "bcrypt";

// Force Prisma to use TEST_DATABASE_URL
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

console.log("Using DB URL for tests:", process.env.TEST_DATABASE_URL);

// Helper: Clear all tables
const clearAllTables = async () => {
  await prisma.locationLog.deleteMany();
  await prisma.supervisor.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.blackListedToken.deleteMany();
  await prisma.credential.deleteMany();
  await prisma.user.deleteMany();
};

// Helper: Seed admin user for tests
const seedAdminUser = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "alahd@gmail.com" },
    update: {},
    create: {
      name: "Abeer",
      nationalId: "1234567890",
      email: "alahd@gmail.com",
      role: "ADMIN",
      username: "abeer",
      password: hashedPassword,
      phone: "991778333",
      status: "ACTIVE",
    },
  });

  console.log("Seeded admin user for tests: username=abeer / password=admin123");
};

beforeAll(async () => {
  // Clean database and seed admin before running any tests
  await clearAllTables();
  await seedAdminUser();
});

afterEach(async () => {
  // Clear only logs between tests to keep admin user
  await prisma.locationLog.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
