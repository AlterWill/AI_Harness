import { marked } from "marked";
// @ts-ignore
import TerminalRenderer from "marked-terminal";
import chalk from "chalk"

import Screen from "../tui/screen.js";

export default function renderMarkdown(text: string): string {
  const dimensions = new Screen();

  marked.setOptions({
    renderer: new TerminalRenderer({
      showSectionPrefix: false,
      emoji: true,
      tab: 2,
      width: dimensions.width,
      codespan: chalk.blue,
      code: chalk.blue
    }),
  });

  return marked(text) as string
}
