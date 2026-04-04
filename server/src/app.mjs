// server/src/app.mjs

import dotenv from "dotenv";
import express from "express";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import cowRoutes from "./routes/cow.route.mjs";
import { startCronJobs } from "./cron/cron.analysis.mjs";
import { sendSMS } from "./services/twilio.services.mjs";

const app = express();

const corsOptions = {
  origin: [process.env.FRONTEND_DOMAIN, "http://localhost:3000", "*"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
console.log("CORS Origins:", process.env.FRONTEND_DOMAIN);

// Middleware
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
//startCronJobs();

await sendSMS(
  "+918296691500",
  "CowFit server started successfully at " + new Date().toISOString(),
);

// Routes
app.use("/api/cows", cowRoutes);

// Test route
app.get("/try", (req, res) => {
  res.json({ message: "CowFit API is running" });
});

export default app;
