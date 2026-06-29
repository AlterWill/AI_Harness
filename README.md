# AI Harness

[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js%20v18+-green.svg)](https://nodejs.org/)
[![Gemini](https://img.shields.io/badge/Powered%20By-Google%20Gemini-orange.svg)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AI Harness is an interactive terminal chat client and developer agent orchestrator powered by Google Gemini. It intercepts raw keystrokes to present a custom, framework-free TUI console, and integrates filesystem tools that the model calls autonomously to inspect local directory files. The application is built from scratch in TypeScript and runs on Node.js without relying on heavy external TUI libraries.

*A framework-free terminal AI chat client and agent orchestrator powered by Google Gemini.*

---

## Demo

- **Main UI View**: `![Main Interface View](docs/assets/main_view.png)`
- **Interactive Session**: `![Interactive Session](docs/assets/demo.gif)`

---

## Features

| Feature | Description | Why It Matters |
| :--- | :--- | :--- |
| **Framework-Free TUI** | Built from scratch using native Node.js stdout streams and raw ANSI escape sequences. | Bypasses the resource and layout overhead of heavy terminal libraries like Blessed. |
| **Raw Stdin Key Interceptor** | Captures keyboard signals character-by-character directly from raw TTY input. | Enables real-time backspacing, custom Ctrl+C exit handling, and history scrolling. |
| **Double-Buffered Renderer** | Compiles the full terminal viewport structure in an in-memory buffer before printing. | Eliminates console screen tearing and redraw flicker during fast typing. |
| **Autonomous Agent Loop** | Coordinates multi-step conversation histories and routes Google Gemini API tool calls. | Resolves and executes filesystem tools locally in a closed loop. |
| **Console Markdown Engine** | Integrates Markdown parsing and terminal formatting to style responses and code blocks. | Ensures model responses remain readable and structured in the console. |

---

## Tech Stack

- **TypeScript**: Chosen for strict compile-time type safety across API payloads, terminal dimension budgets, and box layout properties.
- **Node.js**: Serves as the runtime, leveraging native TTY and file system modules to achieve low-level terminal interaction with minimal overhead.
- **Axios**: Used to directly call the Google Gemini REST API, avoiding the dependency footprint of the official SDK while giving precise control over request timeouts and schemas.
- **Marked & marked-terminal**: Converts rich Markdown formatting from the model's response into clean, styled ANSI terminal output.
- **Chalk**: Provides colors and text emphasis throughout the terminal views.

---

## Architecture

AI Harness follows an event-driven, unidirectional flow. Keypress events trigger callback updates that modify the application's central state. The state engine then calculates the terminal layout budget, constructs an in-memory frame buffer, and flushes it to stdout.

Visual layout budgeting splits the screen into three zones: a fixed header, a scrollable conversation log, and a bottom-aligned input box. The rendering engine dynamically computes the vertical height of each region on every resize or redraw event, ensuring no text overflows the visible terminal boundary.

When a user submits a prompt, the system initiates an asynchronous execution loop. If the model returns a tool call (such as requesting a directory list or file contents), the agent runner executes the matching local system tool, appends the output to the message history, and submits it back to Gemini. The loop repeats until the model yields a final text response.

---

## Project Structure

```text
src/
├── agent/       # Coordinates the model REST requests and the tool-calling loop.
├── input/       # Intercepts raw TTY keypress streams and runs callback mappings.
├── tools/       # Implementation and schemas of agent-accessible system tools.
├── tui/         # Frame compositor, layout widgets, and console screen manager.
├── types/       # TypeScript type declarations for layouts, messages, and API structures.
└── utils/       # Helpers for ANSI escape codes, text word wrapping, and loading spinners.
```

---

## Installation

### Prerequisites

- Node.js (v18.0.0 or higher)
- Package manager (`pnpm` recommended, or `npm`/`yarn`)

### Environment Variables

Configure a `.env` file at the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
geminiModel=gemini-2.5-flash
minTUIScreenHeight=20
minTUIScreenWidth=40
```

### Installation Commands

```bash
pnpm install
```

### Run Commands

```bash
pnpm build
pnpm start
```

---

## Interesting Implementation Details

- **In-Memory Frame Double-Buffering**: To prevent screen tearing and terminal flickering on every keystroke, the visual layout is fully assembled in an in-memory string buffer. By combining ANSI clear codes, border drawings, wrapped content, and layout coordinates into a single payload, the engine updates the screen with a single, atomic `process.stdout.write` call.
- **Dynamic Viewport Height Budgeting**: Since console dimensions are dynamic, the TUI computes the history scroll area's budget on the fly: $Height = ScreenHeight - HeaderHeight - InputBoxHeight - SpinnerHeight - Offset$. If the conversation log exceeds this calculated limit, a slice of the history is rendered based on a viewport scroll offset, allowing independent history navigation while keeping the input box locked to the bottom.
- **Raw TTY Keystroke Mapping**: By invoking `process.stdin.setRawMode(true)`, the program bypasses standard "cooked" operating system buffering that waits for carriage returns. This allows the custom keypress listener to capture raw control sequences (such as arrow keys for scrolling and backspace for instant text manipulation) and refresh the interface immediately.
- **Direct REST Agent Loop**: Instead of incorporating the official Google Gen AI SDK, the project communicates directly with Gemini using HTTP requests via Axios. This minimizes the package dependency footprint and provides direct access to candidate fields, thought signatures, and tool-call payloads within the beta REST endpoints.

---

## Future Improvements

- **Workspace Path Validation**: Add strict path resolution and validation checks to prevent directory traversal and restrict tool execution to the active workspace.
- **Interactive Cursor Navigation**: Implement horizontal cursor movement within the input box to allow editing text in the middle of sentences instead of only backspacing from the end.
- **Persistent Chat History**: Add local session serialization to save conversation histories as JSON on disk and load them on startup.
- **Console Shell Execution Tool**: Introduce a sandboxed execution tool that allows the model to run host commands (e.g. compilers or test runners) after explicit user confirmation.

---

## Contributing

Contributions are welcome. Please ensure that all changes compile successfully without strict TypeScript type errors (`pnpm build`). When implementing new tools, add the implementation in `src/tools/`, define the tool schema in `src/tools/index.ts`, and update the execution routes inside `src/agent/agent.ts`.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
