export const tools = [
  {
    functionDeclarations: [
      // ─── READ ──────────────────────────────────────────────────────────────
      {
        name: "readFile",
        description: `Read the full text content of a file.
Use this after you already know the file path (from listDirectory, searchFiles, or user input).
Do NOT use this to scan a whole project — only read files that are likely relevant.
Do NOT re-read a file you have already read in this conversation.
For large files, consider searchText to find specific sections first.`,
        parameters: {
          type: "OBJECT",
          properties: {
            path: {
              type: "STRING",
              description: "Absolute or relative path to the file to read."
            }
          },
          required: ["path"]
        }
      },

      // ─── LIST ──────────────────────────────────────────────────────────────
      {
        name: "listDirectory",
        description: `List the files and subdirectories inside a directory (one level deep).
Use this to understand the structure of an unfamiliar directory before reading files.
Use searchFiles instead when you need to find a specific file by name across the whole project.`,
        parameters: {
          type: "OBJECT",
          properties: {
            path: {
              type: "STRING",
              description: "Path to the directory to list."
            }
          },
          required: ["path"]
        }
      },

      // ─── SEARCH FILES ──────────────────────────────────────────────────────
      {
        name: "searchFiles",
        description: `Recursively search for files or directories whose NAME matches a pattern.
Supports wildcards: * (any chars) and ? (one char). Case-insensitive.
Common noise directories (node_modules, .git, dist, build) are automatically skipped.
Use this when you don't know where a file is, before trying to read it.
Use searchText instead when you want to search file CONTENTS.
Examples:
  - pattern="auth*.ts"        → find all auth-related TypeScript files
  - pattern="*.config.js"     → find all JS config files
  - pattern="README*"         → find readme files`,
        parameters: {
          type: "OBJECT",
          properties: {
            pattern: {
              type: "STRING",
              description: "Filename pattern to match (supports * and ? wildcards)."
            },
            directory: {
              type: "STRING",
              description: "Root directory to start the search from. Defaults to '.' (current working directory)."
            },
            maxResults: {
              type: "NUMBER",
              description: "Maximum number of results to return. Default is 50."
            }
          },
          required: ["pattern"]
        }
      },

      // ─── SEARCH TEXT ───────────────────────────────────────────────────────
      {
        name: "searchText",
        description: `Recursively search FILE CONTENTS for a text string or regex pattern.
Returns matching lines with their file path and line number — like grep.
Use this to find: function definitions, class names, variable usages, error messages, imports, etc.
Use fileGlob to narrow the search to specific file types (e.g. "*.ts", "*.py").
Common noise dirs (node_modules, .git, dist) are automatically skipped.
Do NOT use this to read whole files — use readFile after finding the relevant location.
Examples:
  - pattern="function login"  fileGlob="*.ts"   → find where login is defined
  - pattern="TODO"            fileGlob="*"      → find all TODO comments
  - pattern="import.*axios"                     → find all axios imports`,
        parameters: {
          type: "OBJECT",
          properties: {
            pattern: {
              type: "STRING",
              description: "Text string or regex pattern to search for."
            },
            directory: {
              type: "STRING",
              description: "Root directory to search in. Defaults to '.' (current working directory)."
            },
            fileGlob: {
              type: "STRING",
              description: "Glob pattern to filter which files to search, e.g. '*.ts', '*.py', '*'. Defaults to '*'."
            },
            maxResults: {
              type: "NUMBER",
              description: "Maximum number of matching lines to return. Default is 50."
            }
          },
          required: ["pattern"]
        }
      },

      // ─── FILE INFO ─────────────────────────────────────────────────────────
      {
        name: "getFileInfo",
        description: `Get metadata about a file or directory: type, size, extension, created/modified timestamps.
Use this to check if a file exists before reading or writing it.
Much cheaper than readFile when you only need metadata, not content.`,
        parameters: {
          type: "OBJECT",
          properties: {
            path: {
              type: "STRING",
              description: "Path to the file or directory to inspect."
            }
          },
          required: ["path"]
        }
      },

      // ─── WRITE FILE ────────────────────────────────────────────────────────
      {
        name: "writeFile",
        description: `Create a new file or completely overwrite an existing file with the given content.
Parent directories are created automatically if they don't exist.
Use this when:
  - Creating a new file from scratch
  - The changes are large enough that editing line-by-line would be error-prone
IMPORTANT: Always read the existing file first with readFile before overwriting it,
so you don't accidentally lose content. Use editFile for small, targeted changes instead.`,
        parameters: {
          type: "OBJECT",
          properties: {
            path: {
              type: "STRING",
              description: "Path of the file to create or overwrite."
            },
            content: {
              type: "STRING",
              description: "Full text content to write to the file."
            }
          },
          required: ["path", "content"]
        }
      },

      // ─── EDIT FILE ─────────────────────────────────────────────────────────
      {
        name: "editFile",
        description: `Make a surgical text replacement in an existing file.
Replaces the FIRST occurrence of oldText with newText.
Prefer this over writeFile when changing a small portion of a file.
IMPORTANT workflow:
  1. Read the file with readFile first.
  2. Copy the exact text you want to replace (including correct indentation/whitespace) as oldText.
  3. Provide the replacement as newText.
If oldText is not found exactly, the tool returns an error — check your spacing and try again.`,
        parameters: {
          type: "OBJECT",
          properties: {
            path: {
              type: "STRING",
              description: "Path to the file to edit."
            },
            oldText: {
              type: "STRING",
              description: "The exact text to find and replace. Must match the file contents character-for-character, including indentation."
            },
            newText: {
              type: "STRING",
              description: "The text to substitute in place of oldText."
            }
          },
          required: ["path", "oldText", "newText"]
        }
      },

      // ─── RUN COMMAND ───────────────────────────────────────────────────────
      {
        name: "runCommand",
        description: `Run a shell command and return its stdout and stderr output.
Use for tasks that no other tool covers: running tests, building the project,
installing packages, git operations, linting, formatting, etc.
Do NOT use this to read files — use readFile instead.
Do NOT use this to list a directory — use listDirectory instead.
Always prefer a specific tool over a shell command when one exists.
Keep commands short and safe. Avoid destructive operations (rm -rf, etc.) unless the user explicitly requested them.
Output is truncated at ~8000 characters for very long results.`,
        parameters: {
          type: "OBJECT",
          properties: {
            command: {
              type: "STRING",
              description: "The shell command to execute."
            },
            cwd: {
              type: "STRING",
              description: "Working directory for the command. Defaults to '.' (process cwd)."
            }
          },
          required: ["command"]
        }
      }
    ]
  }
];
