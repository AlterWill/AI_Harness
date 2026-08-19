export const ANSI = {
    CLEAR_SCREEN: "\x1B[2J",
    ERASE_DOWN: "\x1B[J", // erase from cursor to end of screen (no blank flash)
    TOP_LEFT_POSISTION: "\x1B[H",
    BOTTOM_RIGHT_POSISTION: "\x1B[J",
    CURSOR_HIDE: "\x1B[?25l",
    CURSOR_SHOW: "\x1B[?25h",
    cursorTo(row, col) {
        return `\x1B[${row};${col}H`;
    }
};
//# sourceMappingURL=escapeSequences.js.map