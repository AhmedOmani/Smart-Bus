import request from "supertest";
import app from "./src/server.js";

async function testAdminLogin() {
  console.log("🔍 Testing admin login...");
  
  const server = app.listen(0);
  
  try {
    const passwords = ["admin123"];
    
    for (const password of passwords) {
      try {
        const response = await request(server)
          .post("/api/v1/auth/login")
          .send({ 
            username: "abeer", 
            password: password 
          });

        console.log(`Password "${password}": ${response.status}`);
        
        if (response.status === 200) {
          console.log("✅ SUCCESS! Found working password:", password);
          console.log("Response:", response.body);
          return;
        }
      } catch (error) {
        console.log(`Password "${password}": Error -`, error.message);
      }
    }
    
    console.log("❌ No working password found");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

testAdminLogin(); 