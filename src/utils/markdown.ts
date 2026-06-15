import { marked } from "marked";
// @ts-ignore
import TerminalRenderer from "marked-terminal";
import chalk from "chalk"

export default function renderMarkdown(text: string, width: number = process.stdout.columns || 80): string {
  marked.setOptions({
    renderer: new TerminalRenderer({
      showSectionPrefix: false,
      emoji: true,
      tab: 2,
      width: width,
      reflowText: true,
      unescape: true,
      codespan: chalk.blue,
      code: chalk.blue,
      blockquote: chalk.gray.italic,
    }),
  });

  return marked(text) as string
}
