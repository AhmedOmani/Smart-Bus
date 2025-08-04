import request from "supertest";
import app from "../../src/server.js";
import { authenticateAdmin, createSupervisor, createParent } from "../setup/testUtils.js";
import { initWebSocketServer } from "../../src/services/websocket.service.js";

describe("Bus Tracking Tests", () => {
    let adminToken;
    let supervisorToken;
    let parentToken;
    let busId;
    let studentId;
    let server;

    beforeAll(async () => {
        // Initialize WebSocket server
        server = app.listen(0);
        initWebSocketServer(server);

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

    afterAll(async () => {
        if (server) {
            server.close();
        }
    });

    describe("Bus Management", () => {
        test("should create bus and assign to supervisor", async () => {
            const busData = {
                busNumber: "Test Bus 1",
                licensePlate: "TEST123",
                capacity: 20,
                model: "Toyota",
                year: 2020,
                driverName: "Test Driver",
                driverPhone: "+968 12345678",
                driverLicenseNumber: "DL123456",
                supervisorId: supervisorToken ? JSON.parse(Buffer.from(supervisorToken.split('.')[1], 'base64').toString()).userId : null,
                status: "ACTIVE"
            };

            const response = await request(app)
                .post("/api/v1/admin/buses")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(busData);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty("bus");
            expect(response.body.data.bus.supervisorId).toBeDefined();
            
            busId = response.body.data.bus.id;
        });

        test("should create student and assign to bus", async () => {
            if (!busId) {
                throw new Error("Bus ID not available");
            }

            const studentData = {
                nationalId: "ST123456789",
                name: "Test Student",
                grade: "Grade 5",
                homeAddress: "Test Address",
                parentId: parentToken ? JSON.parse(Buffer.from(parentToken.split('.')[1], 'base64').toString()).userId : null,
                busId: busId,
                status: "ACTIVE"
            };

            const response = await request(app)
                .post("/api/v1/admin/students")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(studentData);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty("student");
            expect(response.body.data.student.busId).toBe(busId);
            
            studentId = response.body.data.student.id;
        });
    });

    describe("Location Tracking", () => {
        test("should save bus location", async () => {
            if (!busId) {
                throw new Error("Bus ID not available");
            }

            const locationData = {
                latitude: 23.5880,
                longitude: 58.3829
            };

            const response = await request(app)
                .post("/api/v1/bus/location")
                .set("Authorization", `Bearer ${supervisorToken}`)
                .send(locationData);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty("id");
            expect(response.body.data.latitude).toBe(23.588);
            expect(response.body.data.longitude).toBe(58.3829);
        });

        test("should reject location update from non-supervisor", async () => {
            const locationData = {
                latitude: 23.5880,
                longitude: 58.3829
            };

            const response = await request(app)
                .post("/api/v1/bus/location")
                .set("Authorization", `Bearer ${parentToken}`)
                .send(locationData);

            expect(response.status).toBe(404);
        });

        test("should reject location update without authentication", async () => {
            const locationData = {
                latitude: 23.5880,
                longitude: 58.3829
            };

            const response = await request(app)
                .post("/api/v1/bus/location")
                .send(locationData);

            expect(response.status).toBe(401);
        });
    });

    describe("WebSocket Connection", () => {
        test("should connect admin WebSocket", (done) => {
            (async () => {
                const WebSocket = (await import("ws")).default;
                const port = server.address().port;
                
                const ws = new WebSocket(`ws://localhost:${port}?token=${adminToken}`);
                
                ws.on('open', () => {
                    // Connection established successfully
                    ws.close();
                    done();
                });
                
                ws.on('error', (error) => {
                    done(error);
                });

                // Timeout after 5 seconds
                setTimeout(() => {
                    ws.close();
                    done(new Error("WebSocket connection timeout"));
                }, 5000);
            })();
        }, 10000);

        test("should connect parent WebSocket", (done) => {
            (async () => {
                const WebSocket = (await import("ws")).default;
                const port = server.address().port;
                
                const ws = new WebSocket(`ws://localhost:${port}?token=${parentToken}`);
                
                ws.on('open', () => {
                    // Connection established successfully
                    ws.close();
                    done();
                });
                
                ws.on('error', (error) => {
                    done(error);
                });

                // Timeout after 5 seconds
                setTimeout(() => {
                    ws.close();
                    done(new Error("WebSocket connection timeout"));
                }, 5000);
            })();
        }, 10000);

        test("should reject unauthenticated WebSocket connections", (done) => {
            (async () => {
                const WebSocket = (await import("ws")).default;
                const port = server.address().port;
                
                const ws = new WebSocket(`ws://localhost:${port}`);
                
                ws.on('close', (code) => {
                    expect(code).toBe(1008);
                    done();
                });
                
                ws.on('error', (error) => {
                    done(error);
                });

                // Timeout after 5 seconds
                setTimeout(() => {
                    ws.close();
                    done(new Error("WebSocket connection timeout"));
                }, 5000);
            })();
        }, 10000);
    });

    describe("Real-time Location Broadcasting", () => {
        test("should broadcast location updates to authorized subscribers", (done) => {
            (async () => {
                const WebSocket = (await import("ws")).default;
                const port = server.address().port;
                
                let adminReceived = false;
                let parentReceived = false;
                
                // Connect admin
                const adminWs = new WebSocket(`ws://localhost:${port}?token=${adminToken}`);
                adminWs.on('open', () => {
                    adminWs.send(JSON.stringify({ type: 'SUBSCRIBE', busId: null }));
                });
                
                // Connect parent
                const parentWs = new WebSocket(`ws://localhost:${port}?token=${parentToken}`);
                parentWs.on('open', () => {
                    parentWs.send(JSON.stringify({ type: 'SUBSCRIBE', busId: busId }));
                });
                
                // Listen for messages
                adminWs.on('message', (data) => {
                    const message = JSON.parse(data);
                    if (message.type === 'LOCATION_UPDATE') {
                        adminReceived = true;
                        checkCompletion();
                    }
                });
                
                parentWs.on('message', (data) => {
                    const message = JSON.parse(data);
                    if (message.type === 'LOCATION_UPDATE') {
                        parentReceived = true;
                        checkCompletion();
                    }
                });
                
                const checkCompletion = () => {
                    if (adminReceived && parentReceived) {
                        adminWs.close();
                        parentWs.close();
                        done();
                    }
                };
                
                // Send location update
                setTimeout(async () => {
                    const locationData = {
                        latitude: 23.5880,
                        longitude: 58.3829
                    };

                    await request(app)
                        .post("/api/v1/bus/location")
                        .set("Authorization", `Bearer ${supervisorToken}`)
                        .send(locationData);
                }, 1000);
            })();
        }, 10000);
    });
}); 