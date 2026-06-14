import { ANSI } from "../utils/escapeSequences.js";

export default class Screen {
  width: number;
  height: number;

  constructor() {
    this.width = process.stdout.columns || 80;
    this.height = process.stdout.rows || 24;

    // Listen for resize events to dynamically update dimensions
    process.stdout.on("resize", () => {
      this.width = process.stdout.columns || 80;
      this.height = process.stdout.rows || 24;
    });
  }

  clear(): void {
    process.stdout.write(ANSI.CLEAR_SCREEN);
    process.stdout.write(ANSI.CURSOR_HOME);
  }

  cursorTo(row: number, col: number): void {
    process.stdout.write(ANSI.cursorTo(row, col));
  }

  write(text: string): void {
    process.stdout.write(text);
  }
}
