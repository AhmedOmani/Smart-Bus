process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-testing';

import request from "supertest";
import app from "../../src/server.js";
import { authenticateAdmin, createSupervisor, createParent } from "../setup/testUtils.js";
import { clearAllTables, seedAdminUser, disconnectTestDB } from "../setup/testSetup.js";

describe("Absence Management Integration Tests" , () => {
    let server;
    let adminToken;
    let supervisorToken;
    let parentToken;
    let parentId;
    let supervisorId;
    let busId;
    let studentId;

    beforeAll(async () => {
        server = app.listen(0);
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

    describe("Authorization & Authentication" , () => {
        test("should reject requests without token" , async () => {
            const response = await request(app)
                .post("/api/v1/absence/report")
                .send({
                    studentId: studentId,
                    startDate: "2024-02-01T00:00:00.000Z",
                    endDate: "2024-02-02T00:00:00.000Z",
                    type: "SICK"
                });
            expect(response.status).toBe(401);
        });

        test("should allow parent to report absence for their child" , async () => {

            const createFutureDate = (daysFromNow) => {
                const date = new Date();
                date.setDate(date.getDate() + daysFromNow);
                return date.toISOString();
            };
            

            const response = await request(app)
                .post("/api/v1/absence/report")
                .set("Authorization" , `Bearer ${parentToken}`)
                .send({
                    studentId: studentId,
                    startDate: createFutureDate(1),
                    endDate: createFutureDate(2),
                    type: "SICK"
                });

            expect(response.status).toBe(201);
            expect(response.body.data.reportedBy).toBe(parentId);
        });

        test("should reject parent trying to report absence for others child" , async () => {
            const newParent = await createParent(adminToken);
            const newStudent = {
                nationalId: "ST123444456789",
                name: "Test Student",
                grade: "Grade 5",
                homeAddress: "Test Address",
                parentId: newParent.user.id,
                busId: busId,
                status: "ACTIVE"
            };
            const newStudentResponse = await request(app)
                .post("/api/v1/admin/students")
                .set("Authorization" , `Bearer ${adminToken}`)
                .send(newStudent);
            const newStudentId = newStudentResponse.body.data.student.id;

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
    
            const dayAfterTomorrow = new Date();
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

            const response = await request(app)
                .post("/api/v1/absence/report")
                .set("Authorization" , `Bearer ${parentToken}`)
                .send({
                    studentId: newStudentId,
                    startDate: tomorrow.toISOString(),
                    endDate: dayAfterTomorrow.toISOString(),
                    type: "SICK"
                });
            expect(response.status).toBe(404);
            expect(response.body.error.message).toBe("Student not found or not authorized to the parent");
        });

        test("should allow supervisor to view pending absence for their bus" , async () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 3);
    
            const dayAfterTomorrow = new Date();
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 4);

            let response;
            response = await request(app)
                .post("/api/v1/absence/report")
                .set("Authorization" , `Bearer ${parentToken}`)
                .send({
                    studentId: studentId,
                    startDate: tomorrow.toISOString(),
                    endDate: dayAfterTomorrow.toISOString(),
                    type: "SICK"
                });

            response = await request(app)
                .get("/api/v1/absence/supervisor/pending")
                .set("Authorization" , `Bearer ${supervisorToken}`)
                .send();
    
            expect(response.status).toBe(200);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });

    describe("Input Validation" , () => {

        test("Should reject reason longer that 500 chracters" , async () => {
            const longReason = "a".repeat(501);

            const getFutureDate = (daysFromNow) => {
                const date = new Date();
                date.setDate(date.getDate() + daysFromNow);
                return date.toISOString();
            }

            const response = await request(app)
            .post("/api/v1/absence/report")
            .set("Authorization" , `Bearer ${parentToken}`)
            .send({
                studentId: studentId,
                startDate: getFutureDate(5),
                endDate: getFutureDate(6),
                type: "SICK",
                reason: longReason
            });
            expect(response.status).toBe(400);
        });
    });

    describe("Supervisor Approval Workflow" , () => {
        let absenceId;

        beforeAll(async () => {
            const getFutureDate = (daysFromNow) => {
                const date = new Date();
                date.setDate(date.getDate() + daysFromNow);
                return date.toISOString();
            }

            const response = await request(app)
                .post("/api/v1/absence/report")
                .set("Authorization" , `Bearer ${parentToken}`)
                .send({
                    studentId: studentId,
                    startDate: getFutureDate(10),
                    endDate: getFutureDate(11),
                    type: "SICK",
                });
            absenceId = response.body.data.id;
        });

        test("Should allow supervisor to approve absence" , async () => {
            const response = await request(app)
                .put(`/api/v1/absence/${absenceId}/status`)
                .set("Authorization" , `Bearer ${supervisorToken}`)
                .send({
                    status: "APPROVED",
                    notes: "Medical certificate provided"
                });

                console.log(response.body);
            
            
            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe("APPROVED");
            expect(response.body.data.notes).toBe("Medical certificate provided")
            expect(response.body.data.approvedBy).toBe(supervisorId);
            expect(response.body.data.approvedAt).toBeTruthy();
        });

        test("should allow supervisor to reject absence", async () => {
            const response = await request(app)
                .put(`/api/v1/absence/${absenceId}/status`)
                .set("Authorization", `Bearer ${supervisorToken}`)
                .send({
                    status: "REJECTED",
                    notes: "Insufficient documentation"
                });
    
            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe("REJECTED");
        });

    });

    describe("Absence Data Retrieval" , () => {

        let absenceIds = [];
        let offest = 0 ;
        const getFutureDate = (daysFromNow) => { const date = new Date() ; date.setDate(date.getDate() + daysFromNow); return date.toISOString();}

        beforeEach(async () => {
            offest += 10;
            const absencePromises = [
                {
                    studentId: studentId,
                    startDate: getFutureDate(20 + offest),
                    endDate: getFutureDate(21 + offest),
                    type: "SICK"
                },
                {
                    studentId: studentId,
                    startDate: getFutureDate(22 + offest),
                    endDate: getFutureDate(23 + offest),
                    type: "PERSONAL"
                }
            ].map(data =>
                request(app)
                .post("/api/v1/absence/report")
                .set("Authorization", `Bearer ${parentToken}`)
                .send(data)
            );

            const responses = await Promise.all(absencePromises);
            console.log("responses", responses.map(r => r.body));
            absenceIds = responses.map(response => response.body.data.id);
            console.log(absenceIds);
        });

        test("Should get all absences for a student" , async () => {
            const response = await request(app)
                .get(`/api/v1/absence/student/${studentId}`)
                .set("Authorization", `Bearer ${parentToken}`)
                .send();
            
            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBeGreaterThanOrEqual(2)
        });

        test("Should get specific absence by ID" , async () => {
            const response = await request(app)
                .get(`/api/v1/absence/${absenceIds[0]}`)
                .set("Authorization" , `Bearer ${parentToken}`)
                .send();
            
            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(absenceIds[0]);
        });

        test("Should get pending absences for supervisor" , async () => {
            const response = await request(app)
                .get("/api/v1/absence/supervisor/pending")
                .set("Authorization" , `Bearer ${supervisorToken}`)
                .send();

            console.log("response", response.body);

            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
            response.body.data.forEach(absence => {
                expect(absence.status).toBe("PENDING");
            });
        });

    });

    describe("Edge Cases & Error Handling" , () => {

        test("Should handle concurrent absence reports" , async () => {
            const getFutureDate = (daysFromNow) => {
                const date = new Date();
                date.setDate(date.getDate() + daysFromNow);
                return date.toISOString();
            } 
            const absenceData = {
                studentId: studentId,
                startDate: getFutureDate(60),
                endDate: getFutureDate(61),
                type: "SICK"
            };

            const promises = Array(3).fill().map(() => 
                request(app)
                    .post("/api/v1/absence/report")
                    .set("Authorization" , `Bearer ${parentToken}`)
                    .send(absenceData)
            );


            const responses = await Promise.all(promises);
            console.log("responses", responses.map(r => r.body));
            const successCount = responses.filter(r => r.status === 201).length;
            const conflictCount = responses.filter(r => r.status === 409).length;
    
            expect(successCount).toBe(1);
            expect(conflictCount).toBe(2);
        });

    });

});