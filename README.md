# AI Harness TODO

## Phase 1: Terminal Foundation

### Terminal Setup

* [x] Enable terminal raw mode
* [x] Detect terminal width and height
* [x] Handle Ctrl+C gracefully
* [x] Create basic terminal class
* [ ] Create central application state
* [ ] Handle terminal resize events

### Rendering System

* [x] Create header section
* [x] Create input section
* [x] Create box rendering system
* [x] Create border style system
* [x] Create padding system
* [ ] Create message history section
* [ ] Render entire screen from state
* [ ] Clear and redraw screen correctly
* [ ] Prevent visual flickering
* [ ] Create screen buffer

### Input System

* [x] Capture keyboard input
* [x] Display typed characters
* [x] Handle Backspace
* [ ] Handle Enter
* [ ] Handle Arrow Keys
* [ ] Command history
* [ ] Multi-line editing

### Text Processing

* [x] Split text by length
* [ ] Split text by words
* [ ] Text alignment (center/left)
* [ ] Text wrapping for chat messages
* [ ] Markdown-aware wrapping

### Message History

* [ ] Store user messages
* [ ] Display message history
* [ ] Support scrolling
* [ ] Keep input box fixed at bottom

---

## Phase 2: Gemini Integration

### API Layer

* [ ] Move Gemini code into its own file
* [ ] Create Gemini client class
* [ ] Send user prompts
* [ ] Receive model responses
* [ ] Handle API errors
* [ ] Display loading state

### Chat Flow

* [ ] Enter submits message
* [ ] User message appears instantly
* [ ] Gemini response appears after request
* [ ] Save conversation history
* [ ] Send previous messages as context

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
* [ ] Input widget
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

* [ ] Define tool interface
* [ ] Register tools
* [ ] Execute tool calls
* [ ] Return tool results to model

### Basic Tools

* [ ] File reader
* [ ] File writer
* [ ] Directory listing
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

Focus only on:

* [ ] Enter key
* [ ] Message history
* [ ] Chat rendering
* [ ] Screen buffer
* [ ] Word wrapping
* [ ] Proper rendering loop

Everything else can wait.

A stable chat UI is the foundation for the harness.

src/
├── main.ts
├── tui/
│   ├── screen.ts
│   └── widgets/
│       ├── box.ts
│       ├── inputBox.ts
│       └── textArea.ts
├── input/
│   └── keyboard.ts
├── chat/
│   └── history.ts
└── utils/
    ├── splitByLength.ts
    └── splitByWords.ts

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

Now that the box widgets and borders are fully type-safe and support presets, here are the next priority steps according to the roadmap:
1. **Handle the Enter Key**: Implement the `onEnter()` callback in [keyboard.ts](file:///home/alterwill/Github/100xDevs/terminalAiChat/src/input/keyboard.ts) so that user input can be submitted.
2. **Message History rendering**: Save messages submitted by the user and render them inside a scrollable history box above the input box.
3. **Terminal Resize Handling**: Dynamically recalculate box dimensions when the terminal dimensions change.
4. **API Integration**: Link the compiled app to the Gemini API using the API key in `.env` to start receiving responses.
