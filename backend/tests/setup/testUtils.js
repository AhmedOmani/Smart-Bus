import request from "supertest";
import app from "../../src/server.js";

export const authenticateAdmin = async () => {
    const loginResponse = await request(app)
        .post("/api/v1/auth/login")
        .send({
            username: "abeer",
            password: "admin123"
        });
    
    if (loginResponse.status !== 200) {
        throw new Error(`Admin login failed: ${loginResponse.status}`);
    }
    
    return {
        token: loginResponse.body.data.token,
        user: loginResponse.body.data.user
    };
};

export const createSupervisor = async (adminToken) => {
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

    if (response.status !== 201) {
        console.error("Supervisor creation failed:", response.body);
        throw new Error(`Supervisor creation failed: ${response.status} - ${JSON.stringify(response.body)}`);
    }

    return {
        user: response.body.data.user,
        credentials: response.body.data.credentials
    };
};

export const createParent = async (adminToken) => {
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

    if (response.status !== 201) {
        console.error("Parent creation failed:", response.body);
        throw new Error(`Parent creation failed: ${response.status} - ${JSON.stringify(response.body)}`);
    }

    return {
        user: response.body.data.user,
        credentials: response.body.data.credentials
    };
};

export const authenticateUser = async (username, password) => {
    const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ username, password });

    if (response.status !== 200) {
        throw new Error(`User login failed: ${response.status}`);
    }

    return {
        token: response.body.data.token,
        user: response.body.data.user
    };
}; 