import request from "supertest";
import app from "../../src/server.js";
import { authenticateAdmin, createSupervisor, createParent } from "../setup/testUtils.js";

describe("Home Location Tests", () => {
    let adminToken;
    let supervisorToken;
    let parentToken;

    beforeAll(async () => {
        // Authenticate admin and create users
        const adminAuth = await authenticateAdmin();
        adminToken = adminAuth.token;

        const supervisor = await createSupervisor(adminToken);
        const parent = await createParent(adminToken);

        // Authenticate supervisor and parent
        const supervisorLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({
                username: supervisor.credentials.username,
                password: supervisor.credentials.password
            });
        supervisorToken = supervisorLogin.body.data.token;

        const parentLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({
                username: parent.credentials.username,
                password: parent.credentials.password
            });
        parentToken = parentLogin.body.data.token;
    });

    describe("Supervisor Home Location", () => {
        test("should set supervisor home location", async () => {
            const homeLocationData = {
                homeAddress: "123 Supervisor Street, Muscat, Oman",
                homeLatitude: 23.5880,
                homeLongitude: 58.3829
            };

            const response = await request(app)
                .put("/api/v1/supervisor/home-location")
                .set("Authorization", `Bearer ${supervisorToken}`)
                .send(homeLocationData);

            expect(response.status).toBe(200);
            expect(response.body.data.supervisor).toHaveProperty("homeAddress");
            expect(response.body.data.supervisor).toHaveProperty("homeLatitude");
            expect(response.body.data.supervisor).toHaveProperty("homeLongitude");
            expect(response.body.data.supervisor.homeAddress).toBe("123 Supervisor Street, Muscat, Oman");
            expect(response.body.data.supervisor.homeLatitude).toBe(23.588);
            expect(response.body.data.supervisor.homeLongitude).toBe(58.3829);
        });

        test("should update supervisor home location", async () => {
            const updatedHomeLocationData = {
                homeAddress: "456 Updated Supervisor Street, Muscat, Oman",
                homeLatitude: 23.6000,
                homeLongitude: 58.4000
            };

            const response = await request(app)
                .put("/api/v1/supervisor/home-location")
                .set("Authorization", `Bearer ${supervisorToken}`)
                .send(updatedHomeLocationData);

            expect(response.status).toBe(200);
            expect(response.body.data.supervisor.homeAddress).toBe("456 Updated Supervisor Street, Muscat, Oman");
            expect(response.body.data.supervisor.homeLatitude).toBe(23.6);
            expect(response.body.data.supervisor.homeLongitude).toBe(58.4);
        });

        test("should reject supervisor home location without authentication", async () => {
            const homeLocationData = {
                homeAddress: "123 Supervisor Street, Muscat, Oman",
                homeLatitude: 23.5880,
                homeLongitude: 58.3829
            };

            const response = await request(app)
                .put("/api/v1/supervisor/home-location")
                .send(homeLocationData);

            expect(response.status).toBe(401);
        });

        test("should reject supervisor home location with invalid data", async () => {
            const invalidHomeLocationData = {
                homeAddress: "", // Empty address
                homeLatitude: 200, // Invalid latitude
                homeLongitude: 58.3829
            };

            const response = await request(app)
                .put("/api/v1/supervisor/home-location")
                .set("Authorization", `Bearer ${supervisorToken}`)
                .send(invalidHomeLocationData);

            expect(response.status).toBe(400);
        });
    });

    describe("Parent Home Location", () => {
        test("should set parent home location", async () => {
            const homeLocationData = {
                homeAddress: "789 Parent Street, Muscat, Oman",
                homeLatitude: 23.5880,
                homeLongitude: 58.3829
            };

            const response = await request(app)
                .put("/api/v1/parent/home-location")
                .set("Authorization", `Bearer ${parentToken}`)
                .send(homeLocationData);

            expect(response.status).toBe(200);
            expect(response.body.data.parent).toHaveProperty("homeAddress");
            expect(response.body.data.parent).toHaveProperty("homeLatitude");
            expect(response.body.data.parent).toHaveProperty("homeLongitude");
            expect(response.body.data.parent.homeAddress).toBe("789 Parent Street, Muscat, Oman");
            expect(response.body.data.parent.homeLatitude).toBe(23.588);
            expect(response.body.data.parent.homeLongitude).toBe(58.3829);
        });

        test("should update parent home location", async () => {
            const updatedHomeLocationData = {
                homeAddress: "999 Updated Parent Street, Muscat, Oman",
                homeLatitude: 23.6000,
                homeLongitude: 58.4000
            };

            const response = await request(app)
                .put("/api/v1/parent/home-location")
                .set("Authorization", `Bearer ${parentToken}`)
                .send(updatedHomeLocationData);

            expect(response.status).toBe(200);
            expect(response.body.data.parent.homeAddress).toBe("999 Updated Parent Street, Muscat, Oman");
            expect(response.body.data.parent.homeLatitude).toBe(23.6);
            expect(response.body.data.parent.homeLongitude).toBe(58.4);
        });

        test("should reject parent home location without authentication", async () => {
            const homeLocationData = {
                homeAddress: "789 Parent Street, Muscat, Oman",
                homeLatitude: 23.5880,
                homeLongitude: 58.3829
            };

            const response = await request(app)
                .put("/api/v1/parent/home-location")
                .send(homeLocationData);

            expect(response.status).toBe(401);
        });

        test("should reject parent home location with invalid data", async () => {
            const invalidHomeLocationData = {
                homeAddress: "", // Empty address
                homeLatitude: 23.5880,
                homeLongitude: 300 // Invalid longitude
            };

            const response = await request(app)
                .put("/api/v1/parent/home-location")
                .set("Authorization", `Bearer ${parentToken}`)
                .send(invalidHomeLocationData);

            expect(response.status).toBe(400);
        });
    });

    describe("FCM Token Management", () => {
        test("should set parent FCM token", async () => {
            const fcmTokenData = {
                fcmToken: "test_fcm_token_12345"
            };

            const response = await request(app)
                .put("/api/v1/parent/fcm-token")
                .set("Authorization", `Bearer ${parentToken}`)
                .send(fcmTokenData);

            expect(response.status).toBe(200);
            expect(response.body.data.parent).toHaveProperty("fcmToken");
            expect(response.body.data.parent.fcmToken).toBe("test_fcm_token_12345");
        });

        test("should update parent FCM token", async () => {
            const updatedFcmTokenData = {
                fcmToken: "updated_fcm_token_67890"
            };

            const response = await request(app)
                .put("/api/v1/parent/fcm-token")
                .set("Authorization", `Bearer ${parentToken}`)
                .send(updatedFcmTokenData);

            expect(response.status).toBe(200);
            expect(response.body.data.parent.fcmToken).toBe("updated_fcm_token_67890");
        });

        test("should reject FCM token update without authentication", async () => {
            const fcmTokenData = {
                fcmToken: "test_fcm_token_12345"
            };

            const response = await request(app)
                .put("/api/v1/parent/fcm-token")
                .send(fcmTokenData);

            expect(response.status).toBe(401);
        });

        test("should reject FCM token update with invalid data", async () => {
            const invalidFcmTokenData = {
                fcmToken: "" // Empty token
            };

            const response = await request(app)
                .put("/api/v1/parent/fcm-token")
                .set("Authorization", `Bearer ${parentToken}`)
                .send(invalidFcmTokenData);

            expect(response.status).toBe(400);
        });
    });

    describe("Profile Management", () => {
        test("should get parent profile", async () => {
            const response = await request(app)
                .get("/api/v1/parent/profile")
                .set("Authorization", `Bearer ${parentToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.parent).toHaveProperty("user");
            expect(response.body.data.parent).toHaveProperty("id");
            expect(response.body.data.parent.user.role).toBe("PARENT");
        });

        test("should get supervisor profile", async () => {
            const response = await request(app)
                .get("/api/v1/supervisor/profile")
                .set("Authorization", `Bearer ${supervisorToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.supervisor).toHaveProperty("user");
            expect(response.body.data.supervisor).toHaveProperty("id");
            expect(response.body.data.supervisor.user.role).toBe("SUPERVISOR");
        });

        test("should reject profile access without authentication", async () => {
            const parentResponse = await request(app)
                .get("/api/v1/parent/profile");

            expect(parentResponse.status).toBe(401);

            const supervisorResponse = await request(app)
                .get("/api/v1/supervisor/profile");

            expect(supervisorResponse.status).toBe(401);
        });
    });
}); 