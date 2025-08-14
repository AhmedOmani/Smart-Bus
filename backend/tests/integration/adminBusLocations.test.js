process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-testing';

import request from "supertest";
import app from "../../src/server.js";
import { clearAllTables , seedAdminUser , disconnectTestDB } from "../setup/testSetup.js";
import { authenticateAdmin , createSupervisor , authenticateUser } from "../setup/testUtils.js";
import { client } from "../../src/config/db.js";

describe("Admin Buses Locations API" , () => {
    let adminToken;
    let supervisorId;
    let supervisorToken;
    let busId ;
    let lastLocationId;

    beforeAll(async () => {
        await clearAllTables();
        await seedAdminUser();

        const adminAuth = await authenticateAdmin();
        adminToken = adminAuth.token;

        const supervisor = await createSupervisor(adminToken);
        supervisorId = supervisor.user.id;

        const supervisorAuth = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    username: supervisor.credentials.username,
                    password: supervisor.credentials.password
                });
        supervisorToken = supervisorAuth.body.data.token;

        const busData = {
            busNumber: "Test Bus 1",
            licensePlate: "TEST123",
            capacity: 20,
            model: "Toyota",
            year: 2020,
            driverName: "Test Driver",
            driverPhone: "+968 12345678",
            driverLicenseNumber: "DL123456",
            supervisorId: supervisorId,
            status: "ACTIVE"
        };
        const busResponse = await request(app)
            .post("/api/v1/admin/buses")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(busData);
        busId = busResponse.body.data.bus.id;

        expect(busResponse.status).toBe(201);
        busId = busResponse.body.data.bus.id;
    });

    afterAll(async () => {
        await clearAllTables();
        await disconnectTestDB();
    });

    test("GET /admin/buses/locations returns bus with no lastLocation initially (offline)", async () => {
        const response = await request(app)
            .get("/api/v1/admin/buses/locations")
            .set("Authorization" , `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data.buses)).toBe(true);

        const bus = response.body.data.buses.find(b => b.id === busId);
        console.log(bus);
        expect(bus).toBeDefined();
        expect(bus.busNumber).toBeDefined();
        expect(bus.supervisor?.name).toBeDefined();
        expect(bus.lastLocation).toBeNull();
        expect(bus.online).toBe(false);
    });

    test("after supervisor posts location , lastLocation appears and online is true" , async () => {
        const locationResponse = await request(app)
                    .post("/api/v1/bus/location")
                    .set("Authorization" , `Bearer ${supervisorToken}`)
                    .send({latitude: 37.222 , longitude: 58.333})
        
        console.log(locationResponse.body);
        
        expect(locationResponse.status).toBe(201);
        lastLocationId = locationResponse.body.data.id;

        const response = await request(app)
            .get("/api/v1/admin/buses/locations")
            .set("Authorization" , `Bearer ${adminToken}`);
        
        expect(response.status).toBe(200);

        const bus = response.body.data.buses.find(b => b.id === busId);
        expect(bus).toBeDefined();
        expect(bus.lastLocation).toBeTruthy();
        expect(bus.lastLocation.latitude).toBe(37.222);
        expect(bus.lastLocation.longitude).toBe(58.333);
        expect(bus.online).toBe(true);
    });

    test("when last update is older thatn 60s , online is false" , async () => {
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
        await client.locationLog.update({
            where: {id: lastLocationId},
            data: { timestamp: twoMinutesAgo }
        });

        const response = await request(app)
            .get("/api/v1/admin/buses/locations")
            .set("Authorization" , `Bearer ${adminToken}`);

        expect(response.status).toBe(200);

        const bus = response.body.data.buses.find(b => b.id === busId);
        expect(bus).toBeDefined();
        expect(bus.lastLocation).toBeTruthy();
        expect(bus.lastLocation.latitude).toBe(37.222);
        expect(bus.lastLocation.longitude).toBe(58.333);
        console.log(new Date(bus.lastLocation.timestamp).getTime())
        console.log(Date.now() - 60000);
        expect(new Date(bus.lastLocation.timestamp).getTime()).toBeLessThan(Date.now() - 60000);
        expect(bus.online).toBe(false);
    });

});