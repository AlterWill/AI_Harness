import axios from "axios";
import dotenv from "dotenv";

import type { message } from "../../types/message.js";

dotenv.config();

export async function askGemini(prompt: message[]): Promise<string> {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }
  );

  return response.data.candidates[0].content.parts[0].text;
}
