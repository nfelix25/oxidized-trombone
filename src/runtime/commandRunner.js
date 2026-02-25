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
