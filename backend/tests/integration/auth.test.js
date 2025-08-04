import request from "supertest";
import app from "../../src/server.js";
import { authenticateAdmin, createSupervisor, createParent, authenticateUser } from "../setup/testUtils.js";

describe("Authentication Tests", () => {
    let adminToken;
    let adminUser;

    beforeAll(async () => {
        // Authenticate admin for user creation tests
        const adminAuth = await authenticateAdmin();
        adminToken = adminAuth.token;
        adminUser = adminAuth.user;
    });

    describe("Admin Authentication", () => {
        test("should authenticate admin with valid credentials", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    username: "abeer",
                    password: "admin123"
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty("token");
            expect(response.body.data).toHaveProperty("user");
            expect(response.body.data.user.role).toBe("ADMIN");
        });

        test("should reject admin login with invalid credentials", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    username: "abeer",
                    password: "wrongpassword"
                });

            expect(response.status).toBe(401);
        });

        test("should reject login with non-existent user", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    username: "nonexistent",
                    password: "anypassword"
                });

            expect(response.status).toBe(401);
        });
    });

    describe("User Creation by Admin", () => {
        test("should create supervisor user", async () => {
            const timestamp = Date.now();
            const supervisorData = {
                name: "Test Supervisor", // Valid name with only letters and spaces
                nationalId: `SUP${timestamp.toString().slice(-8)}`, // 8-12 characters
                email: `supervisor${timestamp}@test.com`, // Unique email
                phone: "+968 99177848", // Valid phone format
                role: "SUPERVISOR"
            };

            const response = await request(app)
                .post("/api/v1/admin/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(supervisorData);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty("user");
            expect(response.body.data).toHaveProperty("credentials");
            expect(response.body.data.user.role).toBe("SUPERVISOR");
        });

        test("should create parent user", async () => {
            const timestamp = Date.now();
            const parentData = {
                name: "Test Parent", // Valid name with only letters and spaces
                nationalId: `PAR${timestamp.toString().slice(-8)}`, // 8-12 characters
                email: `parent${timestamp}@test.com`, // Unique email
                phone: "+968 99177838", // Valid phone format
                role: "PARENT"
            };

            const response = await request(app)
                .post("/api/v1/admin/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(parentData);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty("user");
            expect(response.body.data).toHaveProperty("credentials");
            expect(response.body.data.user.role).toBe("PARENT");
        });

        test("should reject user creation without admin token", async () => {
            const timestamp = Date.now();
            const userData = {
                name: "Test User",
                nationalId: `USR${timestamp.toString().slice(-8)}`,
                email: `user${timestamp}@test.com`,
                phone: "+968 99177838",
                role: "PARENT"
            };

            const response = await request(app)
                .post("/api/v1/admin/users")
                .send(userData);

            expect(response.status).toBe(401);
        });

        test("should reject user creation with duplicate email", async () => {
            // First, create a user with a specific email
            const timestamp1 = Date.now();
            const firstUserData = {
                name: "First User",
                nationalId: `FIR${timestamp1.toString().slice(-8)}`,
                email: "duplicate@test.com", // Specific email for testing
                phone: "+968 99177839",
                role: "PARENT"
            };

            const firstResponse = await request(app)
                .post("/api/v1/admin/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(firstUserData);

            expect(firstResponse.status).toBe(201);

            // Now try to create another user with the same email
            const timestamp2 = Date.now();
            const duplicateUserData = {
                name: "Duplicate User",
                nationalId: `DUP${timestamp2.toString().slice(-8)}`,
                email: "duplicate@test.com", // Same email as first user
                phone: "+968 99177840",
                role: "PARENT"
            };

            const response = await request(app)
                .post("/api/v1/admin/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(duplicateUserData);

            expect(response.status).toBe(400);
        });
    });

    describe("User Authentication", () => {
        let supervisorCredentials;
        let parentCredentials;

        beforeAll(async () => {
            // Create users for authentication tests with unique emails
            const supervisor = await createSupervisor(adminToken);
            const parent = await createParent(adminToken);
            
            supervisorCredentials = supervisor.credentials;
            parentCredentials = parent.credentials;
        });

        test("should authenticate supervisor with generated credentials", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    username: supervisorCredentials.username,
                    password: supervisorCredentials.password
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty("token");
            expect(response.body.data.user.role).toBe("SUPERVISOR");
        });

        test("should authenticate parent with generated credentials", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    username: parentCredentials.username,
                    password: parentCredentials.password
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty("token");
            expect(response.body.data.user.role).toBe("PARENT");
        });

        test("should reject authentication with wrong password", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    username: supervisorCredentials.username,
                    password: "wrongpassword"
                });

            expect(response.status).toBe(401);
        });
    });

    describe("Logout", () => {
        let validToken;

        beforeAll(async () => {
            const adminAuth = await authenticateAdmin();
            validToken = adminAuth.token;
        });

        test("should logout successfully", async () => {
            const response = await request(app)
                .post("/api/v1/auth/logout")
                .set("Authorization", `Bearer ${validToken}`);

            expect(response.status).toBe(200);
        });

        test("should reject logout without token", async () => {
            const response = await request(app)
                .post("/api/v1/auth/logout");

            expect(response.status).toBe(401);
        });
    });
}); 