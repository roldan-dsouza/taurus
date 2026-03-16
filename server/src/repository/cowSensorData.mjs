import cow_sensor_dataModel from "../models/cow_sensor_data.model.mjs";

export const getCowData = async (cowId) => {
  return await cow_sensor_dataModel.find({ cowId }).sort({ reading_time: -1 });
};
