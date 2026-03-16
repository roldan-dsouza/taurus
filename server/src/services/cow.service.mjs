import CowSensorData from "../models/cow_sensor_data.model.mjs";

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
