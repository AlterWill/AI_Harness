import readline from "readline";
export default function setupKeyboard(cb) {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.on("keypress", (str, key) => {
        if (key) {
            if (key.name === "return" || key.name === "enter") {
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
        }
        const ignoredKeys = ["up", "down", "left", "right", "pageup", "pagedown", "home", "end", "escape"];
        if ((!key || !key.ctrl) && str && (!key.name || !ignoredKeys.includes(key.name))) {
            cb.onText(str);
        }
    });
}
//# sourceMappingURL=keyboard.js.map