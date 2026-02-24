import readline from "node:readline";

export function createPrompt() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

export function question(rl, prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

export async function selectMode(rl) {
  console.log("\nSelect learning mode:");
  console.log("  1) Guided  - browse tracks and eligible topics");
  console.log("  2) Custom  - enter your own topic");

  while (true) {
    const answer = (await question(rl, "Choice [1/2]: ")).trim();
    if (answer === "1") return "guided";
    if (answer === "2") return "custom";
    console.log("Please enter 1 or 2.");
  }
}

export async function confirmNode(rl, node) {
  const answer = (await question(rl, `Start session on "${node.title}" [y/n]: `)).trim().toLowerCase();
  return answer === "y" || answer === "yes";
}
