import dotenv from "dotenv";

dotenv.config();
import type { message } from "./types/message.js";
import Terminal from "./tui/terminal.js";
import terminalRawMode from "./utils/terminalRawMode.js";
import setupKeyboard from "./input/keyboard.js";
import { ANSI } from "./utils/escapeSequences.js";
import type { model } from "./agent/aiModels/gemini.js";
import { askGemini } from "./agent/aiModels/gemini.js";
import axios from "axios";

console.clear();
terminalRawMode();

const minTUIScreenHeight = parseInt(process.env.minTUIScreenHeight ?? "20")
const minTUIScreenWidth = parseInt(process.env.minTUIScreenWidth ?? "40")
const geminiModel: model = (process.env.geminiModel || "2.5-flash") as model

const history: message[] = [];

const main = new Terminal();

setupKeyboard({
  onText(text: string) {
    main.inputBoxText += text
    console.clear()
    main.inputBox()
    main.display()
  },

  onBackspace() {
    main.inputBoxText = main.inputBoxText.slice(0, -1)
    console.clear()
    main.inputBox()
    main.display()
    return;
  },

  onCtrlC() {
    if (main.screen.width < minTUIScreenWidth || main.screen.height < minTUIScreenHeight) {
      process.stdin.setRawMode(false)
      process.exit()
    }
    if (!main.displayExitMessageForCtrlC) {
      main.displayExitMessageForCtrlC = true
      setTimeout(() => {
        main.displayExitMessageForCtrlC = false;
        console.clear()
        main.display()

      }, 1500)
      main.topLeftPosition()
      main.inputBox()
      main.display()
      return;
    }
    process.stdin.setRawMode(false)
    process.exit()
  },

  async onEnter(): Promise<void> {
    let text = main.inputBoxText.trim()
    if (!text) return;

    main.inputBoxText = ""

    let prompt: message = {
      role: "user",
      text: text
    }

    history.push(prompt)

    main.conversationHistoryText = history.map(
      msg => `${msg.role === "user" ? "You\n" : "AI\n"}${msg.text}`
    ).join(' ')
    main.buffer[1] = main.conversationHistoryText

    console.clear()
    main.inputBox()
    main.display()

    try {
      const response = await askGemini(geminiModel, history)
      history.push({ role: "model", text: response })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          history.push({ role: "model", text: "You have hit the rate limit" })
        } else if (err.response?.status === 404) {
          history.push({ role: "model", text: "You have invalid model or key" })
        }
      } else {
        history.push({ role: "model", text: err as string })
      }
    }

    main.conversationHistoryText = history.map(
      msg => `${msg.role === "user" ? "You\n" : "AI\n"}${msg.text}`
    ).join('\n')
    main.buffer[1] = main.conversationHistoryText

    console.clear()
    main.inputBox()
    main.display()
  }
})

process.stdout.on("resize", () => {
  console.clear()
  let errorMessage = "This TUI needs " + minTUIScreenHeight + " height and " + minTUIScreenWidth + " width at least"
  if (main.screen.height < minTUIScreenHeight || main.screen.width < minTUIScreenWidth) {
    console.clear()
    console.log(errorMessage)
    process.stdout.write(ANSI.CURSOR_HIDE)
  } else {
    process.stdout.write(ANSI.CURSOR_SHOW)
    main.header("WELCOME TO AI CLI");
    main.inputBox()
    main.display()
  }
});

console.clear()
let errorMessage = "This TUI needs " + minTUIScreenHeight + " height and " + minTUIScreenWidth + " width at least"
if (main.screen.height < minTUIScreenHeight || main.screen.width < minTUIScreenWidth) {
  console.clear()
  console.log(errorMessage)
  process.stdout.write(ANSI.CURSOR_HIDE)
} else {
  process.stdout.write(ANSI.CURSOR_SHOW)
  main.header("WELCOME TO AI CLI");
  main.inputBox()
  main.display()
}

