import readline from "readline";
export default function setupKeyboard(cb) {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "return") {
            cb.onEnter();
            return;
        }
        if (key.name === "backspace") {
            cb.onBackspace();
            return;
        }
        if (key.ctrl && key.name === "c") {
            cb.onCtrlC();
            return;
        }
        if (!key.ctrl && str)
            cb.onText(str);
    });
}
//# sourceMappingURL=keyboard.js.map