import readline from "readline"

export type keyboardCallBack = {
  onText: (text: string) => void
  onBackspace: () => void
  onCtrlC: () => void
  onEnter: () => void
}

export default function setupKeyboard(cb: keyboardCallBack) {
  readline.emitKeypressEvents(process.stdin);

  process.stdin.on("keypress", (str, key) => {
    if (key.name === "return") {
      cb.onEnter()
      return;
    }
    if (key.name === "backspace") {
      cb.onBackspace()
      return;
    }
    if (key.ctrl && key.name === "c") {
      cb.onCtrlC()
      return
    }
    if (!key.ctrl && str) cb.onText(str)
  });
}
