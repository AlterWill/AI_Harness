import InputBox from "./widgets/inputBox.js";
import Box from "./widgets/box.js";
import Screen from "./screen.js";
import splitByWords from "../utils/splitByWords.js";
import renderMarkdown from "../utils/markdown.js";
import { ANSI } from "../utils/escapeSequences.js";

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
  scrollOffset: number
  displayExitMessageForCtrlC: boolean;

  constructor() {
    this.screen = new Screen();
    this.cursorX = 1;
    this.cursorY = 1;
    this.buffer = ["", "", "", "Press Ctrl+C again to exit...\n", ""];
    this.inputBoxText = "";
    this.headerText = ""
    this.conversationHistoryText = ""
    this.inputBoxTextXAxisMargin = 0;
    this.inputBoxTextXAxisPadding = 1;
    this.borderWidth = 1;
    this.headingHeight = 3;
    this.displayExitMessageForCtrlC = false;
    this.scrollOffset = 0
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
    let frame = ""
    frame += ANSI.CLEAR_SCREEN;
    frame += ANSI.TOP_LEFT_POSISTION;
    // 1. Position and render header
    const headerContent = this.buffer[0] ?? "";
    frame += headerContent

    // 2. Position and render conversation history
    const historyContent = this.buffer[1] ?? "";
    const renderedHistory = renderMarkdown(historyContent, this.screen.width).trimEnd();
    const historyLines = renderedHistory === "" ? [] : renderedHistory.split("\n");

    // Calculate dynamic available height to prevent scrolling overflow
    const inputBox = this.createInputBox();
    const inputBoxHeight = inputBox.height;
    const extraSpaceForExitMessage = this.displayExitMessageForCtrlC ? 2 : 0;
    const extraSpaceForSpinner = this.buffer[4] !== "" ? (historyLines.length > 0 ? 2 : 1) : 0;
    const maxHistoryHeight = Math.max(0, this.screen.height - this.headingHeight - inputBoxHeight - extraSpaceForExitMessage - extraSpaceForSpinner - 2);

    // Scroll handling
    const maxScroll = Math.max(0, historyLines.length - maxHistoryHeight)
    this.scrollOffset = Math.min(Math.max(0, this.scrollOffset), maxScroll)
    const startIndex = Math.max(0, historyLines.length - maxHistoryHeight - this.scrollOffset)
    const endIndex = Math.max(0, historyLines.length - this.scrollOffset)

    // Slice only the lines that fit on screen
    const linesToPrint = historyLines.slice(startIndex, endIndex)

    const printableHistory = linesToPrint.join("\n");

    // Draw history starting at Row 4
    frame += ANSI.cursorTo(4, 1)
    if (printableHistory !== "") {
      frame += printableHistory
    }

    if (this.buffer[4] !== "") {
      frame += (historyLines.length > 0 ? "\n\n" : "") + this.buffer[4] + "\n";
    }

    // 3. Position and render input box
    const linesCount = linesToPrint.length;
    const spinnerLineCount = this.buffer[4] !== "" ? (historyLines.length > 0 ? 2 : 1) : 0;
    const inputBoxRow = 4 + linesCount + spinnerLineCount;
    frame += ANSI.cursorTo(inputBoxRow, 1)

    const inputBoxContent = this.buffer[2] ?? "";
    frame += inputBoxContent + ANSI.BOTTOM_RIGHT_POSISTION

    // 4. Calculate cursor position inside input box
    const cursorOffset = inputBox.getCursorOffset();
    this.cursorY = inputBoxRow + cursorOffset.y;
    this.cursorX = this.inputBoxTextXAxisMargin + cursorOffset.x;

    // 5. Position and render exit message if Ctrl+C was pressed once
    if (this.displayExitMessageForCtrlC) {
      const exitMsg = this.buffer[3] ?? "Press Ctrl+C again to exit...\n";
      frame += ANSI.cursorTo(inputBoxRow + inputBoxHeight, 1) + exitMsg
    }

    // 6. Set cursor position
    frame += ANSI.cursorTo(this.cursorY, this.cursorX)
    process.stdout.write(frame)
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
