import { PrismaClient } from "../../../db/generated/prisma/index.js";

const getDatabaseUrl = () => {
    const isTest = process.env.NODE_ENV === 'test';
    if (isTest) {
        return process.env.TEST_DATABASE_URL || "postgresql://postgres:12345ahmedsaber@localhost:5432/smart_bus_test";
    }
    return process.env.DATABASE_URL || "postgresql://postgres:12345ahmedsaber@localhost:5432/smart_bus_dev";
};

export const client = new PrismaClient({
    datasources: {
        db: {
            url: getDatabaseUrl()
        }
    },
    // Log only errors in test environment
    ...(process.env.NODE_ENV === 'test' && {
        log: ['error']
    })
});

export const connectToDB = async () => {
    try {
        await client.$connect();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};

export const disconnectFromDB = async () => {
    try {
        await client.$disconnect();
        console.log("Database disconnected successfully");
    } catch (error) {
        console.error("Database disconnection failed:", error);
    }
};