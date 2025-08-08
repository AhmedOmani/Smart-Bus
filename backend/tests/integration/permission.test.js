process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-testing';

import request from "supertest";
import app from "../../src/server.js";
import { authenticateAdmin, createSupervisor, createParent } from "../setup/testUtils.js";
import { clearAllTables, seedAdminUser, disconnectTestDB } from "../setup/testSetup.js";

describe("Permission Managment Integration Tests" , () => {
    let server ;
    let adminToken;
    let supervisorToken;
    let supervisorId;
    let parentToken;
    let parentId;
    let busId;
    let studentId;

    const futureISO = (daysFromNow) => {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toISOString();
    }

    beforeAll(async () => {
        server = await app.listen(0);
        await clearAllTables();
        await seedAdminUser();

        const adminAuth = await authenticateAdmin();
        adminToken = adminAuth.token;

        //Create supervisor and parent
        const supervisor = await createSupervisor(adminToken);
        const parent = await createParent(adminToken);

        //Login supervisor
        const supervisorAuth = await request(app)
            .post("/api/v1/auth/login")
            .send({
                username: supervisor.credentials.username, 
                password: supervisor.credentials.password
            });
        supervisorToken = supervisorAuth.body.data.token;
        supervisorId = supervisor.user.id;

        //Login parent
        const parentAuth = await request(app)
            .post("/api/v1/auth/login")
            .send({
                username: parent.credentials.username,
                password: parent.credentials.password
            });
        parentToken = parentAuth.body.data.token;
        parentId = parent.user.id;

        //Create bus
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

        //Create student
        const studentData = {
            nationalId: "ST123456789",
            name: "Test Student",
            grade: "Grade 5",
            homeAddress: "Test Address",
            parentId: parentId,
            busId: busId,
            status: "ACTIVE"
        };
        const studentResponse = await request(app)
            .post("/api/v1/admin/students")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(studentData);
        studentId = studentResponse.body.data.student.id; 
    });

    afterAll(async () => {
        await clearAllTables();
        await server.close();
        await disconnectTestDB();
    });

    describe("Authorization & Authentication" ,  () => {
        test("should allow parent to request permission" , async () => {
            
            const permissionData = {
                studentId: studentId,
                type: "EXIT",
                date: new Date().toISOString(),
                reason: "I have to pick up my child from school"
            }
            const response = await request(app)
                .post("/api/v1/permissions/report")
                .set("Authorization" , `Bearer ${parentToken}`)
                .send(permissionData);

            console.log(response.body);
            
            expect(response.status).toBe(201);
            expect(response.body.data.status).toBe("PENDING");
        });

        test("shoudl reject reject request without token" , async () => {
            const permissionData = {
                studentId: studentId,
                type: "EXIT",
                date: futureISO(0.5),
                reason: "I have to pick up my child from school"
            }
            const response = await request(app)
                        .post("/api/v1/permissions/report")
                        .send(permissionData);

            console.log(response.body);

            expect(response.status).toBe(401);
            expect(response.body.error.code).toBe("AUTHENTICATION_ERROR");
        });

        test("should reject parent requesting permission for another parent's student" , async () => {
            const newParent = await createParent(adminToken);
            const newStudent = await request(app)
                .post("/api/v1/admin/students")
                .set("Authorization" , `Bearer ${adminToken}`)
                .send({
                    nationalId: "ST999999999",
                    name: "Other Child",
                    grade: "Grade 4",
                    parentId: newParent.user.id,
                    busId,
                    status: "ACTIVE"
                });
            const newStudentId = newStudent.body.data.student.id;
           
            const permissionData = {
                studentId: newStudentId,
                type: "EXIT",   
                date: new Date().toISOString(),
                reason: "I have to pick up my child from school"
            }
            const response = await request(app)
                .post("/api/v1/permissions/report")
                .set("Authorization" , `Bearer ${parentToken}`)
                .send(permissionData);
            console.log(response.body);
            expect(response.status).toBe(404);
            expect(response.body.error.message).toBe("Student not found or not authorized to the parent");
        });
    });

    describe("Input Validation" , () => {
        test("should reject past date", async () => {
            const past = new Date();
            past.setDate(past.getDate() - 1);
      
            const res = await request(app)
              .post("/api/v1/permissions/report")
              .set("Authorization", `Bearer ${parentToken}`)
              .send({
                studentId,
                type: "ARRIVAL",
                date: past.toISOString(),
                reason: "invalid past date"
              });
      
            expect(res.status).toBe(400);
        });
      
        test("should reject invalid type", async () => {
            const res = await request(app)
              .post("/api/v1/permissions/report")
              .set("Authorization", `Bearer ${parentToken}`)
              .send({
                studentId,
                // @ts-ignore invalid on purpose
                type: "LEAVE",
                date: futureISO(4)
              });
      
            expect(res.status).toBe(400);
        });
      
        test("should reject reason longer than 500 characters", async () => {
            const longReason = "a".repeat(501);
            const res = await request(app)
              .post("/api/v1/permissions/report")
              .set("Authorization", `Bearer ${parentToken}`)
              .send({
                studentId,
                type: "EXIT",
                date: futureISO(5),
                reason: longReason
              });
      
            expect(res.status).toBe(400);
        });
    });

    describe("Supervisor Approval Workflow" , () => {

        test("should list pending permissions for supervisors bus" , async () => {
            const permissionData = {
                studentId: studentId,
                type: "EXIT",
                date: new Date().toISOString(),
                reason: "I have to pick up my child from school"
            }
            let response;
            response = await request(app)
                .post("/api/v1/permissions/report")
                .set("Authorization" , `Bearer ${parentToken}`)
                .send(permissionData);

            response = await request(app)
                .get("/api/v1/permissions/pending")
                .set("Authorization" , `Bearer ${supervisorToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(1);
            response.body.data.forEach((permission) => {
                expect(permission.status).toBe("PENDING");
            });
        });

        test("shoudl allow supervisor to approve permission" , async () => {
            const permissionData = {
                studentId: studentId,
                type: "EXIT",
                date: futureISO(5),
                reason: "I have to pick up my child from school"
            }
            let response;
            response = await request(app)
                .post("/api/v1/permissions/report")
                .set("Authorization" , `Bearer ${parentToken}`)
                .send(permissionData);
            console.log(response.body);
            const permissionId = response.body.data.id;

            response = await request(app)
                .put(`/api/v1/permissions/${permissionId}`)
                .set("Authorization" , `Bearer ${supervisorToken}`)
                .send({ status: "APPROVED" });
            console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe("APPROVED");
        });

        test("shoudl allow supervisor to reject permission" , async () => {
            const permissionData = {
                studentId: studentId,
                type: "EXIT",
                date: futureISO(7),
                reason: "I have to pick up my child from school"
            }
            let response;
            response = await request(app)
                .post("/api/v1/permissions/report")
                .set("Authorization" , `Bearer ${parentToken}`)
                .send(permissionData);
            console.log(response.body);
            const permissionId = response.body.data.id;

            response = await request(app)
                .put(`/api/v1/permissions/${permissionId}`)
                .set("Authorization" , `Bearer ${supervisorToken}`)
                .send({ status: "REJECTED" });
            console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe("REJECTED");
        });
    });

    describe("Get by ID and by student" , () => {

        let permissionId;

        beforeAll(async () => {
            const response = await request(app)
                .post("/api/v1/permissions/report")
                .set("Authorization" , `Bearer ${parentToken}`)
                .send({
                    studentId: studentId,
                    type: "EXIT",
                    date: futureISO(9),
                });
            permissionId = response.body.data.id;
        });

        test("parent should get their child's permission by id" , async () => {
            const response = await request(app)
                .get(`/api/v1/permissions/${permissionId}`)
                .set("Authorization" , `Bearer ${parentToken}`);
            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(permissionId);
        });

        test("supervisor should get permission by id for their bus" , async () => {
            const response = await request(app)
                .get(`/api/v1/permissions/${permissionId}`)
                .set("Authorization" , `Bearer ${supervisorToken}`);
            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(permissionId);
        });

        test("parent should list permissions by student" , async () => {
            const response = await request(app)
                .get(`/api/v1/permissions/student/${studentId}`)
                .set("Authorization" , `Bearer ${parentToken}`)

            console.log(response.body);
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        })

    });

    describe("Conflict and concurrency" , () => {
        test("should return 409 on duplicate permission for same student" , async () => {
            const permissionData = {
                studentId: studentId,
                type: "EXIT",
                date: futureISO(11),
                reason: "I have to pick up my child from school"
            }

            const firstResponse = await request(app)
            .post("/api/v1/permissions/report")
            .set("Authorization" , `Bearer ${parentToken}`)
            .send(permissionData);

            const secondResponse = await request(app)
                .post("/api/v1/permissions/report")
                .set("Authorization" , `Bearer ${parentToken}`)
                .send(permissionData);

            expect(secondResponse.status).toBe(409);
            expect(secondResponse.body.error.code).toBe("CONFLICT");
        });

        test("should handle concurrent duplicate requests (one success, rest conflict)" , async () => {
            const permissionData = {
                studentId: studentId,
                type: "ARRIVAL",
                date: futureISO(30),
                reason: "conccurent"
            }

            const responses = await Promise.all(
                Array(3)
                .fill(0)
                .map(() => {
                    return request(app)
                        .post("/api/v1/permissions/report")
                        .set("Authorization" , `Bearer ${parentToken}`)
                        .send(permissionData);
                })
            );

            console.log(responses);

            const successResponse  = responses.filter((res) => res.status === 201).length;
            const conflictResponse = responses.filter((res) => res.status === 409).length;
            
            expect(successResponse).toBe(1);
            expect(conflictResponse).toBe(2);
        });
    });

})