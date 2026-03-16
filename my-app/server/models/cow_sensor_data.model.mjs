import mongoose from "mongoose";

const cowSensorDataSchema = new mongoose.Schema({
  cow_name: {
    type: String,
    required: true,
  },
  cow_breed: {
    type: String,
    required: true,
    sparse: true,
  },
  //build a function to calculate age from birthdate
  cow_age: {
    type: Number,
    required: true,
    sparse: true,
  },
  temperature: {
    type: Number,
    sparse: true,
  },
  heartbeat: {
    type: Number,
    sparse: true,
  },
  activity: {
    type: Number,
    sparse: true,
  },
  methane_level: {
    type: Number,
    sparse: true,
  },
  location: {
    longitude: {
      type: Number,
      sparse: true,
    },
    latitude: {
      type: Number,
      sparse: true,
    },
  },
  timestamps: true,
});

mongoose.model("CowSensorData", cowSensorDataSchema);
