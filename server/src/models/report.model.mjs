import mongoose from "mongoose";

const cowRReportSchema = new mongoose.Schema(
  {
    cow_id: {
      type: String,
      required: true,
    },
    report_details: [
      {
        type: mongoose.Schema.Types.Mixed, // can store any type of data, but in production we should have a defined structure for report details for better consistency and validation
      },
    ],
  },
  { timestamps: true },
);

cowRReportSchema.index({ cow_id: 1, createdAt: -1 }); // gives the latest report for each cow when queried

export default mongoose.model("Report", cowRReportSchema);
