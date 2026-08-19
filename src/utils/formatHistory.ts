import type { message } from "../types/message.js";

/**
 * Formats a single tool's arguments into a concise 1-line string.
 */
function formatToolArgs(name: string, args: any): string {
  if (!args || typeof args !== "object") return "";

  switch (name) {
    case "runCommand":
      return args.command ? `command="${truncateStr(args.command, 60)}"` : "";

    case "readFile":
    case "listDirectory":
    case "getFileInfo":
      return args.path ? `"${truncateStr(args.path, 50)}"` : "";

    case "writeFile":
      return args.path ? `"${truncateStr(args.path, 40)}"` : "";

    case "editFile":
      return args.path ? `"${truncateStr(args.path, 40)}"` : "";

    case "searchFiles":
      return `pattern="${args.pattern ?? ""}"`;

    case "searchText":
      return `pattern="${args.pattern ?? ""}"`;

    default: {
      const keys = Object.keys(args);
      if (keys.length === 0 || !keys[0]) return "";
      const firstVal = String(args[keys[0]]);
      return `${keys[0]}="${truncateStr(firstVal, 40)}"`;
    }
  }
}

/**
 * Truncates a string to maxLen with an ellipsis.
 */
function truncateStr(str: string, maxLen: number): string {
  const clean = str.replace(/[\r\n]+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 3) + "...";
}

/**
 * Formats tool output into a clean preview.
 */
function formatToolOutput(output: any): string {
  if (output === undefined || output === null) return "Done";
  const str = typeof output === "string" ? output : JSON.stringify(output);

  // If output is JSON (e.g. from listDirectory), format array nicely
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) {
      const items = parsed.map(item => {
        if (typeof item === "object" && item !== null) {
          return item.name || JSON.stringify(item);
        }
        return String(item);
      });
      const preview = items.slice(0, 5).join(", ");
      const remaining = items.length - 5;
      return `[${preview}${remaining > 0 ? `, ... (+${remaining} items)` : ""}]`;
    }
  } catch {}

  const lines = str.trim().split("\n");
  const line0 = lines[0];
  if (lines.length === 0 || !line0 || !line0.trim()) return "Done";

  const firstLine = truncateStr(line0, 70);
  if (lines.length > 1) {
    return `${firstLine} *(+${lines.length - 1} more lines)*`;
  }
  return firstLine;
}

/**
 * Formats the entire conversation history into markdown text for display in the TUI.
 * Formats user prompts, AI text, tool calls, and tool outputs neatly.
 */
export function formatHistory(history: message[]): string {
  const blocks: string[] = [];

  for (const msg of history) {
    if (msg.hidden) continue;

    if (msg.role === "user") {
      const text = msg.text || (msg.parts?.find(p => typeof p === "object" && "text" in p) as any)?.text;
      if (text) {
        blocks.push(`\n**You**\n\n${text}`);
      }
    } else if (msg.role === "model") {
      let textContent = "";
      if (msg.text) {
        textContent = msg.text;
      } else if (msg.parts) {
        for (const p of msg.parts) {
          if (typeof p === "object" && "text" in p && p.text) {
            textContent += p.text;
          }
        }
      }

      if (textContent.trim()) {
        blocks.push(`\n**AI**\n\n${textContent.trim()}`);
      }

      if (msg.parts) {
        for (const p of msg.parts) {
          if (typeof p === "object" && "functionCall" in p && p.functionCall) {
            const { name, args } = p.functionCall;
            const argSummary = formatToolArgs(name, args);
            // Two trailing spaces force a markdown hard line break before the └─ output line
            blocks.push(`\n🛠️  \`${name}\`(${argSummary})  `);
          }
        }
      }
    } else if (msg.role === "function") {
      if (msg.parts) {
        for (const p of msg.parts) {
          if (typeof p === "object" && "functionResponse" in p && p.functionResponse) {
            const output = p.functionResponse.response?.output;
            const formatted = formatToolOutput(output);
            blocks.push(`   └─ ${formatted}`);
          }
        }
      }
    }
  }

  return blocks.join("\n");
}
