import { readdir } from 'fs/promises';

export default async function listDirectories(path: string): Promise<string> {
  try {
    const entries = await readdir(path, { withFileTypes: true });
    const result = entries.map(dirent => ({
      name: dirent.name,
      type: dirent.isDirectory() ? "directory" : "file"
    }));
    return JSON.stringify(result, null, 2);
  } catch (err) {
    const errMsg = (err as NodeJS.ErrnoException).message || String(err);
    return `Error listing directory at "${path}": ${errMsg}`;
  }
}


