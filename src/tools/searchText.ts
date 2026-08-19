import { readdir, readFile } from 'fs/promises';
import path from 'path';

interface TextMatch {
  file: string;
  line: number;
  content: string;
}

/**
 * Recursively searches file contents for a text or regex pattern.
 * Returns matching lines with file path and line number.
 * Skips binary files and common noise directories.
 */
export default async function searchText(
  pattern: string,
  directory: string = ".",
  fileGlob: string = "*",
  maxResults: number = 50
): Promise<string> {
  const matches: TextMatch[] = [];
  const skipDirs = new Set(["node_modules", ".git", "dist", "build", ".next", "__pycache__", ".cache"]);

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, "i");
  } catch {
    // If not valid regex, treat as literal string
    regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  }

  // Simple glob-to-regex for file extension filtering (e.g. "*.ts" -> /\.ts$/i)
  const fileRegex = new RegExp(
    "^" +
    fileGlob
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".") +
    "$",
    "i"
  );

  async function walk(dir: string): Promise<void> {
    if (matches.length >= maxResults) return;
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (matches.length >= maxResults) break;
      if (entry.isDirectory()) {
        if (!skipDirs.has(entry.name)) await walk(path.join(dir, entry.name));
        continue;
      }
      if (!fileRegex.test(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      let content: string;
      try {
        content = await readFile(fullPath, "utf-8");
      } catch {
        continue; // skip binary or unreadable files
      }
      // Skip files that look binary
      if (content.includes("\0")) continue;

      const lines = content.split("\n");
      for (let i = 0; i < lines.length && matches.length < maxResults; i++) {
        const line = lines[i]!;
        if (regex.test(line)) {
          matches.push({ file: fullPath, line: i + 1, content: line.trim() });
        }
      }
    }
  }

  await walk(directory);

  if (matches.length === 0) {
    return `No matches for "${pattern}" in "${directory}" (files: ${fileGlob})`;
  }

  const header = `Found ${matches.length} match(es) for "${pattern}":`;
  const body = matches
    .map(m => `${m.file}:${m.line}: ${m.content}`)
    .join("\n");
  return `${header}\n${body}`;
}
