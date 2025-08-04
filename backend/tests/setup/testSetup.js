import { client } from "../../src/config/db.js";
import bcrypt from "bcrypt";

// Global test setup
beforeAll(async () => {
    console.log("Setting up test environment...");
    try {
        // Clear all data and seed admin user
        await clearAllTables();
        await seedAdminUser();
        console.log("Test environment setup complete");
    } catch (error) {
        console.error("Test environment setup failed:", error);
        throw error;
    }
}, 30000);

// Clean up after each test
afterEach(async () => {
    console.log("Cleaning up after test...");
    try {
        await clearDataButKeepUsers();
        console.log("Test cleanup completed");
    } catch (error) {
        console.error("Test cleanup failed:", error);
    }
}, 10000);

// Global cleanup
afterAll(async () => {
    console.log("Cleaning up test environment...");
    try {
        await clearAllTables();
        await client.$disconnect();
        console.log("Test environment cleanup complete");
    } catch (error) {
        console.error("Test environment cleanup failed:", error);
    }
}, 30000);

export const clearAllTables = async () => {
    console.log("Clearing all tables...");
    try {
        // Clear tables in order to respect foreign key constraints
        if (client && client.message) await client.message.deleteMany().catch(() => {});
        if (client && client.trip) await client.trip.deleteMany().catch(() => {});
        if (client && client.absence) await client.absence.deleteMany().catch(() => {});
        if (client && client.permission) await client.permission.deleteMany().catch(() => {});
        if (client && client.locationLog) await client.locationLog.deleteMany().catch(() => {});
        if (client && client.student) await client.student.deleteMany().catch(() => {});
        if (client && client.bus) await client.bus.deleteMany().catch(() => {});
        if (client && client.parent) await client.parent.deleteMany().catch(() => {});
        if (client && client.supervisor) await client.supervisor.deleteMany().catch(() => {});
        if (client && client.blacklistedToken) await client.blacklistedToken.deleteMany().catch(() => {});
        if (client && client.credential) await client.credential.deleteMany().catch(() => {});
        if (client && client.user) await client.user.deleteMany().catch(() => {});
        console.log("All tables cleared successfully");
    } catch (error) {
        console.error("Error clearing tables:", error);
    }
};

export const clearDataButKeepUsers = async () => {
    console.log("Clearing data but keeping users...");
    try {
        // Clear only data tables, preserve users and their relationships
        if (client && client.message) await client.message.deleteMany().catch(() => {});
        if (client && client.trip) await client.trip.deleteMany().catch(() => {});
        if (client && client.absence) await client.absence.deleteMany().catch(() => {});
        if (client && client.permission) await client.permission.deleteMany().catch(() => {});
        if (client && client.locationLog) await client.locationLog.deleteMany().catch(() => {});
        // Keep students, buses, users, supervisors, and parents intact
        if (client && client.blacklistedToken) await client.blacklistedToken.deleteMany().catch(() => {});
        if (client && client.credential) await client.credential.deleteMany().catch(() => {});
        console.log("Data cleared, users, buses, and students preserved");
    } catch (error) {
        console.error("Error clearing data:", error);
    }
};

export const seedAdminUser = async () => {
    console.log("Seeding admin user...");
    try {
        if (!client || !client.user) {
            throw new Error("Database client not available");
        }

        const existingAdmin = await client.user.findUnique({
            where: { username: "abeer" }
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await client.user.create({
                data: {
                    nationalId: "ADMIN123456789",
                    name: "Admin User",
                    email: "alahd@gmail.com",
                    phone: "+968 99177838",
                    role: "ADMIN",
                    username: "abeer",
                    password: hashedPassword,
                    status: "ACTIVE"
                }
            });
            console.log("Admin user created successfully");
        } else {
            console.log("Admin user already exists");
        }
    } catch (error) {
        console.error("Error seeding admin user:", error);
        throw error;
    }
}; 