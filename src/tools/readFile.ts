import fs from 'fs/promises'

export default async function readFile(path: string, isJSON: boolean): Promise<string | Object> {
  try {
    const data = await fs.readFile(path, "utf-8")
    if (isJSON) {
      return JSON.parse(data)
    } else {
      return data
    }
  } catch (err) {
    return `Failed to read file at ${path} with error:${err}`
  }
}
