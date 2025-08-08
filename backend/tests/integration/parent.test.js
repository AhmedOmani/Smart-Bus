process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-testing';

import request from "supertest";
import app from "../../src/server.js";
import { authenticateAdmin, createSupervisor, createParent, authenticateUser } from "../setup/testUtils.js";
import { clearAllTables, seedAdminUser, disconnectTestDB } from "../setup/testSetup.js";

describe("Parent Routes Integration Tests", () => {
    let server;
    let adminToken;
    let supervisorUser;
    let supervisorCredentials;
    let supervisorToken;
    let parentUser;
    let parentCredentials;
    let parentToken;
    let busId;
    let studentId;

    beforeAll(async () => {
        server = app.listen(0);
        await clearAllTables();
        await seedAdminUser();

        const adminAuth = await authenticateAdmin();
        adminToken = adminAuth.token;

        // Create supervisor and parent via admin
        const supervisor = await createSupervisor(adminToken);
        supervisorUser = supervisor.user;
        supervisorCredentials = supervisor.credentials;
        const parent = await createParent(adminToken);
        parentUser = parent.user;
        parentCredentials = parent.credentials;

        // Login as supervisor and parent
        const supLogin = await authenticateUser(supervisorCredentials.username, supervisorCredentials.password);
        supervisorToken = supLogin.token;
        const parLogin = await authenticateUser(parentCredentials.username, parentCredentials.password);
        parentToken = parLogin.token;

        // Create a bus and assign to supervisor
        const busPayload = {
            busNumber: `ParentTestBus-${Math.floor(Math.random() * 100000)}`,
            licensePlate: `PT-${Math.floor(Math.random() * 100000)}`,
            capacity: 40,
            model: "Toyota",
            year: 2023,
            driverName: "Driver X",
            driverPhone: "+968 98765432",
            driverLicenseNumber: `DL-${Math.floor(Math.random() * 100000)}`,
            supervisorId: supervisorUser.id,
            status: "ACTIVE"
        };
        const busRes = await request(app)
            .post("/api/v1/admin/buses")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(busPayload);
        busId = busRes.body.data.bus.id;

        // Create a student assigned to parent and bus
        const studentRes = await request(app)
            .post("/api/v1/admin/students")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Child One",
                nationalId: `ST${Math.floor(Math.random() * 1e12)}`,
                grade: "Grade 4",
                parentId: parentUser.id,
                busId,
                homeAddress: "Address A"
            });
        studentId = studentRes.body.data.student.id;
    });

    afterAll(async () => {
        await clearAllTables();
        await server.close();
        await disconnectTestDB();
    });

    describe("Authorization", () => {
        test("should reject without token", async () => {
            const res = await request(app).get("/api/v1/parent/dashboard");
            expect(res.status).toBe(401);
        });

        test("should forbid supervisor token on parent routes", async () => {
            const res = await request(app)
                .get("/api/v1/parent/dashboard")
                .set("Authorization", `Bearer ${supervisorToken}`);
            expect(res.status).toBe(403);
        });
    });

    describe("Parent Core Endpoints", () => {
        test("GET /parent/dashboard returns overview", async () => {
            const res = await request(app)
                .get("/api/v1/parent/dashboard")
                .set("Authorization", `Bearer ${parentToken}`);
            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty("parent");
        });

        test("GET /parent/students returns my children", async () => {
            const res = await request(app)
                .get("/api/v1/parent/students")
                .set("Authorization", `Bearer ${parentToken}`);
            expect(res.status).toBe(200);
            const parentOrStudents = res.body?.data?.students;
            const students = parentOrStudents?.students ?? [];
            expect(Array.isArray(students)).toBe(true);
            const hasChild = students.some((s) => s.id === studentId);
            expect(hasChild).toBe(true);
        });

        test("GET /parent/my-bus returns child's bus", async () => {
            const res = await request(app)
                .get("/api/v1/parent/my-bus")
                .set("Authorization", `Bearer ${parentToken}`);
            expect(res.status).toBe(200);
            expect(res.body.data.bus.id).toBe(busId);
        });
    });

    describe("Home location & Profile & FCM", () => {
        test("PUT /parent/home-location updates location", async () => {
            const res = await request(app)
                .put("/api/v1/parent/home-location")
                .set("Authorization", `Bearer ${parentToken}`)
                .send({ homeAddress: "Addr B", homeLatitude: 23.6, homeLongitude: 58.4 });
            expect(res.status).toBe(200);
            expect(res.body.data.parent.homeAddress).toBe("Addr B");
        });

        test("PUT /parent/home-location invalid input -> 400", async () => {
            const res = await request(app)
                .put("/api/v1/parent/home-location")
                .set("Authorization", `Bearer ${parentToken}`)
                .send({ homeAddress: "", homeLatitude: 999, homeLongitude: 999 });
            expect(res.status).toBe(400);
        });

        test("PUT /parent/fcm-token updates token", async () => {
            const res = await request(app)
                .put("/api/v1/parent/fcm-token")
                .set("Authorization", `Bearer ${parentToken}`)
                .send({ fcmToken: "token_123" });
            expect(res.status).toBe(200);
            expect(res.body.data.parent.fcmToken).toBe("token_123");
        });

        test("PUT /parent/fcm-token missing token -> 400", async () => {
            const res = await request(app)
                .put("/api/v1/parent/fcm-token")
                .set("Authorization", `Bearer ${parentToken}`)
                .send({});
            expect(res.status).toBe(400);
        });

        test("GET /parent/profile returns profile", async () => {
            const res = await request(app)
                .get("/api/v1/parent/profile")
                .set("Authorization", `Bearer ${parentToken}`);
            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty("parent");
        });
    });
});


