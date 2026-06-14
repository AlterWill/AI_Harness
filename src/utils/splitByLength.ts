
export default function splitByLength(str: string, splitLength: number): string[] {
  if (splitLength <= 0) throw new Error("Split Length can not be less than 0")
  if (str === "") return []
  const result = [];
  for (let i = 0; i < str.length; i += splitLength) {
    result.push(str.slice(i, i + splitLength))
  }
  return result;
}
