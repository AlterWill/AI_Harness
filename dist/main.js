import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
import Terminal from "./terminal.js";
import terminalRawMode from "./utils/terminalRawMode.js";
import setupKeyboard from "./input/keyboard.js";
import { ANSI } from "./utils/escapeSequences.js";
const minTUIScreenHeight = 20;
const minTUIScreenWidth = 20;
console.clear();
terminalRawMode();
const history = [];
const main = new Terminal();
async function sentPrompt(prompt) {
    let result = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        contents: history.map((m) => ({
            role: m.role,
            parts: [{ text: m.text }],
        })),
    });
    return result.data.candidates?.[0]?.content?.parts?.[0]?.text;
}
setupKeyboard({
    onText(text) {
        main.inputBoxText += text;
        console.clear();
        main.inputBox();
        main.display();
    },
    onBackspace() {
        main.inputBoxText = main.inputBoxText.slice(0, -1);
        console.clear();
        main.inputBox();
        main.display();
        return;
    },
    onCtrlC() {
        if (main.screen.width < minTUIScreenWidth || main.screen.height < minTUIScreenHeight) {
            process.stdin.setRawMode(false);
            process.exit();
        }
        if (!main.displayExitMessageForCtrlC) {
            main.displayExitMessageForCtrlC = true;
            setTimeout(() => {
                main.displayExitMessageForCtrlC = false;
                console.clear();
                main.display();
            }, 1500);
            main.topLeftPosition();
            main.inputBox();
            main.display();
            return;
        }
        process.stdin.setRawMode(false);
        process.exit();
    },
    onEnter() {
    }
});
process.stdout.on("resize", () => {
    console.clear();
    let errorMessage = "This TUI needs " + minTUIScreenHeight + " height and " + minTUIScreenWidth + " width at least";
    if (main.screen.height < minTUIScreenHeight || main.screen.width < minTUIScreenWidth) {
        console.clear();
        console.log(errorMessage);
        process.stdin.write(ANSI.CURSOR_HIDE);
    }
    else {
        process.stdin.write(ANSI.CURSOR_SHOW);
        main.header("WELCOME TO AI CLI");
        main.inputBox();
        main.display();
    }
});
console.clear();
let errorMessage = "This TUI needs " + minTUIScreenHeight + " height and " + minTUIScreenWidth + " width at least";
if (main.screen.height < minTUIScreenHeight || main.screen.width < minTUIScreenWidth) {
    console.clear();
    console.log(errorMessage);
    process.stdin.write(ANSI.CURSOR_HIDE);
}
else {
    process.stdin.write(ANSI.CURSOR_SHOW);
    main.header("WELCOME TO AI CLI");
    main.inputBox();
    main.display();
}
//# sourceMappingURL=main.js.map