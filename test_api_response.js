import dotenv from "dotenv";
import { askGemini } from "./dist/agent/aiModels/gemini.js";
import renderMarkdown from "./dist/utils/markdown.js";

dotenv.config();

async function run() {
  const history = [
    { role: "user", text: "can you write something small in markdown?" }
  ];
  
  try {
    const rawResponse = await askGemini((process.env.geminiModel || "2.5-flash"), history);
    console.log("=== RAW RESPONSE ===");
    console.log(JSON.stringify(rawResponse));
    console.log("\n=== RENDERED RESPONSE ===");
    console.log(renderMarkdown(rawResponse));
  } catch (err) {
    console.error(err);
  }
}

run();
