import { promises as fs } from "node:fs";
import path from "node:path";

async function writeFiles(rootDir, files) {
  for (const file of files) {
    const outPath = path.join(rootDir, file.path);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, file.content);
  }
}

export async function materializeExercise(rootDir, exercisePack) {
  await writeFiles(rootDir, exercisePack.starter_files ?? []);
  await writeFiles(rootDir, exercisePack.test_files ?? []);
  return {
    rootDir,
    starterCount: exercisePack.starter_files?.length ?? 0,
    testCount: exercisePack.test_files?.length ?? 0
  };
}
