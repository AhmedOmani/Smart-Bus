import request from "supertest";
import WebSocket from "ws";
import app from "../../src/server.js";
import { prisma } from "../setup/testSetup.js";
import { mockUsers, mockBus, mockStudent } from "../setup/mockData.js";

let server;

beforeAll(async () => {
    server = app.listen(0);
});

afterAll(async () => {
    // Close server
    await new Promise((resolve) => server.close(resolve));
    // Disconnect Prisma
    await prisma.$disconnect();
});

describe("Creating users", () => {
    let adminToken;
    test("Get admin token", async () => {
        const loginRes = await request(server)
            .post("/api/v1/auth/login")
            .send({ username: mockUsers.admin.username, password: mockUsers.admin.password });
            console.log(loginRes.body);
        adminToken = loginRes.body.data.token;   
    });
    test("Create parent user", async () => {
        const { nationalId, name, email, phone, role } = mockUsers.parent;
        
        const response = await request(server)
            .post("/api/v1/admin/users")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ nationalId, name, email, phone, role });
        console.log(response.body);
    
        expect(response.status).toBe(201);
        expect(response.body.data.credentials.username).toBeDefined();
        expect(response.body.data.credentials.password).toBeDefined();
    });
    test("Create supervisor user" , async () => {
        const { nationalId, name, email, phone, role } = mockUsers.supervisor;

        const response = await request(server)
            .post("/api/v1/admin/users")
            .set("Authorization" , `Bearer ${adminToken}`)
            .send({ nationalId, name, email, phone, role });
        console.log(response.body);

        expect(response.status).toBe(201);
        expect(response.body.data.credentials.username).toBeDefined();
        expect(response.body.data.credentials.password).toBeDefined();
    });
});

describe('Bus Tracking Integration Tests', () => {
    let server;
    let adminToken, supervisorToken, parentToken;
    
    beforeAll(async () => {
      // Start test server
      server = app.listen(0); // Random port
      
      // Create test users and get tokens
      const adminResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'testadmin', password: 'password' });
      adminToken = adminResponse.body.token;
      
      // ... create other tokens
    });
  
    beforeEach(async () => {
      // Create fresh test data for each test
      await prisma.user.create({ data: mockUsers.supervisor });
      await prisma.supervisor.create({ data: { userId: mockUsers.supervisor.id } });
      await prisma.bus.create({ data: mockBus });
      // ... create other test data
    });
  
    test('Complete Bus Tracking Flow: Supervisor broadcasts -> Admin and Parent receive', async (done) => {
      // ARRANGE: Set up WebSocket connections
      const adminWs = new WebSocket(`ws://localhost:${server.address().port}?token=${adminToken}`);
      const parentWs = new WebSocket(`ws://localhost:${server.address().port}?token=${parentToken}`);
      
      let adminReceivedData = false;
      let parentReceivedData = false;
      
      // Admin subscription
      adminWs.on('open', () => {
        adminWs.send(JSON.stringify({ type: 'SUBSCRIBE', busId: null }));
      });
      
      adminWs.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.type === 'LOCATION_UPDATE') {
          expect(message.payload.busId).toBe(mockBus.id);
          expect(message.payload.latitude).toBe(26.2041);
          expect(message.payload.longitude).toBe(50.5861);
          adminReceivedData = true;
          checkTestComplete();
        }
      });
      
      // Parent subscription
      parentWs.on('open', () => {
        parentWs.send(JSON.stringify({ type: 'SUBSCRIBE', busId: mockBus.id }));
      });
      
      parentWs.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.type === 'LOCATION_UPDATE') {
          expect(message.payload.busId).toBe(mockBus.id);
          parentReceivedData = true;
          checkTestComplete();
        }
      });
      
      // ACT: Supervisor sends location update
      setTimeout(async () => {
        await request(app)
          .post('/api/v1/bus/location')
          .set('Authorization', `Bearer ${supervisorToken}`)
          .send({
            latitude: 26.2041,  // Bahrain coordinates
            longitude: 50.5861
          })
          .expect(201);
      }, 100);
      
      // ASSERT: Both admin and parent should receive the update
      function checkTestComplete() {
        if (adminReceivedData && parentReceivedData) {
          adminWs.close();
          parentWs.close();
          done();
        }
      }
      
      // Timeout protection
      setTimeout(() => {
        if (!adminReceivedData || !parentReceivedData) {
          done(new Error('Test timeout: Not all clients received location update'));
        }
      }, 5000);
    });
});