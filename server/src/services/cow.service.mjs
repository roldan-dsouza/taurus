// server/src/services/cow.service.mjs

import CowSensorData from "../models/cow_sensor_data.model.mjs";
import Cow from "../models/cow.model.mjs";
import { getCowHealthReport } from "./groq.services.mjs";

export const addSensorDataService = async ({
  cow_id,
  cow_name,
  cow_breed,
  cow_dob,
  device_id,
  temperature,
  heartbeat,
  activity,
  methane_level,
}) => {
  let cow = await Cow.findOne({ cow_id });
  if (!cow) {
    cow = new Cow({ cow_id, cow_name, cow_breed, cow_dob, device_id });
    await cow.save();
  }

  const sensorData = new CowSensorData({
    cow_id: cow._id,
    temperature,
    heartbeat,
    activity,
    methane_level,
  });

  await sensorData.save();
  return sensorData;
};

export const getLatestCowDataService = async (cow_id) => {
  const cow = await Cow.findById(cow_id); // ✅ use findById instead of findOne({ cow_id })
  console.log("Found cow:", cow);
  if (!cow) return null;

  const latestData = await CowSensorData.findOne({ cow_id: cow_id })
    .sort({ reading_time: -1 })
    .lean();

  return latestData || null;
};

export const getAllLatestCowDataService = async () => {
  const cows = await Cow.find({}).lean();

  const dataWithSensorData = await Promise.all(
    cows.map(async (cow) => {
      const sensorData = await CowSensorData.find({ cow_id: cow._id })
        .sort({ reading_time: -1 })
        .lean();

      try {
        const analysis = await getCowHealthReport(
          sensorData.length > 0 ? sensorData[0] : {},
        );
        const riskLevel =
          analysis.jsonResponse?.Risk_Level ||
          analysis.jsonResponse?.risk_level ||
          "Unknown";
        return { cow, sensorData, risk_level: riskLevel };
      } catch (err) {
        console.error(`Error getting analysis for cow ${cow.cow_id}:`, err);
        return { cow, sensorData, risk_level: "Unknown" };
      }
    }),
  );

  return dataWithSensorData;
};

export const getAllDataService = async (cow_id) => {
  const cow = await Cow.findOne({ _id: cow_id });
  if (!cow) return null;

  const allData = await CowSensorData.find({ cow_id: cow._id })
    .sort({ reading_time: -1 })
    .lean();
  return allData || null;
};
