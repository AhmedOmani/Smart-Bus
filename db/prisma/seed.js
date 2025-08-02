import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";

// Only load .env if DATABASE_URL isn't already set (e.g., test will override)
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
}

const client = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const generateAdmin = async () => {
  const adminPassword = "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await client.user.upsert({
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

  console.log("Admin user created successfully");
};

generateAdmin()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => client.$disconnect());
