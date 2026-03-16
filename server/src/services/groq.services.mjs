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

export const getCowHealthReport = async (cowId) => {
  try {
    const { temperature, heartbeat, activity, methane_level } =
      await getCowData(cowId);
    console.log(GROQ_API_KEY);
    const content = prompt(temperature, heartbeat, activity, methane_level);
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
      .trim();

    console.log("my data", jsonResponse);

    return {
      message: "Cow health report generated",
      jsonResponse: jsonResponse,
    };
  } catch (error) {
    console.log("Full error:", error);
    error = new Error("Failed to generate cow health report");
    error.status = 500;
    throw error;
  }
};
