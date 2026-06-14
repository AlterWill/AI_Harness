import splitByWords from "./utils/splitByWords.js";
import Box from "./tui/widgets/box.js";
import InputBox from "./tui/widgets/inputBox.js";
import Screen from "./tui/screen.js";
export default class Terminal {
    screen;
    buffer;
    cursorX;
    cursorY;
    headerText;
    inputBoxText;
    inputBoxTextXAxisMargin;
    inputBoxTextXAxisPadding;
    borderWidth;
    headingHeight;
    displayExitMessageForCtrlC;
    constructor() {
        this.screen = new Screen();
        this.cursorX = 1;
        this.cursorY = 1;
        this.buffer = ["", "", "", "Press Ctrl+C again to exit...\n"];
        this.inputBoxText = "";
        this.headerText = "";
        this.inputBoxTextXAxisMargin = 0;
        this.inputBoxTextXAxisPadding = 1;
        this.borderWidth = 1;
        this.headingHeight = 3;
        this.displayExitMessageForCtrlC = false;
    }
    getInputBoxWidth() {
        return this.screen.width - (2 * this.inputBoxTextXAxisMargin) - (2 * this.inputBoxTextXAxisPadding) - (2 * this.borderWidth);
    }
    topLeftPosition() {
        this.screen.cursorTo(1, 1);
    }
    header(a) {
        const headerBox = new Box(a, "center");
        headerBox.addDimeansions(this.screen.width, 3);
        headerBox.setBorder("heavy");
        this.buffer[0] = headerBox.render().join("\n");
    }
    display() {
        this.cursorY = 1;
        this.cursorX = 1;
        // Render header
        const headerContent = this.buffer[0] ?? "";
        console.log(headerContent);
        this.cursorY += this.headingHeight + 1;
        // Render conversation history
        const historyContent = this.buffer[1] ?? "";
        console.log(historyContent);
        const historyTextLines = splitByWords(historyContent, this.screen.width - this.inputBoxTextXAxisMargin - this.inputBoxTextXAxisPadding - 2);
        this.cursorY += historyTextLines.length + 1;
        // Render input box
        const inputBoxContent = this.buffer[2] ?? "";
        console.log(inputBoxContent);
        // Calculate cursor position inside input box
        const inputBox = this.createInputBox();
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
    createInputBox() {
        const inputLines = splitByWords(this.inputBoxText, this.getInputBoxWidth());
        const boxHeight = Math.max(inputLines.length, 1) + 2;
        const boxWidth = this.screen.width - (2 * this.inputBoxTextXAxisMargin);
        const inputBox = new InputBox(this.inputBoxText, "left");
        inputBox.addDimeansions(boxWidth, boxHeight);
        inputBox.addPadding(this.inputBoxTextXAxisPadding, 0);
        return inputBox;
    }
    inputBox() {
        const inputBox = this.createInputBox();
        const margin = " ".repeat(this.inputBoxTextXAxisMargin);
        this.buffer[2] = inputBox.render().map(line => margin + line + margin).join("\n");
    }
}
//# sourceMappingURL=terminal.js.map