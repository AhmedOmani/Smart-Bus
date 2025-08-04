import request from "supertest";
import app from "./src/server.js";

const server = app.listen(0);

async function debugAuth() {
    console.log("Testing admin login...");
    
    try {
        const response = await request(server)
            .post("/api/v1/auth/login")
            .send({ 
                username: "abeer", 
                password: "admin123" 
            });

        console.log("Response status:", response.status);
        console.log("Response body:", JSON.stringify(response.body, null, 2));
        
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        server.close();
    }
}

debugAuth(); 