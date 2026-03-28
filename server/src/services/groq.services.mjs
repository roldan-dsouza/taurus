// server/src/services/groq.services.mjs

import Groq from "groq-sdk";
import dotenv from "dotenv";
import prompt from "../prompt/prompt.mjs";
import { getCowData } from "../repository/cowSensorData.mjs";
dotenv.config();
const GROQ_API_KEY =
  process.env.GROQ_API_KEY ||
  "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";

const groq = new Groq({ apiKey: GROQ_API_KEY });

export const getCowHealthReport = async (cowData) => {
  try {
    const { temperature, heartbeat, activity, methane_level } = cowData;
    console.log("Cow data received:", {
      temperature,
      heartbeat,
      activity,
      methane_level,
    });

    const content = prompt(temperature, heartbeat, activity, methane_level);
    console.log("Prompt sent to Groq:", content);
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: content,
        },
      ],
      max_tokens: 4000,
    });

    const jsonResponse = response.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/\n/g, "")
      .replace(/\t/g, "")
      .trim();

    //console.log("my data", jsonResponse);

    // store the report in the database
    const report = new Report({
      cow_id: cowData.cow_id,
      report_details_history: report_details_history.push({
        temperature,
        heartbeat,
        activity,
        methane_level,
        report: JSON.parse(jsonResponse),
      }),
    });
    await report.save();

    return {
      message: "Cow health report generated",
      jsonResponse: JSON.parse(jsonResponse),
    };
  } catch (error) {
    console.log("Full error:", error);
    error = new Error("Failed to generate cow health report");
    error.status = 500;
    throw error;
  }
};
