// server/src/config/db.config.mjs
import mongoose from "mongoose";
import dotenv from "dotenv";

// Database connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "gowmitra2",
    });

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Database connection error:", err);

    process.exit(1);
  }
};

export default connectDB;
