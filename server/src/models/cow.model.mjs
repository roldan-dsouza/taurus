// src/models/cow.model.mjs
import mongoose from "mongoose";

const cowSchema = new mongoose.Schema({
  cow_id: {
    type: String,
    required: true,
    unique: true,
  },
  cow_name: {
    type: String,
    required: true,
  },
  cow_breed: {
    type: String,
    required: true,
  },
  // replaced cow_age with cow_dob : age derived, dob is stable
  cow_dob: {
    type: Date,
    default: null,
    required: true,
  },
  device_id: {
    type: String,
    required: true,
    unique: true, // one device per cow
  },
});

// Virtual field to compute age on the fly
cowSchema.virtual("cow_age").get(function () {
  if (!this.cow_dob) return null;
  const ageDiff = Date.now() - this.cow_dob.getTime();
  return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
});

export default mongoose.model("Cow", cowSchema);
