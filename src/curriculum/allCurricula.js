import { createCurriculumGraph } from "./model.js";
import { seedCurriculum } from "./seed.js";
import { cCurriculum } from "./cSeed.js";
import { zigCurriculum } from "./zigSeed.js";
import { pythonCurriculum } from "./pythonSeed.js";
import { cppCurriculum } from "./cppSeed.js";
import { jsCurriculum } from "./jsSeed.js";
import { browserCurriculum } from "./browserSeed.js";
import { rustToolchainCurriculum } from "./rustToolchainSeed.js";
import { typescriptCurriculum } from "./typescriptSeed.js";
import { javascriptCurriculum } from "./javascriptSeed.js";

export const allCurricula = createCurriculumGraph(
  [...seedCurriculum.nodes, ...cCurriculum.nodes, ...zigCurriculum.nodes, ...pythonCurriculum.nodes, ...cppCurriculum.nodes, ...jsCurriculum.nodes, ...browserCurriculum.nodes, ...rustToolchainCurriculum.nodes, ...typescriptCurriculum.nodes, ...javascriptCurriculum.nodes],
  { ...seedCurriculum.tracks, ...cCurriculum.tracks, ...zigCurriculum.tracks, ...pythonCurriculum.tracks, ...cppCurriculum.tracks, ...jsCurriculum.tracks, ...browserCurriculum.tracks, ...rustToolchainCurriculum.tracks, ...typescriptCurriculum.tracks, ...javascriptCurriculum.tracks }
);

export function getCurriculumForLanguage(lang) {
  const filteredNodes = allCurricula.nodes.filter((n) => n.language === lang);
  const nodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredTracks = {};
  for (const [trackId, track] of Object.entries(allCurricula.tracks)) {
    const filteredNodeIds = track.nodeIds.filter((id) => nodeIds.has(id));
    if (filteredNodeIds.length > 0) {
      filteredTracks[trackId] = { ...track, nodeIds: filteredNodeIds };
    }
  }
  return createCurriculumGraph(filteredNodes, filteredTracks);
}
