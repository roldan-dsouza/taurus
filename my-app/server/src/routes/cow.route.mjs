// server/src/routes/cow.route.mjs

import express from "express";
import {
  addSensorData,
  getLatestCowData,
  analyzeCowHealth,
} from "../controllers/cowController.js";

const router = express.Router();

// Arduino sends sensor data
router.post("/sensor-data", addSensorData);

// Get latest sensor data of a cow
router.get("/cow/:cow_id/latest", getLatestCowData);

// Send cow data to Groq for disease analysis
router.post("/analyze/:cow_id", analyzeCowHealth);

export default router;
