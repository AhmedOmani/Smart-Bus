import { PrismaClient } from "../db/generated/prisma/index.js";

// Create Prisma client for test database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || "postgresql://postgres:12345ahmedsaber@localhost:5432/smart_bus_test"
    }
  }
});

async function checkTestDatabase() {
  console.log("🔍 Checking test database...");
  
  try {
    // Check all users
    const users = await prisma.user.findMany();
    console.log(`📊 Found ${users.length} users:`);
    
    users.forEach(user => {
      console.log(`   - ${user.username} (${user.email}) - ${user.role}`);
    });

    // Check if admin exists
    const adminUser = await prisma.user.findUnique({
      where: { email: "abeer@test.com" }
    });

    if (adminUser) {
      console.log("\n✅ Admin user found!");
      console.log("🔑 Login credentials:");
      console.log("   Username: abeer");
      console.log("   Password: admin123");
      console.log("   Role:", adminUser.role);
      console.log("   ID:", adminUser.id);
    } else {
      console.log("\n❌ Admin user not found!");
    }
    
  } catch (error) {
    console.error("❌ Error checking test database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkTestDatabase(); 