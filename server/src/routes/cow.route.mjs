// server/src/routes/cow.route.mjs

import express from "express";
import {
  addSensorData,
  getLatestCowData,
  getAllLatestCowData,
  getAllData,
} from "../controllers/cow.controller.mjs";
import { getAiAnalysis } from "../controllers/cow.groq.controller.mjs";

const router = express.Router();

// Arduino sends sensor data
router.post("/sensor-data", addSensorData); // Add sensor data for a cow

// Get latest sensor data of a cow
router.get("/:cow_id/latest", getLatestCowData); // Get latest sensor data of a cow

// Get all data of a cow
router.get("/:cow_id", getAllData); // Get all data of a cow for AI analysis

// Get all latest sensor data
router.get("/", getAllLatestCowData); // Get all latest sensor data of all cows

// Send cow data to Groq for disease analysis
router.post("/analyze/:cow_id", getAiAnalysis); //AI analysis route

export default router;
