import swaggerJsdoc from "swagger-jsdoc";
import { PORT } from "./env.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Bus API",
      version: "1.0.0",
      description: "School bus tracking system API"
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
    apis: ["./src/docs/swagger/*.js"] 
};

export const specs = swaggerJsdoc(swaggerOptions);