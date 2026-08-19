import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

import type { message } from "./types/message.js";
import Terminal from "./tui/terminal.js";
import terminalRawMode from "./utils/terminalRawMode.js";
import setupKeyboard from "./input/keyboard.js";
import { ANSI } from "./utils/escapeSequences.js";
import type { model } from "./agent/aiModels/gemini.js";
import Spinner from "./utils/spinner.js";
import agentLoop, { SYSTEM_MESSAGE, SYSTEM_ACK } from "./agent/agent.js";
import { tools } from "./tools/index.js";
import { formatHistory } from "./utils/formatHistory.js";

console.clear();
terminalRawMode();

const minTUIScreenHeight = parseInt(process.env.minTUIScreenHeight ?? "20")
const minTUIScreenWidth = parseInt(process.env.minTUIScreenWidth ?? "40")
const geminiModel: model = (process.env.geminiModel || "gemini-2.5-flash") as model

const history: message[] = [SYSTEM_MESSAGE, SYSTEM_ACK];

const main = new Terminal();

setupKeyboard({
  onText(text: string): void {
    main.inputBoxText += text
    main.inputBox()
    main.display()
  },

  onBackspace(): void {
    main.inputBoxText = main.inputBoxText.slice(0, -1)
    main.inputBox()
    main.display()
    return;
  },

  onCtrlC(): void {
    if (main.screen.width < minTUIScreenWidth || main.screen.height < minTUIScreenHeight) {
      process.stdout.write(ANSI.CURSOR_SHOW)
      process.stdin.setRawMode(false)
      process.exit()
    }
    if (!main.displayExitMessageForCtrlC) {
      main.displayExitMessageForCtrlC = true
      setTimeout(() => {
        main.displayExitMessageForCtrlC = false;
        main.display()

      }, 1500)
      main.topLeftPosition()
      main.inputBox()
      main.display()
      return;
    }
    process.stdout.write(ANSI.CURSOR_SHOW)
    process.stdin.setRawMode(false)
    process.exit()
  },

  onUp(): void {
    main.scrollOffset++;
    main.inputBox()
    main.display()
  },

  onDown(): void {
    main.scrollOffset = Math.max(0, main.scrollOffset - 1)
    main.inputBox()
    main.display()
  },

  async onEnter(): Promise<void> {
    main.scrollOffset = 0
    let text = main.inputBoxText.trim()
    if (!text) return;

    main.inputBoxText = ""
    main.scrollOffset = 0

    let prompt: message = {
      role: "user",
      text: text
    }

    let currentStatus = "Thinking";
    const loadingAnimation = new Spinner()
    loadingAnimation.onTick = (frame: string) => {
      main.buffer[4] = `${frame} ${currentStatus}`
      main.inputBox()
      main.display()
    }
    loadingAnimation.start()

    history.push(prompt)

    main.conversationHistoryText = formatHistory(history)
    main.buffer[1] = main.conversationHistoryText

    main.inputBox()
    main.display()

    try {
      await agentLoop(
        { model: geminiModel },
        history,
        tools,
        (status?: string) => {
          currentStatus = status || "Thinking";
          main.conversationHistoryText = formatHistory(history);
          main.buffer[1] = main.conversationHistoryText;
          main.inputBox();
          main.display();
        }
      )
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          history.push({ role: "model", text: "You have hit the rate limit" })
        } else if (err.response?.status === 404) {
          history.push({ role: "model", text: "You have invalid model or key" })
        } else {
          history.push({ role: "model", text: `API Error: ${err.message}` })
        }
      } else {
        history.push({ role: "model", text: String(err) })
      }
    } finally {
      loadingAnimation.stop()
      main.buffer[4] = ""
    }

    main.conversationHistoryText = formatHistory(history)
    main.buffer[1] = main.conversationHistoryText

    main.inputBox()
    main.display()
  }
})

function show(): void {
  console.clear()
  let errorMessage = "This TUI needs more than " + minTUIScreenHeight + " height and " + minTUIScreenWidth + " width at least"
  if (main.screen.height < minTUIScreenHeight || main.screen.width < minTUIScreenWidth) {
    console.log(errorMessage)
    process.stdout.write(ANSI.CURSOR_HIDE)
  } else {
    process.stdout.write(ANSI.CURSOR_SHOW)
    main.header("WELCOME TO AI CLI");
    main.inputBox()
    main.display()
  }
}

process.stdout.on("resize", () => {
  show()
});

show()
