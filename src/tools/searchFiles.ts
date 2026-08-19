import { readdir } from 'fs/promises';
import path from 'path';

/**
 * Recursively searches for files/directories whose names match a glob-like pattern.
 * Skips common noise directories (node_modules, .git, dist, build, .next).
 */
export default async function searchFiles(
  pattern: string,
  directory: string = ".",
  maxResults: number = 50
): Promise<string> {
  const matches: string[] = [];
  const skipDirs = new Set(["node_modules", ".git", "dist", "build", ".next", "__pycache__", ".cache"]);

  const regex = new RegExp(
    pattern
      .replace(/[.+^${}()|[\]\\]/g, "\\$&") // escape special regex chars except * and ?
      .replace(/\*/g, ".*")
      .replace(/\?/g, "."),
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
      if (entry.isDirectory() && skipDirs.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (regex.test(entry.name)) {
        matches.push(`${fullPath}${entry.isDirectory() ? "/" : ""}`);
      }
      if (entry.isDirectory()) {
        await walk(fullPath);
      }
    }
  }

  await walk(directory);

  if (matches.length === 0) {
    return `No files matching "${pattern}" found in "${directory}"`;
  }
  return matches.join("\n");
}
