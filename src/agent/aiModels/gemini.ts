import axios from "axios";
import dotenv from "dotenv";

import type { message } from "../../types/message.js";
import { tools } from "../../tools/index.js";
import type { aiModel } from "../../types/aiModelType.js";

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

type askGeminiWithToolsReturnType = {
  type: "tool_call",
  name: string,
  args: any,
  id?: string,
  thoughtSignature?: string,
  rawParts?: any[]
} | {
  type: "text",
  text: string
}

export async function askGeminiWithTools(model: aiModel, prompt: message[], tools: any[]): Promise<askGeminiWithToolsReturnType> {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${model.model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: prompt.map((mes: message) => {
        if (mes.text) {
          return {
            role: mes.role === "model" ? "model" : "user",
            parts: [
              {
                text: mes.text
              }]
          }
        }
        return {
          role: mes.role,
          parts: mes.parts
        }
      }),
      tools
    }, {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 30000 // time limit for model processing
  });

  const parts: any[] = response.data.candidates[0].content.parts ?? [];

  // Gemini can return multiple parts in one response, e.g. a text explanation
  // followed by a functionCall. Scan all parts so we never miss a tool call.
  let textAccumulator = "";
  let thoughtSignature: string | undefined;

  for (const part of parts) {
    if (part.thoughtSignature) {
      thoughtSignature = part.thoughtSignature;
    }
    if (part.functionCall) {
      return {
        type: "tool_call",
        name: part.functionCall.name,
        args: part.functionCall.args,
        id: part.functionCall.id,
        rawParts: parts,
        ...(thoughtSignature !== undefined ? { thoughtSignature } : {})
      };
    }
    if (part.text) {
      textAccumulator += part.text;
    }
  }

  return {
    type: "text",
    text: textAccumulator
  }
}

