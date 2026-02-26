import { spawn } from "node:child_process";
import { getLanguageConfig } from "../config/languages.js";

export function runCommand(command, args = [], options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("close", (code) => {
      resolve({
        command: [command, ...args].join(" "),
        code,
        stdout,
        stderr,
        ok: code === 0
      });
    });
  });
}

export function runLanguageTest(cwd, language = "rust") {
  const [cmd, ...args] = getLanguageConfig(language).testCommand;
  return runCommand(cmd, args, { cwd });
}

export async function runExercise(workspaceDir, language = "rust") {
  const result = await runLanguageTest(workspaceDir, language);
  return {
    workspaceDir,
    language,
    command: result.command,
    exitCode: result.code,
    ok: result.ok,
    stdout: result.stdout,
    stderr: result.stderr,
    ranAt: new Date().toISOString()
  };
}

/**
 * Stream test output line-by-line via onLine callback as the subprocess runs.
 * Resolves with the same shape as runExercise when the process exits.
 *
 * @param {string} workspaceDir
 * @param {string} language
 * @param {(line: string) => void} onLine  Called for each line from stdout/stderr
 */
export function runExerciseStreaming(workspaceDir, language = "rust", onLine = () => {}) {
  const [cmd, ...args] = getLanguageConfig(language).testCommand;
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd: workspaceDir,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";
    let stdoutBuf = "";
    let stderrBuf = "";

    function flushLines(buf, newChunk) {
      const combined = buf + newChunk;
      const lines = combined.split("\n");
      const remaining = lines.pop(); // last element may be incomplete
      for (const line of lines) {
        onLine(line + "\n");
      }
      return remaining;
    }

    child.stdout.on("data", (chunk) => {
      const str = chunk.toString();
      stdout += str;
      stdoutBuf = flushLines(stdoutBuf, str);
    });

    child.stderr.on("data", (chunk) => {
      const str = chunk.toString();
      stderr += str;
      stderrBuf = flushLines(stderrBuf, str);
    });

    child.on("close", (code) => {
      // Flush any remaining partial line
      if (stdoutBuf) onLine(stdoutBuf);
      if (stderrBuf) onLine(stderrBuf);
      resolve({
        workspaceDir,
        language,
        command: [cmd, ...args].join(" "),
        exitCode: code,
        ok: code === 0,
        stdout,
        stderr,
        ranAt: new Date().toISOString()
      });
    });
  });
}
