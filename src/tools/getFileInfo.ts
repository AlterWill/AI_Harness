import { stat } from 'fs/promises';
import path from 'path';

/**
 * Returns metadata about a file or directory: size, type, permissions, timestamps.
 * Useful for checking if a file exists before reading/writing.
 */
export default async function getFileInfo(filePath: string): Promise<string> {
  try {
    const s = await stat(filePath);
    const info = {
      path: filePath,
      type: s.isDirectory() ? "directory" : s.isSymbolicLink() ? "symlink" : "file",
      sizeBytes: s.size,
      sizeHuman: formatBytes(s.size),
      extension: path.extname(filePath) || "(none)",
      created: s.birthtime.toISOString(),
      modified: s.mtime.toISOString(),
      mode: s.mode.toString(8)
    };
    return JSON.stringify(info, null, 2);
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === "ENOENT") return `File not found: "${filePath}"`;
    return `Error getting info for "${filePath}": ${e.message}`;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
