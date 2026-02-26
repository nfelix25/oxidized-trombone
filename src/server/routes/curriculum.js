import { Router } from "express";
import { allCurricula, getCurriculumForLanguage } from "../../curriculum/allCurricula.js";

const router = Router();

/**
 * GET /api/curriculum
 * GET /api/curriculum?language=:lang
 *
 * Returns nodes and tracks for all curricula or filtered by language.
 */
router.get("/", (_req, res) => {
  const { language } = _req.query;
  const curriculum = language ? getCurriculumForLanguage(language) : allCurricula;
  res.json({ nodes: curriculum.nodes, tracks: curriculum.tracks });
});

export default router;
