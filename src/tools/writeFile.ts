import { writeFile as fsWriteFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * Creates or overwrites a file with the given content.
 * Automatically creates parent directories if they don't exist.
 */
export default async function writeFile(filePath: string, content: string): Promise<string> {
  try {
    const dir = path.dirname(filePath);
    await mkdir(dir, { recursive: true });
    await fsWriteFile(filePath, content, "utf-8");
    const lines = content.split("\n").length;
    return `Successfully wrote ${lines} line(s) to "${filePath}"`;
  } catch (err) {
    return `Failed to write file "${filePath}": ${(err as Error).message}`;
  }
}
