import http from "http";
import express from "express" ;
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from 'swagger-ui-express';
import { v4 as uuidv4 } from "uuid";

// Config
import { PORT } from "./config/env.js";
import { connectToDB } from "./config/db.js";
import { corsOptions } from "./config/cors.js";
import { specs } from "./config/swagger.js";

// Middlewares
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { rateLimitMiddleware } from "./middlewares/ratelimit.middleware.js";

// Routes
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import parentRoutes from "./routes/parent.route.js";
import busRoutes from "./routes/bus.routes.js";
import supervisorRoutes from "./routes/supervisor.routes.js";
import { initWebSocketServer } from "./services/websocket.service.js";

const app = express();
const server = http.createServer(app);

// Trust proxy only in production or when behind a proxy
if (process.env.NODE_ENV === 'production' || process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', true);
}

app.use((req, res, next) => {
    req.requestId = uuidv4();
    res.setHeader('X-Request-ID', req.requestId);
    next();
});

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(rateLimitMiddleware);

//APIs
app.use("/api/v1/auth" , authRoutes);
app.use("/api/v1/admin" , adminRoutes);
app.use("/api/v1/parent", parentRoutes);
app.use("/api/v1/bus", busRoutes);
app.use("/api/v1/supervisor", supervisorRoutes);

app.use(globalErrorHandler);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});
//comment it when testing
/*
server.listen(PORT , async () => {
    console.log(`Smart Bus server is running on PORT ${PORT}`);
    console.log("Enviroment:" , process.env.NODE_ENV);
    await connectToDB();
    initWebSocketServer(server);
});
*/

export default server;

