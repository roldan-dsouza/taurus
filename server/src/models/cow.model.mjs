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
  // add a function to calculate cow age based on birth date for production, but for prototype we just take age as input
  cow_age: {
    type: Number,
    required: true,
  },

  device_id: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Cow", cowSchema);
