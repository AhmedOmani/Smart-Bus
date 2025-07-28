import { NODE_ENV } from "./env.js";

const getAllowedOrigins = () => {
  if (NODE_ENV === "production") {
    return [
      "https://smartbus.com",
      "https://www.smartbus.com"
    ];
  }
  return [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "null"
  ];
};

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (getAllowedOrigins().includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "X-Request-ID"
  ],
  exposedHeaders: ["X-Request-ID"],
  optionsSuccessStatus: 200
};