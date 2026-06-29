# AI Harness TODO

## Phase 1: Terminal Foundation

### Terminal Setup

* [x] Enable terminal raw mode
* [x] Detect terminal width and height
* [x] Handle Ctrl+C gracefully
* [x] Create basic terminal class
* [x] Create central application state
* [x] Handle terminal resize events

### Rendering System

* [x] Create header section
* [x] Create input section
* [x] Create box rendering system
* [x] Create border style system
* [x] Create padding system
* [x] Create message history section
* [x] Render entire screen from state
* [x] Clear and redraw screen correctly
* [x] Prevent visual flickering
* [x] Create screen buffer

### Input System

* [x] Capture keyboard input
* [x] Display typed characters
* [x] Handle Backspace
* [x] Handle Enter
* [x] Handle Arrow Keys
* [ ] Command history
* [ ] Multi-line editing

### Text Processing

* [x] Split text by length
* [x] Split text by words
* [x] Text alignment (center/left)
* [x] Text wrapping for chat messages
* [x] Markdown-aware wrapping

### Message History

* [x] Store user messages
* [x] Display message history
* [x] Support scrolling
* [x] Keep input box fixed at bottom

---

## Phase 2: Gemini Integration

### API Layer

* [x] Move Gemini code into its own file
* [x] Create Gemini client/API function
* [x] Send user prompts
* [x] Receive model responses
* [x] Handle API errors
* [x] Display loading state

### Chat Flow

* [x] Enter submits message
* [x] User message appears instantly
* [x] Gemini response appears after request
* [x] Save conversation history
* [x] Send previous messages as context

---

## Phase 3: Rendering Engine

### Screen Buffer

* [ ] Create frame buffer
* [ ] Draw widgets into buffer
* [ ] Render buffer to terminal
* [ ] Layer multiple widgets
* [ ] Support widget positioning

### Rendering Optimization

* [ ] Compare previous frame to current frame
* [ ] Diff rendering
* [ ] Render only changed lines
* [ ] Eliminate flickering

---

## Phase 4: Widget System

### Core Widgets

* [x] Box widget
* [ ] Header widget
* [x] Input widget
* [ ] Chat widget
* [ ] Scroll view widget

### Layout

* [ ] Vertical layouts
* [ ] Horizontal layouts
* [ ] Automatic sizing
* [ ] Responsive resizing

---

## Phase 5: AI Harness Core

### Task System

* [ ] Create task structure
* [ ] Create todo list structure
* [ ] Parse model output into tasks
* [ ] Display active task

### Agent Loop

* [ ] User gives goal
* [ ] Model creates plan
* [ ] Model selects next task
* [ ] Model executes task
* [ ] Model reviews result
* [ ] Repeat until complete

### Critic System

* [ ] Create critic prompt
* [ ] Review model outputs
* [ ] Detect mistakes
* [ ] Request corrections
* [ ] Retry failed steps

---

## Phase 6: Tool Calling

### Tool Framework

* [x] Define tool interface
* [x] Register tools
* [x] Execute tool calls
* [x] Return tool results to model

### Basic Tools

* [x] File reader
* [ ] File writer
* [x] Directory listing
* [ ] Command execution

### Safety

* [ ] Confirm dangerous commands
* [ ] Restrict file access
* [ ] Handle tool errors

---

## Phase 7: Polish

### User Experience

* [ ] Session saving
* [ ] Configuration file
* [ ] Themes
* [ ] Better layouts

### Advanced Features

* [ ] Multiple models
* [ ] Local models
* [ ] Memory system
* [ ] Cost tracking
* [ ] Plugin system

---

# Current Goal

Focus on **AI capabilities, structured outputs, and tool integration**:

* [ ] **Enforce Structured JSON Outputs**: Add schema validation support to [askGemini](file:///home/alterwill/Github/100xDevs/terminalAiChat/src/agent/aiModels/gemini.ts#L10) using Gemini's native `responseSchema` and `responseMimeType`.
* [ ] **Define the Tool Interface & Registry**: Create a system for defining local tools (e.g., `readFile`, `writeFile`, `executeCommand`) that Gemini can invoke.
* [x] **Register Tools with Gemini**: Update [askGemini](file:///home/alterwill/Github/100xDevs/terminalAiChat/src/agent/aiModels/gemini.ts#L10) to declare tools using native function calling (`functionDeclarations`).
* [ ] **Execute Agent Loop (Planner-Executor-Critic)**: Create the core orchestrator loop (e.g., in `src/agent/loop.ts`) to manage goals, break them down into tasks, run them, and verify success.
* [ ] **Add Human-in-the-Loop Safety Gates**: Implement interactive approval prompts (`y/n`) in the TUI input loop before the agent runs modifying tools or terminal commands.

---

## How to Build and Run (using pnpm)

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure Environment Variables**:
   Copy the environment template and fill in your `GEMINI_API_KEY`:
   ```bash
   cp .env.example .env
   ```

3. **Build/Compile the TypeScript code**:
   ```bash
   pnpm build
   ```

4. **Run the Application**:
   ```bash
   pnpm start
   ```


## What to Do Next

Now that the TUI foundation, basic tools registry, function calling flow, and Gemini API integrations are complete and fully functional, here are the next priority steps to build the AI Harness:

1. **Implement JSON Schema Support**: Add schema validation to the Gemini REST API calls in [gemini.ts](file:///home/alterwill/Github/100xDevs/terminalAiChat/src/agent/aiModels/gemini.ts) so you can get guaranteed parseable JSON arrays for task lists.
2. **Implement Write/Execution Tools**: Write helper functions for file writing and command execution, describing their arguments with JSON schemas and registering them in [index.ts](file:///home/alterwill/Github/100xDevs/terminalAiChat/src/tools/index.ts).
3. **Add Human-in-the-Loop Approval Gate**: Add prompt logic inside the agent execution loop or TUI to require user approval (e.g., `y/n`) before running modifying tools (like file write or terminal commands).
4. **Coordinate the Orchestrated Agent Loop**: Build the full Planner-Executor-Critic loop (e.g., in `src/agent/loop.ts`) to break goals down into structured tasks, execute them with tools, verify outcomes, and handle retries.
