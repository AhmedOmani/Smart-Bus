process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-testing';

import request from "supertest";
import app from "../../src/server.js";
import { authenticateAdmin, createSupervisor, createParent, authenticateUser } from "../setup/testUtils.js";
import { clearAllTables, seedAdminUser, disconnectTestDB } from "../setup/testSetup.js";

describe("Admin Management Integration Tests", () => {
    let server;
    let adminToken;

    // Entities created during tests
    let supervisorUser;
    let supervisorCredentials;
    let supervisorToken;

    let parentUser;
    let parentCredentials;
    let parentToken;

    let busId;
    let studentId;

    const createBusPayload = (overrides = {}) => ({
        busNumber: `Bus-${Math.floor(Math.random() * 100000)}`,
        licensePlate: `LP-${Math.floor(Math.random() * 100000)}`,
        capacity: 30,
        model: "Toyota",
        year: 2022,
        driverName: "John Doe",
        driverPhone: "+968 12345678",
        driverLicenseNumber: `DL-${Math.floor(Math.random() * 100000)}`,
        status: "ACTIVE",
        ...overrides
    });

    beforeAll(async () => {
        server = app.listen(0);
        await clearAllTables();
        await seedAdminUser();

        const adminAuth = await authenticateAdmin();
        adminToken = adminAuth.token;

        // Create initial supervisor and parent via admin endpoints
        const supervisor = await createSupervisor(adminToken);
        supervisorUser = supervisor.user;
        supervisorCredentials = supervisor.credentials;

        const parent = await createParent(adminToken);
        parentUser = parent.user;
        parentCredentials = parent.credentials;

        // Login created users for later non-admin authorization checks and actions
        const supervisorLogin = await authenticateUser(supervisorCredentials.username, supervisorCredentials.password);
        supervisorToken = supervisorLogin.token;
        const parentLogin = await authenticateUser(parentCredentials.username, parentCredentials.password);
        parentToken = parentLogin.token;
    });

    afterAll(async () => {
        await clearAllTables();
        await server.close();
        await disconnectTestDB();
    });

    describe("Authorization & Dashboard", () => {
        test("admin dashboard should return aggregate stats", async () => {
            const res = await request(app)
                .get("/api/v1/admin/dashboard")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty("totalUsers");
            expect(res.body.data).toHaveProperty("totalStudents");
            expect(res.body.data).toHaveProperty("activeBuses");
        });

        test("non-admin should be forbidden from admin routes", async () => {
            const res = await request(app)
                .get("/api/v1/admin/users")
                .set("Authorization", `Bearer ${parentToken}`);
            expect(res.status).toBe(403);
        });
    });

    describe("User Management", () => {
        let tempUserId;

        test("should list users", async () => {
            const res = await request(app)
                .get("/api/v1/admin/users")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data.users)).toBe(true);
            expect(res.body.data.users.length).toBeGreaterThanOrEqual(3); // admin + supervisor + parent
        });

        test("should search users by role and name", async () => {
            const res = await request(app)
                .get("/api/v1/admin/users/search")
                .query({ role: "SUPERVISOR", search: supervisorUser.name })
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data.users)).toBe(true);
            const hasSupervisor = res.body.data.users.some(u => u.id === supervisorUser.id);
            expect(hasSupervisor).toBe(true);
        });

        test("should create a new user (PARENT)", async () => {
            const timestamp = `${Date.now()}${Math.floor(Math.random()*100000)}`;
            const payload = {
                name: "Salim",
                nationalId: `PAR${timestamp.toString().slice(-8)}`,
                email: `salim${timestamp}@gmail.com`,
                phone: "+968 99177800",
                role: "PARENT"
            };
            const res = await request(app)
                .post("/api/v1/admin/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(payload);
            expect(res.status).toBe(201);
            expect(res.body.data.user.role).toBe("PARENT");
            tempUserId = res.body.data.user.id;
        });

        test("should update an existing user", async () => {
            const res = await request(app)
                .put(`/api/v1/admin/users/${tempUserId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Salim Updated" });
            expect(res.status).toBe(200);
            expect(res.body.data.user.name).toBe("Salim Updated");
        });

        test("should delete a user", async () => {
            const res = await request(app)
                .delete(`/api/v1/admin/users/${tempUserId}`)
                .set("Authorization", `Bearer ${adminToken}`);
            expect([200, 204]).toContain(res.status);
        });
    });

    describe("Bus Management", () => {
        test("should create a bus (assigned to supervisor)", async () => {
            const busPayload = createBusPayload({ supervisorId: supervisorUser.id });
            const res = await request(app)
                .post("/api/v1/admin/buses")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(busPayload);
            expect(res.status).toBe(201);
            expect(res.body.data.bus.supervisorId).toBe(supervisorUser.id);
            busId = res.body.data.bus.id;
        });

        test("should list buses", async () => {
            const res = await request(app)
                .get("/api/v1/admin/buses")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data.buses)).toBe(true);
            const hasBus = res.body.data.buses.some(b => b.id === busId);
            expect(hasBus).toBe(true);
        });

        test("should update a bus (unassign supervisor)", async () => {
            const res = await request(app)
                .put(`/api/v1/admin/buses/${busId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ supervisorId: null, status: "MAINTENANCE" });
            expect(res.status).toBe(200);
            expect(res.body.data.bus.status).toBe("MAINTENANCE");
        });
    });

    describe("Student Management", () => {
        test("should create a student assigned to parent and bus", async () => {
            const payload = {
                name: "Test Student",
                nationalId: `ST${Math.floor(Math.random()*1e12)}`,
                grade: "Grade 5",
                parentId: parentUser.id,
                busId: busId,
                homeAddress: "Test Address",
                homeLatitude: 23.58,
                homeLongitude: 58.38
            };
            const res = await request(app)
                .post("/api/v1/admin/students")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(payload);
            expect(res.status).toBe(201);
            expect(res.body.data.student.parentId).toBe(parentUser.id);
            studentId = res.body.data.student.id;
        });

        test("should list students", async () => {
            const res = await request(app)
                .get("/api/v1/admin/students")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data.students)).toBe(true);
            const hasStudent = res.body.data.students.some(s => s.id === studentId);
            expect(hasStudent).toBe(true);
        });

        test("should update a student (clear bus assignment)", async () => {
            const res = await request(app)
                .put(`/api/v1/admin/students/${studentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ grade: "Grade 6", busId: null });
            expect(res.status).toBe(200);
            expect(res.body.data.student.grade).toBe("Grade 6");
        });
    });

    describe("Admin: Absences & Permissions Listing", () => {
        let absenceId;
        let permissionId;

        const futureISO = (days) => {
            const d = new Date();
            d.setDate(d.getDate() + days);
            return d.toISOString();
        };

        test("prepare: parent reports an absence", async () => {
            const res = await request(app)
                .post("/api/v1/absence/report")
                .set("Authorization", `Bearer ${parentToken}`)
                .send({
                    studentId,
                    startDate: futureISO(2),
                    endDate: futureISO(3),
                    type: "SICK",
                    reason: "Fever"
                });
            expect(res.status).toBe(201);
            absenceId = res.body.data.id;
        });

        test("prepare: parent requests a permission", async () => {
            const res = await request(app)
                .post("/api/v1/permissions/report")
                .set("Authorization", `Bearer ${parentToken}`)
                .send({
                    studentId,
                    type: "EXIT",
                    date: futureISO(4),
                    reason: "Pickup by parent"
                });
            expect(res.status).toBe(201);
            permissionId = res.body.data.id;
        });

        test("admin lists all absences without filters", async () => {
            const res = await request(app)
                .get("/api/v1/admin/absences")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data.absences)).toBe(true);
            expect(res.body.data.absences.length).toBeGreaterThan(0);
        });

        test("admin lists absences with filters (status/type/date range)", async () => {
            const res = await request(app)
                .get("/api/v1/admin/absences")
                .query({ status: "PENDING", type: "SICK", startDate: futureISO(1), endDate: futureISO(10), studentId, busId })
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data.absences)).toBe(true);
        });

        test("admin lists all permissions without filters", async () => {
            const res = await request(app)
                .get("/api/v1/admin/permissions")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data.permissions)).toBe(true);
            expect(res.body.data.permissions.length).toBeGreaterThan(0);
        });

        test("admin lists permissions with filters (status/type/date range)", async () => {
            const res = await request(app)
                .get("/api/v1/admin/permissions")
                .query({ status: "PENDING", type: "EXIT", startDate: futureISO(1), endDate: futureISO(10), studentId, busId })
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data.permissions)).toBe(true);
        });
    });

    describe("Cleanup: Delete student and bus", () => {
        test("should delete a student", async () => {
            const res = await request(app)
                .delete(`/api/v1/admin/students/${studentId}`)
                .set("Authorization", `Bearer ${adminToken}`);
            expect([200, 204]).toContain(res.status);
        });

        test("should delete a bus", async () => {
            const res = await request(app)
                .delete(`/api/v1/admin/buses/${busId}`)
                .set("Authorization", `Bearer ${adminToken}`);
            expect([200, 204]).toContain(res.status);
        });
    });
});


