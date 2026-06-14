export default function terminalRawMode() {
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }
}
//# sourceMappingURL=terminalRawMode.js.map