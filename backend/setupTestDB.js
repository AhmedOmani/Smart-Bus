import { PrismaClient } from "../db/generated/prisma/index.js";
import bcrypt from "bcrypt";

// Create Prisma client for test database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || "postgresql://postgres:12345ahmedsaber@localhost:5432/smart_bus_test"
    }
  }
});

async function setupTestDatabase() {
  console.log("🚀 Setting up test database...");
  
  try {
    // Check if admin user exists
    let adminUser = await prisma.user.findUnique({
      where: { email: "abeer@test.com" }
    });

    if (adminUser) {
      console.log("✅ Admin user already exists!");
      console.log("📋 Admin user details:");
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Username: ${adminUser.username}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   ID: ${adminUser.id}`);
      console.log("🔑 Login credentials:");
      console.log("   Username: abeer");
      console.log("   Password: admin123");
    } else {
      console.log("📝 Creating admin user...");
      
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      adminUser = await prisma.user.create({
        data: {
          name: "Abeer",
          nationalId: "1234567890",
          email: "abeer@test.com",
          role: "ADMIN",
          username: "abeer",
          password: hashedPassword,
          phone: "991778333",
          status: "ACTIVE",
        },
      });

      console.log("✅ Admin user created successfully!");
      console.log("📋 Admin user details:");
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Username: ${adminUser.username}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   ID: ${adminUser.id}`);
      console.log("🔑 Login credentials:");
      console.log("   Username: abeer");
      console.log("   Password: admin123");
    }
    
  } catch (error) {
    console.error("❌ Error setting up test database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupTestDatabase(); 