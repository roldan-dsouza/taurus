import cron from "node-cron";
import cowModel from "../models/cow.model.mjs";
import { getCowHealthReport } from "../services/groq.services.mjs";
import { getCowDataWithHistory } from "../services/cow.service.mjs";

export function startCronJobs() {
  cron.schedule(
    "0 8 * * *", //
    () => {
      cowModel.find({}).then((cows) => {
        cows.forEach(async (cow) => {
          console.log(
            `Running scheduled analysis for cow ${cow._id} at ${new Date().toISOString()}`,
          );
          const cowData = await getCowDataWithHistory(cow._id);
          const analysisResponse = await getCowHealthReport(cowData);
          console.log(`Analysis for cow ${cow._id}:`, analysisResponse);
          if (analysisResponse.jsonResponse.Risk_Level == "High") {
            console.log(`High risk detected for cow ${cow._id}`);
          }
        });
      });
    },
    {
      timezone: "Asia/Kolkata",
    },
  );
}
