/** ex-6 — First principle: compose descriptor batches with Object.defineProperties
 * Read: LESSON.md § "Engine behavior: compose multiple attributes at once"
 * Test: "applyDescriptorBatch defines every entry via Object.defineProperties and returns the original object reference"
 * Start here: validate descriptorMap keys before calling Object.defineProperties(obj, descriptorMap) and returning obj
 */
export function applyDescriptorBatch(obj, descriptorMap) {
  throw new Error("TODO: implement");
}

/** ex-7 — First principle: align foreign descriptor vocabulary with JavaScript descriptor objects
 * Read: LESSON.md § "Comparison: mapping Python-style schema terms"
 * Test: "mapForeignDescriptor maps a Python-like {readOnly:true} schema to {writable:false,configurable:false} in JS terms"
 * Start here: normalize schema flags into a new object with writable/enumerable/configurable slots
 */
export function mapForeignDescriptor(schema) {
  throw new Error("TODO: implement");
}

/** ex-8 — First principle: promote descriptor metadata into proxy-ready trap plans
 * Read: LESSON.md § "Bridge: preparing descriptor plans for proxies"
 * Test: "promoteDescriptorToTrap merges descriptor metadata and plan defaults to produce a proxy-ready config object referencing earlier outputs"
 * Start here: merge plan defaults with descriptor data and return the combined proxy configuration
 */
export function promoteDescriptorToTrap(plan, descriptor) {
  throw new Error("TODO: implement");
}
