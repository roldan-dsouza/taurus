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

export const getCowHealthReport = async (cowData) => {
  const [{ cow_id, temperature, heartbeat, activity, methane_level }] = cowData;
  console.log(cowData);
  const content = prompt(temperature, heartbeat, activity, methane_level);

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content }],
    max_tokens: 1000,
  });

  const raw = response.choices[0].message.content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/\n/g, "")
    .replace(/\t/g, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const err = new Error("Groq returned non-JSON response");
    err.status = 502;
    throw err;
  }

  await Report.findOneAndUpdate(
    { cow_id },
    {
      $push: {
        report_details_history: {
          $each: [
            { temperature, heartbeat, activity, methane_level, report: parsed },
          ],
          $slice: -5, // keep only the 5 most recent entries
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
