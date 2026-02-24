import { spawn } from "node:child_process";

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

export function runCargoTest(cwd) {
  return runCommand("cargo", ["test", "-q"], { cwd });
}
