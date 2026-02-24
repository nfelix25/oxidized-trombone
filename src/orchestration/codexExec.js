import { spawn } from "node:child_process";

export function buildCodexExecArgs({
  prompt,
  schemaPath,
  outputPath,
  cwd,
  model,
  sandbox = "workspace-write",
  approval = "never"
}) {
  const args = ["exec", "--sandbox", sandbox, "--ask-for-approval", approval];
  if (cwd) args.push("--cd", cwd);
  if (model) args.push("--model", model);
  if (schemaPath) args.push("--output-schema", schemaPath);
  if (outputPath) args.push("--output-last-message", outputPath);
  args.push(prompt ?? "-");
  return args;
}

export function runCodexExec({
  prompt,
  schemaPath,
  outputPath,
  cwd,
  model,
  sandbox,
  approval,
  stdinPayload,
  command = "codex"
}) {
  const args = buildCodexExecArgs({
    prompt,
    schemaPath,
    outputPath,
    cwd,
    model,
    sandbox,
    approval
  });

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ["pipe", "pipe", "pipe"] });
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

    if (stdinPayload) {
      child.stdin.write(stdinPayload);
    }
    child.stdin.end();
  });
}
