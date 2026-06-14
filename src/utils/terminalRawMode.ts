
export default function terminalRawMode(): void {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
}
