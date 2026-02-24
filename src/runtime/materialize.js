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
  if (!exercisePack) {
    throw new Error("materializeExercise requires an exercisePack");
  }

  const starterFiles = exercisePack.starter_files ?? [];
  const testFiles = exercisePack.test_files ?? [];

  if (starterFiles.length === 0 && testFiles.length === 0) {
    throw new Error("materializeExercise: exercisePack has no starter or test files (empty test pack)");
  }

  await fs.mkdir(rootDir, { recursive: true });
  await writeFiles(rootDir, starterFiles);
  await writeFiles(rootDir, testFiles);

  return {
    rootDir,
    starterCount: starterFiles.length,
    testCount: testFiles.length,
    materializedPaths: [
      ...starterFiles.map((f) => path.join(rootDir, f.path)),
      ...testFiles.map((f) => path.join(rootDir, f.path))
    ]
  };
}
