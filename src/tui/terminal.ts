import InputBox from "./widgets/inputBox.js";
import Box from "./widgets/box.js";
import Screen from "./screen.js";
import splitByWords from "../utils/splitByWords.js";
import renderMarkdown from "../utils/markdown.js";

export default class Terminal {
  screen: Screen;
  buffer: string[];
  cursorX: number;
  cursorY: number;
  headerText: string;
  inputBoxText: string;
  conversationHistoryText: string
  inputBoxTextXAxisMargin: number;
  inputBoxTextXAxisPadding: number;
  borderWidth: number;
  headingHeight: number;
  displayExitMessageForCtrlC: boolean;

  constructor() {
    this.screen = new Screen();
    this.cursorX = 1;
    this.cursorY = 1;
    this.buffer = ["", "", "", "Press Ctrl+C again to exit...\n"];
    this.inputBoxText = "";
    this.headerText = ""
    this.conversationHistoryText = ""
    this.inputBoxTextXAxisMargin = 0;
    this.inputBoxTextXAxisPadding = 1;
    this.borderWidth = 1;
    this.headingHeight = 3;
    this.displayExitMessageForCtrlC = false;
  }

  getInputBoxWidth(): number {
    return this.screen.width - (2 * this.inputBoxTextXAxisMargin) - (2 * this.inputBoxTextXAxisPadding) - (2 * this.borderWidth);
  }

  topLeftPosition(): void {
    this.screen.cursorTo(1, 1);
  }

  header(a: string): void {
    const headerBox = new Box(a, "center");
    headerBox.addDimensions(this.screen.width, 3);
    headerBox.setBorder("heavy");
    this.buffer[0] = headerBox.render().join("\n");
  }

  display(): void {
    this.cursorY = 1;
    this.cursorX = 1;

    // Render header
    const headerContent = this.buffer[0] ?? "";
    process.stdout.write(headerContent);
    this.cursorY += this.headingHeight;

    // Render conversation history
    const historyContent = this.buffer[1] ?? "";
    const renderedHistory = renderMarkdown(historyContent);
    const historyLines = renderedHistory.split("\n");

    // Calculate dynamic available height to prevent scrolling overflow
    const inputBox = this.createInputBox();
    const inputBoxHeight = inputBox.height;
    const extraSpaceForExitMessage = this.displayExitMessageForCtrlC ? 2 : 0;
    const maxHistoryHeight = this.screen.height - this.headingHeight - inputBoxHeight - extraSpaceForExitMessage - 2;

    // Slice only the most recent lines that fit on screen
    const linesToPrint = maxHistoryHeight > 0 && historyLines.length > maxHistoryHeight
      ? historyLines.slice(-maxHistoryHeight)
      : historyLines;

    const printableHistory = linesToPrint.join("\n");
    process.stdout.write(printableHistory + "\n");

    // Adjust cursor Y by exact lines output
    const linesCount = linesToPrint[linesToPrint.length - 1] === "" ? linesToPrint.length - 1 : linesToPrint.length;
    this.cursorY += linesCount + 1;

    // Render input box
    const inputBoxContent = this.buffer[2] ?? "";
    process.stdout.write(inputBoxContent);

    // Calculate cursor position inside input box
    const cursorOffset = inputBox.getCursorOffset();
    this.cursorY += cursorOffset.y - 1;
    this.cursorX = this.inputBoxTextXAxisMargin + cursorOffset.x;

    // Render exit message if Ctrl+C was pressed once
    if (this.displayExitMessageForCtrlC) {
      const exitMsg = this.buffer[3] ?? "Press Ctrl+C again to exit...\n";
      this.cursorY += 2;
      this.cursorX = exitMsg.length;
      console.log(exitMsg);
    }

    // Set cursor position
    this.screen.cursorTo(this.cursorY, this.cursorX);
  }

  createInputBox(): InputBox {
    const inputLines = splitByWords(this.inputBoxText, this.getInputBoxWidth());
    const boxHeight = Math.max(inputLines.length, 1) + 2;
    const boxWidth = this.screen.width - (2 * this.inputBoxTextXAxisMargin);

    const inputBox = new InputBox(this.inputBoxText, "left");
    inputBox.addDimensions(boxWidth, boxHeight);
    inputBox.addPadding(this.inputBoxTextXAxisPadding, 0);
    return inputBox;
  }

  inputBox(): void {
    const inputBox = this.createInputBox();
    const margin = " ".repeat(this.inputBoxTextXAxisMargin);
    this.buffer[2] = inputBox.render().map(line => margin + line + margin).join("\n");
  }
}
