import { PrismaClient } from "../../../db/generated/prisma/index.js";

export const client = new PrismaClient();

export const connectToDB = async () => {
    try {
        await client.$connect();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection is failed: " , error);
        process.exit(1);
    }
}