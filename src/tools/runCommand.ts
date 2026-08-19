import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const TIMEOUT_MS = 30_000;
const MAX_OUTPUT_CHARS = 8_000;

// Captured once at startup — this is the directory the user launched the CLI from.
const LAUNCH_DIR = process.cwd();

/**
 * Runs a shell command and returns its stdout + stderr.
 * Use for tasks that have no dedicated tool: running tests, installing packages,
 * building the project, git operations, etc.
 * Avoid for file reads/writes — use readFile/writeFile instead.
 * Working directory defaults to "." (cwd of the process).
 */
export default async function runCommand(
  command: string,
  cwd: string = LAUNCH_DIR
): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd,
      timeout: TIMEOUT_MS,
      maxBuffer: 1024 * 512
    });

    let output = "";
    if (stdout) output += stdout;
    if (stderr) output += stderr ? `\n[stderr]\n${stderr}` : "";
    output = output.trim();

    if (!output) return `Command completed with no output.`;
    if (output.length > MAX_OUTPUT_CHARS) {
      return output.slice(0, MAX_OUTPUT_CHARS) + `\n... [output truncated at ${MAX_OUTPUT_CHARS} chars]`;
    }
    return output;
  } catch (err: any) {
    const msg = err.stdout || err.message || String(err);
    const stderr = err.stderr ? `\n[stderr] ${err.stderr}` : "";
    return `Command failed (exit ${err.code ?? "?"}): ${msg}${stderr}`.slice(0, MAX_OUTPUT_CHARS);
  }
}
