import type { aiModel } from "../types/aiModelType.js";
import { askGeminiWithTools } from "./aiModels/gemini.js";
import { tools } from "../tools/index.js";
import type { message } from "../types/message.js";
import readFile from "../tools/readFile.js";
import listDirectories from "../tools/listDirectory.js";
import searchFiles from "../tools/searchFiles.js";
import searchText from "../tools/searchText.js";
import getFileInfo from "../tools/getFileInfo.js";
import writeFile from "../tools/writeFile.js";
import editFile from "../tools/editFile.js";
import runCommand from "../tools/runCommand.js";

type Tools = typeof tools;

// ─── System prompt ───────────────────────────────────────────────────────────
// Injected as the first user turn (Gemini doesn't have a dedicated system role
// in the REST API, so we prefix the first user message instead).
const SYSTEM_PROMPT = `You are an expert software engineering assistant running in a terminal.
You have access to tools that let you read, search, edit, and run code.

## Core principles

- **Inspect before you act.** When asked to fix, change, or explain something, always read
  the relevant code first. Never guess at file contents or structure.
- **Search before you read.** When you don't know where something is, use searchText or
  searchFiles to locate it before reading full files.
- **Read only what is necessary.** Don't read entire project trees. Read only the files that
  are directly relevant to the task.
- **Don't repeat reads.** If you have already read a file in this conversation, use the
  information you have instead of reading it again.
- **Prefer specific tools over shell commands.** Use readFile, writeFile, editFile, etc.
  instead of cat, echo, or sed shell commands.
- **Make targeted edits.** Use editFile for small changes. Only use writeFile when creating
  a new file or when the changes are extensive enough to rewrite the whole file.
- **Verify after changes.** After editing code, run a relevant check (type-check, lint, test)
  with runCommand if appropriate.

## Workflow for code tasks

1. **Locate** — use searchText or searchFiles to find the relevant code.
2. **Read** — use readFile on the specific files that matter.
3. **Understand** — reason about the code before proposing changes.
4. **Change** — use editFile or writeFile to make the change.
5. **Verify** — run a build/test/lint check if it makes sense.

## Workspace & Project Creation Rules

- **Default sandbox for new projects:** When asked to create, build, or generate a new project, application, game, or script (e.g. "make a chess game cli", "build an express api", "create a todo app"), ALWAYS build it inside the \`./test\` directory (e.g. \`./test/chess-cli\` or \`./test/todo-app\`).
- **Do NOT pollute \`src/\`:** The \`src/\` directory contains the core code of this AI CLI application itself. Never create new project files inside \`src/\` unless the user explicitly asks you to modify or fix the AI CLI tool itself.
- **Set working directory:** When running commands (like \`npm init\`, \`npm install\`, \`node ...\`) for a project inside \`./test\`, always pass \`cwd: "./test"\` or \`cwd: "./test/<project-name>"\` to \`runCommand\`.

## Tool chaining examples

- "Fix the bug in the auth module"
  → searchText("login\\|authenticate", fileGlob="*.ts")
  → readFile on the relevant file(s)
  → editFile to fix the bug
  → runCommand("npm run build") to verify

- "Make a chess game CLI"
  → writeFile("test/chess-cli/index.js", ...)
  → runCommand("npm init -y", cwd="test/chess-cli")
  → runCommand("node index.js", cwd="test/chess-cli")

- "What does the payment service do?"
  → searchFiles("payment*")
  → readFile the relevant files
  → answer based on what you read

Always explain what you are doing and why. When you make changes, show the user a brief
summary of what changed and suggest a next step if relevant.`;

export const SYSTEM_MESSAGE: message = {
  role: "user",
  text: `[SYSTEM]\n${SYSTEM_PROMPT}`,
  hidden: true
};

export const SYSTEM_ACK: message = {
  role: "model",
  text: "Understood. I'm ready to help. I'll inspect the codebase before making any changes and use tools efficiently.",
  hidden: true
};

// ─── Agent loop ───────────────────────────────────────────────────────────────
export default async function agentLoop(
  model: aiModel,
  messages: message[],
  tools: Tools,
  onProgress?: (status?: string) => void
) {
  while (true) {
    const response = await askGeminiWithTools(model, messages, tools);

    if (response.type === "text") {
      messages.push({
        role: "model",
        parts: [{ text: response.text }]
      });
      return response;
    }

    if (response.type === "tool_call") {
      messages.push({
        role: "model",
        parts: response.rawParts || [
          {
            functionCall: {
              name: response.name,
              args: response.args,
              id: response.id
            },
            ...(response.thoughtSignature ? { thoughtSignature: response.thoughtSignature } : {})
          }
        ]
      });

      if (onProgress) {
        onProgress(`Running ${response.name}...`);
      }

      const args = response.args as any;
      let toolResult: string;

      switch (response.name) {
        case "readFile":
          toolResult = String(await readFile(args.path, false));
          break;

        case "listDirectory":
          toolResult = await listDirectories(args.path);
          break;

        case "searchFiles":
          toolResult = await searchFiles(
            args.pattern,
            args.directory ?? ".",
            args.maxResults ?? 50
          );
          break;

        case "searchText":
          toolResult = await searchText(
            args.pattern,
            args.directory ?? ".",
            args.fileGlob ?? "*",
            args.maxResults ?? 50
          );
          break;

        case "getFileInfo":
          toolResult = await getFileInfo(args.path);
          break;

        case "writeFile":
          toolResult = await writeFile(args.path, args.content);
          break;

        case "editFile":
          toolResult = await editFile(args.path, args.oldText, args.newText);
          break;

        case "runCommand":
          toolResult = await runCommand(args.command, args.cwd);
          break;

        default:
          toolResult = `Error: Unknown tool "${response.name}"`;
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
      });

      if (onProgress) {
        onProgress();
      }
    }
  }
}
