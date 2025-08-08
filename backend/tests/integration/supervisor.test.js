process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-testing';

import request from "supertest";
import app from "../../src/server.js";
import { authenticateAdmin, createSupervisor, createParent, authenticateUser } from "../setup/testUtils.js";
import { clearAllTables, seedAdminUser, disconnectTestDB } from "../setup/testSetup.js";

describe("Supervisor Routes Integration Tests", () => {
    let server;
    let adminToken;
    let supervisorUser;
    let supervisorCredentials;
    let supervisorToken;
    let parentUser;
    let parentCredentials;
    let parentToken;
    let busId;

    beforeAll(async () => {
        server = app.listen(0);
        await clearAllTables();
        await seedAdminUser();

        const adminAuth = await authenticateAdmin();
        adminToken = adminAuth.token;

        // Create entities
        const supervisor = await createSupervisor(adminToken);
        supervisorUser = supervisor.user;
        supervisorCredentials = supervisor.credentials;
        const parent = await createParent(adminToken);
        parentUser = parent.user;
        parentCredentials = parent.credentials;

        // Login
        const supLogin = await authenticateUser(supervisorCredentials.username, supervisorCredentials.password);
        supervisorToken = supLogin.token;
        const parLogin = await authenticateUser(parentCredentials.username, parentCredentials.password);
        parentToken = parLogin.token;

        // Create bus assigned to supervisor
        const busPayload = {
            busNumber: `SupTestBus-${Math.floor(Math.random() * 100000)}`,
            licensePlate: `STB-${Math.floor(Math.random() * 100000)}`,
            capacity: 35,
            model: "Mercedes",
            year: 2021,
            driverName: "Driver Y",
            driverPhone: "+968 12312312",
            driverLicenseNumber: `DL-${Math.floor(Math.random() * 100000)}`,
            supervisorId: supervisorUser.id,
            status: "ACTIVE"
        };
        const busRes = await request(app)
            .post("/api/v1/admin/buses")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(busPayload);
        busId = busRes.body.data.bus.id;
    });

    afterAll(async () => {
        await clearAllTables();
        await server.close();
        await disconnectTestDB();
    });

    describe("Authorization", () => {
        test("should reject without token", async () => {
            const res = await request(app).get("/api/v1/supervisor/profile");
            expect(res.status).toBe(401);
        });

        test("should forbid parent token on supervisor routes", async () => {
            const res = await request(app)
                .get("/api/v1/supervisor/profile")
                .set("Authorization", `Bearer ${parentToken}`);
            expect([403, 404]).toContain(res.status);
        });
    });

    describe("Supervisor Core Endpoints", () => {
        test("GET /supervisor/my-bus returns assigned bus", async () => {
            const res = await request(app)
                .get("/api/v1/supervisor/my-bus")
                .set("Authorization", `Bearer ${supervisorToken}`);
            expect(res.status).toBe(200);
            expect(res.body.data.bus.id).toBe(busId);
        });

        test("PUT /supervisor/home-location updates location", async () => {
            const res = await request(app)
                .put("/api/v1/supervisor/home-location")
                .set("Authorization", `Bearer ${supervisorToken}`)
                .send({ homeAddress: "Sup Home", homeLatitude: 23.59, homeLongitude: 58.39 });
            expect(res.status).toBe(200);
            expect(res.body.data.supervisor.homeAddress).toBe("Sup Home");
        });

        test("PUT /supervisor/home-location invalid input -> 400", async () => {
            const res = await request(app)
                .put("/api/v1/supervisor/home-location")
                .set("Authorization", `Bearer ${supervisorToken}`)
                .send({ homeAddress: "", homeLatitude: 999, homeLongitude: 999 });
            expect(res.status).toBe(400);
        });

        test("GET /supervisor/profile returns profile", async () => {
            const res = await request(app)
                .get("/api/v1/supervisor/profile")
                .set("Authorization", `Bearer ${supervisorToken}`);
            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty("supervisor");
        });
    });
});


