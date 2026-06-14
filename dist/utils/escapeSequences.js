export const ANSI = {
    CLEAR_SCREEN: "\x1B[2J",
    CURSOR_HOME: "\x1B[H",
    CURSOR_HIDE: "\x1B[?25l",
    CURSOR_SHOW: "\x1B[?25h",
    cursorTo(row, col) {
        return `\x1B[${row};${col}H`;
    }
};
//# sourceMappingURL=escapeSequences.js.map