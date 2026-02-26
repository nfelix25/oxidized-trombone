import { promises as fs } from "node:fs";
import path from "node:path";

export async function writeJavaScriptProjectConfig(dir) {
  const packageJson = JSON.stringify(
    {
      name: "exercise",
      version: "1.0.0",
      type: "module",
      private: true
    },
    null,
    2
  );
  await fs.writeFile(path.join(dir, "package.json"), packageJson + "\n");
}
