// server/src/services/cow.service.mjs

import CowSensorData from "../models/cow_sensor_data.model.mjs";
import { getCowHealthReport } from "./groq.services.mjs";

export const addSensorDataService = async (
  cow_id,
  cow_name,
  cow_breed,
  cow_age,
  device_id,
  temperature,
  heartbeat,
  activity,
  methane_level,
) => {
  // this is called time-series data storage, much easier to scale and query for latest data
  const sensorData = new CowSensorData({
    cow_id,
    cow_name,
    cow_breed,
    cow_age,
    device_id,
    temperature,
    heartbeat,
    activity,
    methane_level,
  });

  await sensorData.save();

  return sensorData;
};

export const getLatestCowDataService = async (cow_id) => {
  // get the latest sensor data for a cow using cow_id, sorted by reading_time in descending order and limit to 1
  const latestData = await CowSensorData.findOne({ cow_id })
    .sort({ reading_time: -1 })
    .exec();

  return latestData;
};

export const getAllLatestCowDataService = async () => {
  // Get the latest sensor data for all cows
  const latestData = await CowSensorData.aggregate([
    {
      $sort: { cow_id: 1, reading_time: -1 },
    },
    {
      $group: {
        _id: "$cow_id",
        latest: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$latest" },
    },
  ]);

  // Add risk_level to each cow data
  const dataWithRisk = await Promise.all(
    latestData.map(async (cow) => {
      try {
        const analysis = await getCowHealthReport(cow);
        const riskLevel =
          analysis.jsonResponse?.["Risk_Level"] ||
          analysis.jsonResponse?.risk_level ||
          "Unknown";
        return { ...cow, risk_level: riskLevel };
      } catch (err) {
        console.error(`Error getting analysis for ${cow.cow_id}:`, err);
        return { ...cow, risk_level: "Unknown" };
      }
    }),
  );

  return dataWithRisk;
};
