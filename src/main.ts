import dotenv from "dotenv";

dotenv.config();
import type { message } from "./types/message.js";
import Terminal from "./tui/terminal.js";
import terminalRawMode from "./utils/terminalRawMode.js";
import setupKeyboard from "./input/keyboard.js";
import { ANSI } from "./utils/escapeSequences.js";

const minTUIScreenHeight = 20;
const minTUIScreenWidth = 20

console.clear();
terminalRawMode();

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
  onEnter(): void {
  }
})

process.stdout.on("resize", () => {
  console.clear()
  let errorMessage = "This TUI needs " + minTUIScreenHeight + " height and " + minTUIScreenWidth + " width at least"
  if (main.screen.height < minTUIScreenHeight || main.screen.width < minTUIScreenWidth) {
    console.clear()
    console.log(errorMessage)
    process.stdin.write(ANSI.CURSOR_HIDE)
  } else {
    process.stdin.write(ANSI.CURSOR_SHOW)
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
  process.stdin.write(ANSI.CURSOR_HIDE)
} else {
  process.stdin.write(ANSI.CURSOR_SHOW)
  main.header("WELCOME TO AI CLI");
  main.inputBox()
  main.display()
}

