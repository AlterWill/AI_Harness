import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
import Terminal from "./tui/terminal.js";
import terminalRawMode from "./utils/terminalRawMode.js";
import setupKeyboard from "./input/keyboard.js";
import { ANSI } from "./utils/escapeSequences.js";
import Spinner from "./utils/spinner.js";
import agentLoop from "./agent/agent.js";
import { tools } from "./tools/index.js";
console.clear();
terminalRawMode();
const minTUIScreenHeight = parseInt(process.env.minTUIScreenHeight ?? "20");
const minTUIScreenWidth = parseInt(process.env.minTUIScreenWidth ?? "40");
const geminiModel = (process.env.geminiModel || "gemini-2.5-flash");
const history = [];
const main = new Terminal();
setupKeyboard({
    onText(text) {
        main.inputBoxText += text;
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
    onUp() {
        main.scrollOffset++;
        console.clear();
        main.inputBox();
        main.display();
    },
    onDown() {
        main.scrollOffset = Math.max(0, main.scrollOffset - 1);
        console.clear();
        main.inputBox();
        main.display();
    },
    async onEnter() {
        main.scrollOffset = 0;
        let text = main.inputBoxText.trim();
        if (!text)
            return;
        main.inputBoxText = "";
        main.scrollOffset = 0;
        let prompt = {
            role: "user",
            text: text
        };
        const loadingAnimation = new Spinner();
        loadingAnimation.onTick = (frame) => {
            main.buffer[4] = `${frame} Thinking`;
            console.clear();
            main.inputBox();
            main.display();
        };
        loadingAnimation.start();
        history.push(prompt);
        main.conversationHistoryText = history
            .map(msg => {
            const text = msg.text || msg.parts?.find(p => typeof p === 'object' && 'text' in p)?.text;
            if (!text)
                return null;
            return `${msg.role === "user" ? "\nYou\n\n" : "\nAI\n\n"}${text}`;
        })
            .filter(Boolean)
            .join('\n');
        main.buffer[1] = main.conversationHistoryText;
        console.clear();
        main.inputBox();
        main.display();
        try {
            await agentLoop({
                model: geminiModel
            }, history, tools);
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 429) {
                    history.push({ role: "model", text: "You have hit the rate limit" });
                }
                else if (err.response?.status === 404) {
                    history.push({ role: "model", text: "You have invalid model or key" });
                }
                else {
                    history.push({ role: "model", text: `API Error: ${err.message}` });
                }
            }
            else {
                history.push({ role: "model", text: String(err) });
            }
        }
        finally {
            loadingAnimation.stop();
            main.buffer[4] = "";
        }
        main.conversationHistoryText = history
            .map(msg => {
            const text = msg.text || msg.parts?.find(p => typeof p === 'object' && 'text' in p)?.text;
            if (!text)
                return null;
            return `${msg.role === "user" ? "\nYou\n\n" : "\nAI\n\n"}${text}`;
        })
            .filter(Boolean)
            .join('\n');
        main.buffer[1] = main.conversationHistoryText;
        console.clear();
        main.inputBox();
        main.display();
    }
});
function show() {
    console.clear();
    let errorMessage = "This TUI needs more than " + minTUIScreenHeight + " height and " + minTUIScreenWidth + " width at least";
    if (main.screen.height < minTUIScreenHeight || main.screen.width < minTUIScreenWidth) {
        console.clear();
        console.log(errorMessage);
        process.stdout.write(ANSI.CURSOR_HIDE);
    }
    else {
        process.stdout.write(ANSI.CURSOR_SHOW);
        main.header("WELCOME TO AI CLI");
        main.inputBox();
        main.display();
    }
}
process.stdout.on("resize", () => {
    show();
});
show();
//# sourceMappingURL=main.js.map