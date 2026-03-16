// server/src/models/cow_sensor_data.model.mjs

import mongoose from "mongoose";

const cowSensorDataSchema = new mongoose.Schema(
  {
    cow_id: {
      type: String,
      required: true,
    },

    cow_name: {
      type: String,
      required: true,
    },

    cow_breed: {
      type: String,
      required: true,
    },
    // add a function to calculate cow age based on birth date
    cow_age: {
      type: Number,
      required: true,
    },

    device_id: {
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
