import { fileURLToPath } from "node:url";
import { startSession, resumeSession, listSessions, endSession, statusSession, showSession, attemptSession, hintSession, reviewSession, debugSession } from "./session.js";

const COMMANDS = {
  start: startSession,
  show: showSession,
  attempt: attemptSession,
  hint: hintSession,
  review: reviewSession,
  resume: resumeSession,
  list: listSessions,
  end: endSession,
  status: statusSession,
  debug: debugSession
};

export async function runSessionCli(args = process.argv.slice(2)) {
  const [command, ...rest] = args;

  if (!command) {
    console.error("Usage: session <command> [options]");
    console.error("  start [--debug]  Start a new session (shows picker if sessions exist)");
    console.error("  list             List all sessions");
    console.error("  resume [id]      Resume a session by ID prefix or show picker");
    console.error("  show             Re-display the current exercise and workspace path");
    console.error("  attempt          Run cargo test and get reviewer feedback");
    console.error("  hint             Request a progressive hint (L1 → L2 → L3)");
    console.error("  review           Show the latest reviewer verdict");
    console.error("  end              End the current session and show summary");
    console.error("  status           Show current session status (JSON)");
    console.error("  debug <stage>    Run a single stage in isolation (scaffold|starter|test|lesson)");
    process.exitCode = 1;
    return;
  }

  const handler = COMMANDS[command];
  if (!handler) {
    console.error(`Unknown command: ${command}`);
    console.error(`Available commands: ${Object.keys(COMMANDS).join(", ")}`);
    process.exitCode = 1;
    return;
  }

  try {
    await handler(rest);
  } catch (err) {
    const message = { error: err.message, command };
    console.error(JSON.stringify(message));
    process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSessionCli();
}
