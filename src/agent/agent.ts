import type { aiModel } from "../types/aiModelType.js";
import { askGeminiWithTools } from "./aiModels/gemini.js";
import { tools } from "../tools/index.js";
import type { message } from "../types/message.js";
import readFile from "../tools/readFile.js";
import listDirectories from "../tools/listDirectory.js";

type Tools = typeof tools

export default async function agentLoop(model: aiModel, messages: message[], tools: Tools) {
  while (true) {
    const response = await askGeminiWithTools(
      model,
      messages,
      tools
    )

    if (response.type === "text") {
      messages.push({
        role: "model",
        parts: [
          {
            text: response.text
          }
        ]
      })
      return response
    } else if (response.type === "tool_call") {
      messages.push({
        role: "model",
        parts: [
          {
            functionCall: {
              name: response.name,
              args: response.args,
              id: response.id
            },
            thoughtSignature: response.thoughtSignature
          }
        ]
      })

      let toolResult: any;
      const args = response.args as any;

      if (response.name === "readFile") {
        toolResult = await readFile(args.path, args.isJSON);
      } else if (response.name === "listDirectories") {
        toolResult = await listDirectories(args.path)
      } else {
        toolResult = `Error: Tool ${response.name} not found`
      }


      messages.push({
        role: "function",
        parts: [
          {
            functionResponse: {
              name: response.name,
              response: { output: toolResult },
              id: response.id
            }
          }
        ]
      })


    }

  }

}
