import readline from "node:readline";
import { getAvailableLanguages } from "../config/languages.js";

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

export async function selectLanguage(rl) {
  const langs = getAvailableLanguages();
  console.log("\nSelect language:");
  langs.forEach((lang, i) => {
    const display = lang.charAt(0).toUpperCase() + lang.slice(1);
    console.log(`  ${i + 1}) ${display}`);
  });

  while (true) {
    const answer = (await question(rl, `Choice [1-${langs.length}]: `)).trim();
    const idx = parseInt(answer, 10) - 1;
    if (idx >= 0 && idx < langs.length) return langs[idx];
    console.log(`Please enter a number between 1 and ${langs.length}.`);
  }
}

export async function confirmNode(rl, node) {
  const answer = (await question(rl, `Start session on "${node.title}" [y/n]: `)).trim().toLowerCase();
  return answer === "y" || answer === "yes";
}
