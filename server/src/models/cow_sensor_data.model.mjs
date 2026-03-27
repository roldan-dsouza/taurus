// server/src/models/cow_sensor_data.model.mjs

import mongoose from "mongoose";

//since this is a prototype, we are not separating cow profile and sensor data, but in production we should have a separate collection for cow profiles and reference them in sensor data for better scalability and flexibility
const cowSensorDataSchema = new mongoose.Schema(
  {
    cow_id: {
      type: String,
      required: true,
    },
    temperature: {
      type: Number,
    },

    heartbeat: {
      type: Number,
    },

    activity: {
      type: Number,
    },

    methane_level: {
      type: Number,
    },

    location: {
      longitude: Number,
      latitude: Number,
    },

    reading_time: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

cowSensorDataSchema.index({ cow_id: 1, reading_time: -1 }); // gives the latest reading for each cow when queried

export default mongoose.model("CowSensorData", cowSensorDataSchema);
