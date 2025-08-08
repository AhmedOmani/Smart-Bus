process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-testing';
import request from "supertest";
import app from "../../src/server.js";
import { authenticateAdmin, createSupervisor, createParent, authenticateUser } from "../setup/testUtils.js";
import { clearAllTables, seedAdminUser, disconnectTestDB } from "../setup/testSetup.js";

describe("Authentication Tests", () => {
    let adminToken;
    let adminUser;

    beforeAll(async () => {
        await clearAllTables();
        await seedAdminUser();
        // Authenticate admin for user creation tests
        const adminAuth = await authenticateAdmin();
        adminToken = adminAuth.token;
        adminUser = adminAuth.user;
    });

    afterAll(async () => {
        await clearAllTables();
        await disconnectTestDB();
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
            // Ensure fresh state and admin session for this block
            await clearAllTables();
            await seedAdminUser();
            const freshAdmin = await authenticateAdmin();
            adminToken = freshAdmin.token;

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

        test("should reject subsequent requests with blacklisted token", async () => {
            // token was logged out in previous test
            const meResponse = await request(app)
                .get("/api/v1/auth/me")
                .set("Authorization", `Bearer ${validToken}`);
            expect(meResponse.status).toBe(401);
        });
    });

    describe("Change Password", () => {
        let token;
        const username = "abeer";
        const oldPassword = "admin123";
        const newPassword = "New_Pass123"; // meets schema (>=8, mixed case + digit)

        beforeAll(async () => {
            await clearAllTables();
            await seedAdminUser();
            const auth = await authenticateAdmin();
            token = auth.token;
        });

        test("should reject with invalid current password", async () => {
            const res = await request(app)
                .post("/api/v1/auth/change-password")
                .set("Authorization", `Bearer ${token}`)
                .send({ currentPassword: "WrongPass123", newPassword });
            expect(res.status).toBe(401);
        });

        test("should change password and allow login with new password; old fails", async () => {
            // Change
            const changeRes = await request(app)
                .post("/api/v1/auth/change-password")
                .set("Authorization", `Bearer ${token}`)
                .send({ currentPassword: oldPassword, newPassword });
            expect(changeRes.status).toBe(200);

            // Old password should fail
            const oldLogin = await request(app)
                .post("/api/v1/auth/login")
                .send({ username, password: oldPassword });
            expect(oldLogin.status).toBe(401);

            // New password should succeed
            const newLogin = await request(app)
                .post("/api/v1/auth/login")
                .send({ username, password: newPassword });
            expect(newLogin.status).toBe(200);
            expect(newLogin.body.data).toHaveProperty("token");
        });
    });
}); 