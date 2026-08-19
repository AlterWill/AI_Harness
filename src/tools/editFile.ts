import { readFile, writeFile } from 'fs/promises';

/**
 * Replaces the first occurrence of `oldText` with `newText` in a file.
 * Read the file first with readFile to confirm the exact text to replace.
 * For wholesale rewrites, use writeFile instead.
 */
export default async function editFile(
  filePath: string,
  oldText: string,
  newText: string
): Promise<string> {
  let content: string;
  try {
    content = await readFile(filePath, "utf-8");
  } catch (err) {
    return `Failed to read "${filePath}" before editing: ${(err as Error).message}`;
  }

  if (!content.includes(oldText)) {
    // Provide a small context snippet to help the AI correct itself
    const preview = content.slice(0, 300).replace(/\n/g, "\\n");
    return `ERROR: The text to replace was not found in "${filePath}".\nFile begins with: ${preview}\nDouble-check the exact text (whitespace, indentation) and try again.`;
  }

  const updated = content.replace(oldText, newText);
  try {
    await writeFile(filePath, updated, "utf-8");
    return `Successfully edited "${filePath}": replaced the specified text.`;
  } catch (err) {
    return `Failed to write changes to "${filePath}": ${(err as Error).message}`;
  }
}
