import { spawn } from "node:child_process";

export function runClaudeExec({
  prompt,
  model,
  command = "claude"
}) {
  const args = ["--print"];
  if (model) args.push("--model", model);
  args.push(prompt ?? "");

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      resolve({ code, stdout, stderr, args });
    });

    child.stdin.end();
  });
}
