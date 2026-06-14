import InputBox from "./tui/widgets/inputBox.js";
import Screen from "./tui/screen.js";
export default class Terminal {
    screen: Screen;
    buffer: string[];
    cursorX: number;
    cursorY: number;
    headerText: string;
    inputBoxText: string;
    inputBoxTextXAxisMargin: number;
    inputBoxTextXAxisPadding: number;
    borderWidth: number;
    headingHeight: number;
    displayExitMessageForCtrlC: boolean;
    constructor();
    getInputBoxWidth(): number;
    topLeftPosition(): void;
    header(a: string): void;
    display(): void;
    createInputBox(): InputBox;
    inputBox(): void;
}
//# sourceMappingURL=terminal.d.ts.map