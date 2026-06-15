import axios from "axios";
import dotenv from "dotenv";

import type { message } from "../../types/message.js";

dotenv.config();

export type model = "gemini-2.5-flash" | "gemini-2.5-flash-lite" | "gemini-3.1-flash-lite" | "gemini-3.5-flash" | "gemini-2.5-pro"

export async function askGemini(model: model, prompt: message[]): Promise<string> {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: prompt.map(m => ({
        role: m.role === "model" ? "model" : "user",
        parts: [{ text: m.text }]
      }))
    }, {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 30000 // time limit for model processing
  });

  return response.data.candidates[0].content.parts[0].text;
}
