// server/src/services/groq.services.mjs

import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
import prompt from "../prompt/prompt.mjs";
import Report from "../models/report.model.mjs";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in environment variables.");
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

export const getCowHealthReport = async ({ cow, latest, history }) => {
  const { temperature, heartbeat, activity, methane_level } = latest;

  const trendSummary = buildTrendSummary(history);

  const content = prompt(
    temperature,
    heartbeat,
    activity,
    methane_level,
    trendSummary,
  );

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content }],
    max_tokens: 1000,
  });

  // ✅ Move parsing HERE
  const raw = response.choices[0].message.content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/\n/g, "")
    .replace(/\t/g, "")
    .trim();
  console.log("Raw Groq response:", raw);

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const err = new Error("Groq returned non-JSON response");
    err.status = 502;
    throw err;
  }

  await Report.findOneAndUpdate(
    { cow_id: cow._id },
    {
      $push: {
        report_details_history: {
          $each: [
            { temperature, heartbeat, activity, methane_level, report: parsed },
          ],
          $slice: -1,
        },
      },
    },
    { upsert: true, new: true },
  );

  return {
    message: "Cow health report generated",
    jsonResponse: parsed,
  };
};

const buildTrendSummary = (history) => {
  if (!history.length) return null;

  const oldest = history[history.length - 1]; // least recent of the history window
  const n = history.length;

  const fields = ["temperature", "heartbeat", "activity", "methane_level"];
  const units = {
    temperature: "°C",
    heartbeat: "bpm",
    activity: "units",
    methane_level: "ppm",
  };

  // Thresholds below which a change is considered "stable"
  const stableThresholds = {
    temperature: 0.3,
    heartbeat: 5,
    activity: 10,
    methane_level: 20,
  };

  return fields
    .map((field) => {
      // Use latest (index 0 in history array = second-most-recent overall) vs oldest
      const delta = history[0][field] - oldest[field];
      const absDelta = Math.abs(delta);
      const unit = units[field];
      const sign = delta > 0 ? "+" : "";

      let trend;
      if (absDelta <= stableThresholds[field]) {
        trend = `stable (Δ${sign}${delta.toFixed(1)} ${unit} over ${n} readings)`;
      } else if (delta > 0) {
        trend = `rising (+${absDelta.toFixed(1)} ${unit} over ${n} readings)`;
      } else {
        trend = `falling (−${absDelta.toFixed(1)} ${unit} over ${n} readings)`;
      }

      return `  • ${field.replace("_", " ")}: ${trend}`;
    })
    .join("\n");
};
