import { createCurriculumGraph, createNode } from "./model.js";

const nodes = [
  createNode({
    id: "A200",
    title: "Ownership mental model",
    track: "foundations",
    depthTarget: "D3",
    prerequisites: [],
    misconceptionTags: ["own.move.after_move_use"],
    keywords: ["ownership", "moves", "stack", "heap"]
  }),
  createNode({
    id: "A202",
    title: "Shared borrowing",
    track: "foundations",
    depthTarget: "D3",
    prerequisites: ["A200"],
    misconceptionTags: ["borrow.shared_then_mut_conflict"],
    keywords: ["borrow", "shared", "reference"]
  }),
  createNode({
    id: "A203",
    title: "Mutable references and aliasing",
    track: "foundations",
    depthTarget: "D3",
    prerequisites: ["A200", "A202"],
    misconceptionTags: [
      "borrow.two_mut_refs",
      "borrow.shared_then_mut_conflict",
      "borrow.reborrow_confusion"
    ],
    keywords: ["mutable", "aliasing", "borrowing", "references"]
  }),
  createNode({
    id: "A204",
    title: "Borrow scopes and NLL",
    track: "foundations",
    depthTarget: "D3",
    prerequisites: ["A203"],
    misconceptionTags: ["borrow.reborrow_confusion"],
    keywords: ["scope", "nll", "lifetimes"]
  }),
  createNode({
    id: "A208",
    title: "Lifetime annotations in functions",
    track: "foundations",
    depthTarget: "D2",
    prerequisites: ["A204"],
    misconceptionTags: ["life.missing_annotation"],
    keywords: ["lifetime", "annotations", "references"]
  }),
  createNode({
    id: "A500",
    title: "Vec ownership patterns",
    track: "collections",
    depthTarget: "D3",
    prerequisites: ["A203"],
    misconceptionTags: ["coll.vec_reallocation_reference_invalidity"],
    keywords: ["vec", "collections", "ownership"]
  }),
  createNode({
    id: "A503",
    title: "Iterator ownership modes",
    track: "collections",
    depthTarget: "D3",
    prerequisites: ["A500"],
    misconceptionTags: ["iter.iter_vs_into_iter"],
    keywords: ["iter", "into_iter", "iter_mut", "ownership"]
  }),
  createNode({
    id: "A701",
    title: "Async fn ownership effects",
    track: "async",
    depthTarget: "D2",
    prerequisites: ["A203"],
    misconceptionTags: ["async.lifetime_across_await_confusion"],
    keywords: ["async", "await", "ownership"]
  })
];

const tracks = {
  foundations: {
    id: "foundations",
    title: "Ownership and Borrowing",
    nodeIds: ["A200", "A202", "A203", "A204", "A208"]
  },
  collections: {
    id: "collections",
    title: "Collections and Iterators",
    nodeIds: ["A500", "A503"]
  },
  async: {
    id: "async",
    title: "Async Foundations",
    nodeIds: ["A701"]
  }
};

export const seedCurriculum = createCurriculumGraph(nodes, tracks);
