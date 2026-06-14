import splitByLength from "./splitByLength.js";

export default function splitByWords(str: string, splitLength: number): string[] {
  if (splitLength <= 0) throw new Error("Split Length cannot be less than or equal to 0");
  if (str === "") return [];

  const words = str.split(" ");
  const result: string[] = [];
  let currentLine = "";

  for (const word of words) {
    // 1. If a single word is longer than the column width, force-split it by length
    if (word.length > splitLength) {
      if (currentLine !== "") {
        result.push(currentLine);
        currentLine = "";
      }
      const splitWord = splitByLength(word, splitLength);
      result.push(...splitWord.slice(0, -1));
      currentLine = splitWord[splitWord.length - 1] ?? "";
      continue;
    }

    const separator = currentLine === "" ? "" : " ";
    if (currentLine.length + separator.length + word.length > splitLength) {
      result.push(currentLine);
      currentLine = word;
    } else {
      currentLine += separator + word;
    }
  }

  if (currentLine !== "") {
    result.push(currentLine);
  }

  return result;
}
