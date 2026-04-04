// src/models/report.model.mjs

import mongoose from "mongoose";

const cowReportSchema = new mongoose.Schema(
  {
    cow_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cow",
      required: true,
    },
    report_details_history: [
      {
        type: mongoose.Schema.Types.Mixed, // stores the full report details as returned by Groq, can be structured further if needed
        slice: -1, // keep only the latest report in history to prevent unbounded growth, adjust as needed
      },
    ],
  },
  { timestamps: true },
);

cowReportSchema.index({ cow_id: 1, createdAt: -1 }); // gives the latest report for each cow when queried

export default mongoose.model("Report", cowReportSchema);
