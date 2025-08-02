#!/usr/bin/env node

/**
 * Script to set up test database
 * Run this before running tests for the first time
 */

const { execSync } = require("child_process");

const DB_NAME = "smart_bus_test";
const DB_USER = "postgres"; // Change this to your PostgreSQL username
const DB_PASSWORD = "12345ahmedsaber"; // Change this to your PostgreSQL password
const DB_HOST = "localhost";
const DB_PORT = "5432";

async function setupTestDatabase() {
    try {
        console.log("🔧 Setting up test database...");
        
        // Create test database if it doesn't exist
        console.log("📋 Creating test database...");
        try {
            execSync(`createdb -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${DB_NAME}`, {
                stdio: 'inherit'
            });
            console.log(`✅ Created database '${DB_NAME}'`);
        } catch (error) {
            console.log(`ℹ️  Database '${DB_NAME}' might already exist, continuing...`);
        }
        
        // Set test database URL
        const testDatabaseUrl = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public`;
        process.env.DATABASE_URL = testDatabaseUrl;
        
        // Run Prisma migrations on test database
        console.log("🔄 Running Prisma migrations on test database...");
        execSync("cd ../db && npx prisma migrate deploy", {
            env: { ...process.env, DATABASE_URL: testDatabaseUrl },
            stdio: 'inherit'
        });
        
        console.log("✅ Test database setup complete!");
        console.log(`📍 Test database URL: ${testDatabaseUrl}`);
        console.log("");
        console.log("🔥 Ready to run tests! Use:");
        console.log("   npm test");
        console.log("   or");
        console.log("   npm run test:watch");
        
    } catch (error) {
        console.error("❌ Failed to setup test database:", error.message);
        console.log("");
        console.log("💡 Troubleshooting:");
        console.log("1. Make sure PostgreSQL is running");
        console.log("2. Check your database credentials in this script");
        console.log("3. Ensure you have permission to create databases");
        process.exit(1);
    }
}

setupTestDatabase();