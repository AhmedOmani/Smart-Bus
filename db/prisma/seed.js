import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcrypt";

const client = new PrismaClient();

const genarateAdmin = async () => {
    const adminPassword = "admin123";
    const hashedPassword = await bcrypt.hash(adminPassword , 10);
   
    const admin = await client.user.upsert({
        where: { email: "alahd@gmail.com"},
        update: {},
        create: {
            name: "Abeer" ,
            nationalId: "1234567890",
            email: "alahd@gmail.com",
            role: "ADMIN",
            username: "abeer",
            password: hashedPassword,
            phone: "991778333",
            status: "ACTIVE",
        }
    });

    console.log("Admin user created successfully");
    
}

genarateAdmin().catch(console.error).finally(() => client.$disconnect());