import Groq from "groq-sdk";
import dotenv from "dotenv";
import prompt from "../prompt/prompt.mjs";
dotenv.config();
const GROQ_API_KEY =
  process.env.GROQ_API_KEY ||
  "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";

const groq = new Groq({ apiKey: GROQ_API_KEY });

export const getCowHealthReport = async (
  temperature,
  heartbeat,
  activity,
  methane_level,
) => {
  try {
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

    const jsonResponse = response.choices[0].message.content;
    console.log(jsonResponse);
    return {
      message: "Cow health report generated",
      simplifiedHtml: jsonResponse,
    };
  } catch (error) {
    console.log("Full error:", error);
    error = new Error("Failed to generate cow health report");
    error.status = 500;
    throw error;
  }
};

//await getCowHealthReport(39.5, 120, "Low", 1500);
