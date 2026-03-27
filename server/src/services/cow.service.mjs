// server/src/services/cow.service.mjs

import CowSensorData from "../models/cow_sensor_data.model.mjs";
import Report from "../models/report.model.mjs";
import Cow from "../models/cow.model.mjs";

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
  // check if cow exists, if not create a new cow profile
  let cow = await Cow.findOne({ cow_id });
  if (!cow) {
    cow = new Cow({
      cow_id,
      cow_name,
      cow_breed,
      cow_age,
      device_id,
    });
    await cow.save();
  }

  // create a new sensor data entry for the cow
  const sensorData = new CowSensorData({
    cow_id,
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
  const latestData = await CowSensorData.findOne({ cow_id }).sort({
    reading_time: -1,
  });

  if (!latestData) {
    throw new Error("Cow not found");
  }

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
