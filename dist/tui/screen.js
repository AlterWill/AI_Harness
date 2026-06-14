import { ANSI } from "../utils/escapeSequences.js";
export default class Screen {
    width;
    height;
    constructor() {
        this.width = process.stdout.columns || 80;
        this.height = process.stdout.rows || 24;
        // Listen for resize events to dynamically update dimensions
        process.stdout.on("resize", () => {
            this.width = process.stdout.columns || 80;
            this.height = process.stdout.rows || 24;
        });
    }
    clear() {
        process.stdout.write(ANSI.CLEAR_SCREEN);
        process.stdout.write(ANSI.CURSOR_HOME);
    }
    cursorTo(row, col) {
        process.stdout.write(ANSI.cursorTo(row, col));
    }
    write(text) {
        process.stdout.write(text);
    }
}
//# sourceMappingURL=screen.js.map